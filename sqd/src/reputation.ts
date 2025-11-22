import { Worker } from "./model";

/**
 * Calculate reputation score for a worker
 * Formula: (completed_bounties * 10) + (total_earnings / 1000) + (consistency_bonus)
 * 
 * Consistency bonus: +5 points if worker has completed bounties over multiple days
 */
export function calculateReputation(worker: Worker): number {
  let score = 0;

  // Base score from completed bounties (10 points per bounty)
  score += worker.completedBounties * 10;

  // Earnings bonus (1 point per 1000 tokens earned)
  const earningsBonus = Number(worker.totalEarnings) / 1000;
  score += earningsBonus;

  // Consistency bonus
  if (worker.firstBountyAt && worker.lastBountyAt) {
    const daysActive = Number(worker.lastBountyAt - worker.firstBountyAt) / (24 * 60 * 60);
    if (daysActive > 7) {
      score += 5; // Bonus for long-term participation
    }
  }

  // Cap at 1000
  return Math.min(score, 1000);
}

