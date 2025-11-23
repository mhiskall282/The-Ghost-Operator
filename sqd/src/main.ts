import { TypeormDatabase } from "@subsquid/typeorm-store";
import { processor, db } from "./processor";
import {
  Payment,
  Worker,
  BountyContract,
  DailyStats,
  PaymentStatus,
  TaskType,
} from "./model";

processor.run(db, async (ctx: any) => {
  // Maps to store entities before saving
  const workers = new Map<string, Worker>();
  const payments: Payment[] = [];
  const dailyStats = new Map<string, DailyStats>();

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      // Handle PaymentProcessed events
      if (isPaymentProcessedEvent(log)) {
        await handlePaymentProcessed(log, block, workers, payments, dailyStats);
      }

      // Handle BountyCreated events
      if (isBountyCreatedEvent(log)) {
        await handleBountyCreated(log, block, ctx);
      }

      // Handle BountyClaimed events
      if (isBountyClaimedEvent(log)) {
        await handleBountyClaimed(log, block, ctx);
      }
    }
  }

  // Calculate reputation scores before saving
  for (let [address, worker] of workers) {
    worker.reputationScore = calculateReputationScore(worker);
  }

  // Save all entities to the database
  await ctx.store.save([...workers.values()]);
  await ctx.store.save(payments);
  await ctx.store.save([...dailyStats.values()]);
});

function isPaymentProcessedEvent(log: any): boolean {
  // TODO: Check if log matches PaymentProcessed event signature
  return log.topics[0] === "0x..."; // Replace with actual topic hash
}

function isBountyCreatedEvent(log: any): boolean {
  // TODO: Check if log matches BountyCreated event signature
  return log.topics[0] === "0x..."; // Replace with actual topic hash
}

function isBountyClaimedEvent(log: any): boolean {
  // TODO: Check if log matches BountyClaimed event signature
  return log.topics[0] === "0x..."; // Replace with actual topic hash
}

async function handlePaymentProcessed(
  log: any,
  block: any,
  workers: Map<string, Worker>,
  payments: Payment[],
  dailyStats: Map<string, DailyStats>
) {
  // Decode event data
  // TODO: Use proper ABI decoding
  const workerAddress = log.topics[1]; // indexed parameter
  const tokenAddress = log.topics[2]; // indexed parameter

  // Get or create worker
  let worker = workers.get(workerAddress);
  if (!worker) {
    worker = new Worker({
      id: workerAddress,
      totalEarned: 0n,
      totalTasksCompleted: 0,
      successRate: 100.0,
      averagePaymentTime: 0,
      reputationScore: 0,
    });
    workers.set(workerAddress, worker);
  }

  // Create payment record
  const payment = new Payment({
    id: log.transactionHash,
    worker: worker,
    amount: 0n, // TODO: Decode from log.data
    token: tokenAddress,
    status: PaymentStatus.COMPLETED,
    taskType: TaskType.CUSTOM, // TODO: Decode from log.data
    taskDescription: "", // TODO: Decode from log.data
    proofId: "", // TODO: Decode from log.data
    blockNumber: block.header.height,
    timestamp: new Date(block.header.timestamp),
    transactionHash: log.transactionHash,
    gasUsed: 0n, // TODO: Get from transaction
  });

  payments.push(payment);

  // Update worker stats
  worker.totalEarned += payment.amount;
  worker.totalTasksCompleted += 1;
  worker.lastPaymentAt = payment.timestamp;
  if (!worker.firstPaymentAt) {
    worker.firstPaymentAt = payment.timestamp;
  }

  // Update daily stats
  const dateKey = payment.timestamp.toISOString().split("T")[0];
  let stats = dailyStats.get(dateKey);
  if (!stats) {
    stats = new DailyStats({
      id: dateKey,
      date: new Date(dateKey),
      totalPayments: 0n,
      paymentCount: 0,
      uniqueWorkers: 0,
      averagePayment: 0n,
    });
    dailyStats.set(dateKey, stats);
  }

  stats.totalPayments += payment.amount;
  stats.paymentCount += 1;
}

async function handleBountyCreated(log: any, block: any, ctx: any) {
  // TODO: Implement bounty creation tracking
  ctx.log.info(`Bounty created at block ${block.header.height}`);
}

async function handleBountyClaimed(log: any, block: any, ctx: any) {
  // TODO: Implement bounty claim tracking
  ctx.log.info(`Bounty claimed at block ${block.header.height}`);
}

function calculateReputationScore(worker: Worker): number {
  // Reputation score calculation based on:
  // 1. Total tasks completed (40%)
  // 2. Total earned (30%)
  // 3. Success rate (20%)
  // 4. Consistency (10% - based on time between payments)

  const tasksScore = Math.min(worker.totalTasksCompleted / 100, 1) * 40;
  const earningsScore =
    Math.min(Number(worker.totalEarned) / 1000000000, 1) * 30; // Normalize to USDC scale
  const successScore = worker.successRate * 0.2;

  // Consistency: More consistent workers get higher scores
  let consistencyScore = 0;
  if (
    worker.firstPaymentAt &&
    worker.lastPaymentAt &&
    worker.totalTasksCompleted > 1
  ) {
    const daysBetween =
      (worker.lastPaymentAt.getTime() - worker.firstPaymentAt.getTime()) /
      (1000 * 60 * 60 * 24);
    const averageTasksPerDay =
      worker.totalTasksCompleted / Math.max(daysBetween, 1);
    consistencyScore = Math.min(averageTasksPerDay / 2, 1) * 10;
  }

  return (
    Math.round(
      (tasksScore + earningsScore + successScore + consistencyScore) * 10
    ) / 10
  );
}
