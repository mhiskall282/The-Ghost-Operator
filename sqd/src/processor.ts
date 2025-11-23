import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { GHOST_BOUNTY_CONTRACT } from "./constants";

export const processor = new EvmBatchProcessor()
  // Connect to SQD Network gateway for Polygon
  .setGateway("https://v2.archive.subsquid.io/network/polygon-mainnet")

  // Optional: Add RPC endpoint for real-time data
  // Uncomment and set RPC_ENDPOINT in .env for real-time indexing
  // .setRpcEndpoint(process.env.RPC_ENDPOINT)
  // .setFinalityConfirmation(75) // Wait for 75 blocks for finality

  // Set the block range (start from contract deployment block)
  // TODO: Update this with the actual deployment block number
  .setBlockRange({
    from: 40_000_000, // Replace with actual contract deployment block
  })

  // Index PaymentProcessed events from the bounty contract
  .addLog({
    address: [GHOST_BOUNTY_CONTRACT],
    topic0: ["0x..."], // TODO: Add the actual PaymentProcessed event topic
    transaction: true,
  })

  // Index BountyCreated events
  .addLog({
    address: [GHOST_BOUNTY_CONTRACT],
    topic0: ["0x..."], // TODO: Add the actual BountyCreated event topic
    transaction: true,
  })

  // Index BountyClaimed events
  .addLog({
    address: [GHOST_BOUNTY_CONTRACT],
    topic0: ["0x..."], // TODO: Add the actual BountyClaimed event topic
    transaction: true,
  })

  // Specify which fields to fetch
  .setFields({
    log: {
      topics: true,
      data: true,
      transactionHash: true,
    },
    transaction: {
      hash: true,
      gasUsed: true,
      from: true,
      to: true,
    },
    block: {
      timestamp: true,
    },
  });

export const db = new TypeormDatabase();
