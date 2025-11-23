/**
 * Integration example: Using SQD GraphQL API with Ghost Bot XMTP
 *
 * This file shows how to query worker reputation and payment history
 * from the SQD indexer within the XMTP bot.
 *
 * NOTE: This is an example file for reference. Copy it to your XMTP project
 * and update the endpoint URL as needed.
 */

// Configure your SQD GraphQL endpoint here
const SQD_GRAPHQL_ENDPOINT = "http://localhost:4350/graphql";

interface WorkerReputation {
  id: string;
  reputationScore: number;
  totalEarned: string;
  totalTasksCompleted: number;
  successRate: number;
  lastPaymentAt?: string;
}

interface Payment {
  id: string;
  amount: string;
  token: string;
  taskType: string;
  timestamp: string;
  transactionHash: string;
}

/**
 * Fetch worker reputation from SQD indexer
 */
export async function getWorkerReputation(
  walletAddress: string
): Promise<WorkerReputation | null> {
  const query = `
    query GetWorkerReputation($address: String!) {
      worker(id: $address) {
        id
        reputationScore
        totalEarned
        totalTasksCompleted
        successRate
        lastPaymentAt
      }
    }
  `;

  try {
    const response = await fetch(SQD_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { address: walletAddress.toLowerCase() },
      }),
    });

    const result = await response.json();
    return result.data?.worker || null;
  } catch (error) {
    console.error("Error fetching worker reputation:", error);
    return null;
  }
}

/**
 * Check if worker meets minimum requirements for a task
 */
export async function isWorkerEligible(
  walletAddress: string,
  minReputation: number = 50,
  minTasksCompleted: number = 5
): Promise<boolean> {
  const worker = await getWorkerReputation(walletAddress);

  if (!worker) {
    return false; // New worker, no reputation yet
  }

  return (
    worker.reputationScore >= minReputation &&
    worker.totalTasksCompleted >= minTasksCompleted
  );
}

/**
 * Get worker's recent payment history
 */
export async function getWorkerPaymentHistory(
  walletAddress: string,
  limit: number = 10
): Promise<Payment[]> {
  const query = `
    query GetWorkerPayments($address: String!, $limit: Int!) {
      payments(
        where: { worker: { id_eq: $address } }
        orderBy: timestamp_DESC
        limit: $limit
      ) {
        id
        amount
        token
        taskType
        timestamp
        transactionHash
      }
    }
  `;

  try {
    const response = await fetch(SQD_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          address: walletAddress.toLowerCase(),
          limit,
        },
      }),
    });

    const result = await response.json();
    return result.data?.payments || [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
}

/**
 * Get top workers by reputation
 */
export async function getTopWorkers(
  limit: number = 10
): Promise<WorkerReputation[]> {
  const query = `
    query GetTopWorkers($limit: Int!) {
      workers(orderBy: reputationScore_DESC, limit: $limit) {
        id
        reputationScore
        totalEarned
        totalTasksCompleted
        successRate
        lastPaymentAt
      }
    }
  `;

  try {
    const response = await fetch(SQD_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { limit },
      }),
    });

    const result = await response.json();
    return result.data?.workers || [];
  } catch (error) {
    console.error("Error fetching top workers:", error);
    return [];
  }
}

/**
 * Format reputation for display in XMTP chat
 */
export function formatReputationMessage(worker: WorkerReputation): string {
  const earned = (BigInt(worker.totalEarned) / BigInt(10 ** 6)).toString(); // Assuming 6 decimals (USDC)

  return `
🏆 Worker Reputation
━━━━━━━━━━━━━━━━━━━━
Address: ${worker.id.slice(0, 6)}...${worker.id.slice(-4)}
Reputation Score: ${worker.reputationScore.toFixed(1)}/100
Total Earned: ${earned} USDC
Tasks Completed: ${worker.totalTasksCompleted}
Success Rate: ${worker.successRate.toFixed(1)}%
${
  worker.lastPaymentAt
    ? `Last Payment: ${new Date(worker.lastPaymentAt).toLocaleDateString()}`
    : ""
}
  `.trim();
}

