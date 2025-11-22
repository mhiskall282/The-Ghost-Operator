import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { Bounty, Payout, Worker, Proof } from "./model";
import * as GhostBounties from "./abi/GhostBounties";
import * as GhostVault from "./abi/GhostVault";
import { calculateReputation } from "./reputation";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const VAULT_ADDRESS = process.env.VAULT_ADDRESS || "";

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: "https://v2.archive.subsquid.io/network/polygon-mainnet",
    chain: process.env.RPC_URL || "https://polygon-rpc.com",
  })
  .setFinalityConfirmation(75)
  .addLog({
    address: [CONTRACT_ADDRESS],
    topic0: [
      GhostBounties.events.BountyCreated.topic,
      GhostBounties.events.BountyCompleted.topic,
      GhostBounties.events.BountyCancelled.topic,
    ],
  })
  .addLog({
    address: [VAULT_ADDRESS],
    topic0: [
      GhostVault.events.FundsReleased.topic,
    ],
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  const bounties: Map<string, Bounty> = new Map();
  const payouts: Payout[] = [];
  const workers: Map<string, Worker> = new Map();
  const proofs: Proof[] = [];

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      if (log.address === CONTRACT_ADDRESS) {
        if (log.topics[0] === GhostBounties.events.BountyCreated.topic) {
          const event = GhostBounties.events.BountyCreated.decode(log);
          const bounty = new Bounty({
            id: event.bountyId.toString(),
            creator: event.creator.toLowerCase(),
            action: event.action,
            repoOwner: event.repoOwner,
            repoName: event.repoName,
            reward: event.reward,
            status: 0, // Active
            createdAt: BigInt(block.header.timestamp),
            createdAtTimestamp: new Date(block.header.timestamp),
          });
          bounties.set(bounty.id, bounty);
        } else if (log.topics[0] === GhostBounties.events.BountyCompleted.topic) {
          const event = GhostBounties.events.BountyCompleted.decode(log);
          const bounty = bounties.get(event.bountyId.toString());
          if (bounty) {
            bounty.status = 1; // Completed
            bounty.completedBy = event.worker.toLowerCase();
            bounty.completedAt = BigInt(block.header.timestamp);
            bounty.completedAtTimestamp = new Date(block.header.timestamp);
          }
        } else if (log.topics[0] === GhostBounties.events.BountyCancelled.topic) {
          const event = GhostBounties.events.BountyCancelled.decode(log);
          const bounty = bounties.get(event.bountyId.toString());
          if (bounty) {
            bounty.status = 2; // Cancelled
          }
        }
      } else if (log.address === VAULT_ADDRESS) {
        if (log.topics[0] === GhostVault.events.FundsReleased.topic) {
          const event = GhostVault.events.FundsReleased.decode(log);
          const payout = new Payout({
            id: `${event.bountyId}-${block.header.height}-${log.transactionIndex}`,
            bountyId: event.bountyId,
            worker: event.recipient.toLowerCase(),
            amount: event.amount,
            timestamp: BigInt(block.header.timestamp),
            timestampDate: new Date(block.header.timestamp),
          });
          payouts.push(payout);

          // Update worker stats
          let worker = workers.get(payout.worker);
          if (!worker) {
            worker = new Worker({
              id: payout.worker,
              completedBounties: 0,
              totalEarnings: 0n,
              reputationScore: 0,
            });
            workers.set(payout.worker, worker);
          }
          worker.completedBounties += 1;
          worker.totalEarnings += payout.amount;
          worker.lastBountyAt = payout.timestamp;
          if (!worker.firstBountyAt) {
            worker.firstBountyAt = payout.timestamp;
          }
        }
      }
    }
  }

  // Calculate reputation scores
  for (const worker of workers.values()) {
    worker.reputationScore = calculateReputation(worker);
  }

  await ctx.store.save([...bounties.values()]);
  await ctx.store.save(payouts);
  await ctx.store.save([...workers.values()]);
  await ctx.store.save(proofs);
});

