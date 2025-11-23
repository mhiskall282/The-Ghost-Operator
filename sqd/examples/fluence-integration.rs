/**
 * Example Fluence integration for worker reputation verification
 * 
 * This shows how a Fluence service could query the SQD indexer
 * to verify worker eligibility before releasing payment.
 */

use marine_rs_sdk::marine;
use serde::{Deserialize, Serialize};

#[marine]
#[derive(Debug, Serialize, Deserialize)]
pub struct WorkerReputation {
    pub id: String,
    pub reputation_score: f64,
    pub total_earned: String,
    pub total_tasks_completed: i32,
    pub success_rate: f64,
}

#[marine]
#[derive(Debug, Serialize, Deserialize)]
pub struct EligibilityCheck {
    pub eligible: bool,
    pub reason: Option<String>,
}

const SQD_GRAPHQL_ENDPOINT: &str = "http://localhost:4350/graphql";

/// Check if a worker meets the eligibility criteria for a bounty
#[marine]
pub fn check_worker_eligibility(
    worker_address: String,
    min_reputation: f64,
    min_tasks: i32,
) -> EligibilityCheck {
    // Query the SQD GraphQL API
    let worker = match fetch_worker_reputation(worker_address.clone()) {
        Some(w) => w,
        None => {
            return EligibilityCheck {
                eligible: false,
                reason: Some("Worker not found in reputation system".to_string()),
            }
        }
    };

    // Check reputation score
    if worker.reputation_score < min_reputation {
        return EligibilityCheck {
            eligible: false,
            reason: Some(format!(
                "Reputation too low: {:.1}/100 (need {:.1}+)",
                worker.reputation_score, min_reputation
            )),
        };
    }

    // Check task count
    if worker.total_tasks_completed < min_tasks {
        return EligibilityCheck {
            eligible: false,
            reason: Some(format!(
                "Not enough tasks completed: {} (need {}+)",
                worker.total_tasks_completed, min_tasks
            )),
        };
    }

    // Check success rate
    if worker.success_rate < 90.0 {
        return EligibilityCheck {
            eligible: false,
            reason: Some(format!(
                "Success rate too low: {:.1}% (need 90%+)",
                worker.success_rate
            )),
        };
    }

    EligibilityCheck {
        eligible: true,
        reason: None,
    }
}

/// Verify proof and check worker eligibility before payment
#[marine]
pub fn verify_and_check_payment(
    worker_address: String,
    proof_id: String,
    bounty_amount: u64,
) -> bool {
    // Step 1: Verify ZK proof (would integrate with vlayer here)
    let proof_valid = verify_zk_proof(proof_id);
    if !proof_valid {
        return false;
    }

    // Step 2: Check worker reputation
    let min_reputation = if bounty_amount > 10_000_000 {
        // High value bounties (>10 USDC) require better reputation
        70.0
    } else {
        50.0
    };

    let eligibility = check_worker_eligibility(worker_address, min_reputation, 5);

    eligibility.eligible
}

/// Fetch worker reputation from SQD GraphQL API
fn fetch_worker_reputation(worker_address: String) -> Option<WorkerReputation> {
    // This would use an HTTP service in Fluence to query the GraphQL API
    // For now, this is a placeholder showing the structure
    
    let query = format!(r#"
        query {{
            worker(id: "{}") {{
                id
                reputationScore
                totalEarned
                totalTasksCompleted
                successRate
            }}
        }}
    "#, worker_address.to_lowercase());

    // In real implementation, use Fluence's curl service
    // let response = curl.post(SQD_GRAPHQL_ENDPOINT, query);
    
    // Parse and return worker data
    None // Placeholder
}

/// Verify ZK proof (integrates with vlayer)
fn verify_zk_proof(proof_id: String) -> bool {
    // This would call the vlayer verifier contract
    // Placeholder for now
    true
}

/// Calculate bonus based on worker reputation
#[marine]
pub fn calculate_bonus(
    worker_address: String,
    base_amount: u64,
) -> u64 {
    let worker = match fetch_worker_reputation(worker_address) {
        Some(w) => w,
        None => return base_amount, // No bonus for new workers
    };

    // Give bonus based on reputation tier
    let bonus_multiplier = if worker.reputation_score >= 90.0 {
        1.2 // 20% bonus for top performers
    } else if worker.reputation_score >= 75.0 {
        1.1 // 10% bonus for good performers
    } else {
        1.0 // No bonus
    };

    (base_amount as f64 * bonus_multiplier) as u64
}

#[marine]
pub fn get_recommended_tasks_for_worker(
    worker_address: String,
) -> Vec<String> {
    let worker = match fetch_worker_reputation(worker_address) {
        Some(w) => w,
        None => {
            // New worker - recommend easy tasks
            return vec![
                "STAR_REPO".to_string(),
                "COMMENT".to_string(),
            ];
        }
    };

    // Recommend tasks based on reputation
    if worker.reputation_score >= 80.0 && worker.total_tasks_completed >= 20 {
        vec![
            "MERGE_PR".to_string(),
            "CUSTOM".to_string(),
            "OPEN_ISSUE".to_string(),
        ]
    } else if worker.reputation_score >= 60.0 {
        vec![
            "STAR_REPO".to_string(),
            "COMMENT".to_string(),
            "OPEN_ISSUE".to_string(),
        ]
    } else {
        vec![
            "STAR_REPO".to_string(),
            "COMMENT".to_string(),
        ]
    }
}

/*
Example usage in Fluence service:

1. Worker submits proof via XMTP
2. XMTP bot forwards to Fluence
3. Fluence calls: verify_and_check_payment(worker_addr, proof_id, amount)
4. If true, trigger smart contract payment
5. SQD indexer picks up payment event
6. Reputation updated automatically

Full flow:
┌─────────┐    ┌──────┐    ┌─────────┐    ┌─────────┐    ┌─────┐
│ Worker  │───▶│ XMTP │───▶│ Fluence │───▶│ Polygon │───▶│ SQD │
└─────────┘    └──────┘    └─────────┘    └─────────┘    └─────┘
                               │                             │
                               │ Check reputation            │
                               └─────────────────────────────┘
*/