/**
 * Example: XMTP message handler integration
 */
export async function handleReputationCommand(
  walletAddress: string,
  commandArgs: string[]
): Promise<string> {
  const command = commandArgs[0]?.toLowerCase();

  switch (command) {
    case "check":
    case "reputation": {
      const worker = await getWorkerReputation(walletAddress);
      if (!worker) {
        return "You don't have a reputation yet. Complete your first task to get started! 🎯";
      }
      return formatReputationMessage(worker);
    }

    case "history": {
      const payments = await getWorkerPaymentHistory(walletAddress, 5);
      if (payments.length === 0) {
        return "No payment history found. Complete a task to earn your first payment! 💰";
      }

      let message = "📜 Recent Payments\n━━━━━━━━━━━━━━━━━━━━\n\n";
      payments.forEach((payment, i) => {
        const amount = (BigInt(payment.amount) / BigInt(10 ** 6)).toString();
        const date = new Date(payment.timestamp).toLocaleDateString();
        message += `${i + 1}. ${amount} USDC - ${payment.taskType}\n`;
        message += `   ${date} | ${payment.transactionHash.slice(
          0,
          10
        )}...\n\n`;
      });
      return message;
    }

    case "leaderboard": {
      const topWorkers = await getTopWorkers(10);
      if (topWorkers.length === 0) {
        return "No workers found yet. Be the first! 🚀";
      }

      let message = "🏆 Top Workers\n━━━━━━━━━━━━━━━━━━━━\n\n";
      topWorkers.forEach((worker, i) => {
        const earned = (
          BigInt(worker.totalEarned) / BigInt(10 ** 6)
        ).toString();
        const address = `${worker.id.slice(0, 6)}...${worker.id.slice(-4)}`;
        message += `${i + 1}. ${address}\n`;
        message += `   Score: ${worker.reputationScore.toFixed(
          1
        )} | Earned: ${earned} USDC\n\n`;
      });
      return message;
    }

    default:
      return `Unknown command. Available commands:
      
/reputation check - View your reputation
/reputation history - View payment history  
/reputation leaderboard - View top workers`;
  }
}

/**
 * Check if worker can claim premium bounties
 */
export async function canClaimPremiumBounty(walletAddress: string): Promise<{
  eligible: boolean;
  reason?: string;
}> {
  const worker = await getWorkerReputation(walletAddress);

  if (!worker) {
    return {
      eligible: false,
      reason: "New workers must complete 5 basic tasks first",
    };
  }

  if (worker.reputationScore < 70) {
    return {
      eligible: false,
      reason: `Reputation too low (${worker.reputationScore.toFixed(
        1
      )}/100). Need 70+`,
    };
  }

  if (worker.totalTasksCompleted < 10) {
    return {
      eligible: false,
      reason: `Not enough tasks completed (${worker.totalTasksCompleted}/10)`,
    };
  }

  if (worker.successRate < 90) {
    return {
      eligible: false,
      reason: `Success rate too low (${worker.successRate.toFixed(
        1
      )}%). Need 90%+`,
    };
  }

  return { eligible: true };
}

/**
 * Example usage in XMTP bot
 */
/*
import { handleReputationCommand, canClaimPremiumBounty } from './sqd-integration'

// In your message handler:
if (message.startsWith('/reputation')) {
  const args = message.split(' ').slice(1)
  const response = await handleReputationCommand(senderAddress, args)
  await conversation.send(response)
}

// Before assigning a premium bounty:
const eligibility = await canClaimPremiumBounty(workerAddress)
if (!eligibility.eligible) {
  await conversation.send(`❌ Not eligible: ${eligibility.reason}`)
  return
}

await conversation.send('✅ You are eligible for this premium bounty!')
*/
