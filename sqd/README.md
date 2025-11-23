GhostBounties

A ZK-verified automation agent for GitHub tasks with trustless payouts.

GhostBounties is a bounty automation platform that pays developers instantly for completing micro-tasks on GitHub—without needing to trust the platform or reveal private data.
Using ZK-TLS proofs (vlayer), decentralized compute (Fluence), XMTP messaging, Polygon settlement, and SQD indexing, GhostBounties creates a trust-minimized workflow for developers to earn crypto by doing verifiable actions online.

⸻

Problem

Micro-tasks like “Star this repo”, “Merge PR”, or “Fix issue #17” are easy to assign but nearly impossible to verify in a privacy-preserving way.
Today, marketplaces rely on centralized servers or admin checks — slow, fraudulent, and easy to game.

⸻

Solution

GhostBounties introduces a zero-knowledge proof layer that verifies a user truly performed an on-chain-payable action:

• Did they star the repo?
• Did they merge the PR?
• Did they comment on the issue?

With vlayer ZK-TLS, GhostBounties proves “This GitHub action happened over HTTPS” — without exposing cookies, tokens, or identity.
Fluence acts as the decentralized brain that validates proofs and triggers Polygon smart contract payouts.
All interaction happens through XMTP chat, so the user never touches a dashboard — everything feels like talking to an automated agent.

⸻

Tech Stack (The “Ghost Stack”)

Compute – Fluence (Rust/Marine)

Runs the autonomous agent logic:
“If proof is valid → release payment.”

Verification – vlayer (ZK-TLS)

Generates ZK proofs that a specific HTTPS event occurred (e.g., GitHub Star / PR Merged).

Interface – XMTP

Users talk to the agent:
“What bounties are available?”
“Here is my proof ID.”
“Send payout.”

Settlement – Polygon

Smart contract escrows funds and pays out once the Fluence node confirms proof validity.

Data – SQD

Indexes all payment events on Polygon to track:
• Payment history and amounts
• Tasks completed by each worker
• Proof verification records
• Worker success rates

Generates a Worker Reputation Score (0-100) based on:
• Task completion count (40%)
• Total earnings (30%)
• Success rate (20%)
• Consistency over time (10%)

The reputation system enables:
✓ Gating premium/high-value tasks to proven workers
✓ Reputation-based bonus multipliers
✓ Analytics and leaderboards
✓ Fraud detection and quality control

**GraphQL API**: Query worker reputation, payment history, and platform statistics in real-time.

📊 See `/sqd/` folder for the complete indexer implementation.

⸻

User Flow (Happy Path)

1. Discovery

User → XMTP agent:
“What jobs are available?”

2. Assignment

Agent:
“Star the repo ghost-op/core. Reward: 5 USDC.”

3. Action

User stars the GitHub repo.

4. Proof Generation

Agent sends a link → user clicks → vlayer client proves:
“User starred ghost-op/core via authenticated HTTPS.”

5. Submission

User sends proof ID back to the agent via XMTP.

6. Verification

Fluence agent checks the proof validity using vlayer.

7. Settlement

Polygon contract releases 5 USDC to user.

8. Notification

XMTP agent:
“Payment sent!”

⸻

Core Features

• ZK-verified GitHub interactions

Supports: star, fork, PR merged, comment posted, issue opened.

• Trustless payouts

No admin, no approval, no waiting.

• Privacy-preserving

ZK-TLS means users never reveal their GitHub tokens or cookies.

• Reputation engine

SQD indexes everything to calculate a Worker Reputation Score.

• Chat-native experience

No dashboard, no UI — everything from assignment to payment happens inside XMTP.



ghostbounties/
│
├── agent/                        # Fluence (Rust/Marine) autonomous agent
│   ├── Cargo.toml
│   ├── src/
│   │   ├── main.rs               # Agent logic: verify proof, call contract
│   │   ├── handlers.rs
│   │   └── vlayer.rs             # Proof validation module
│   └── README.md
│
├── contracts/                    # Polygon smart contracts
│   ├── GhostVault.sol            # Escrow contract
│   ├── GhostBounties.sol         # Task registry + payout logic
│   ├── interfaces/
│   └── scripts/
│
├── xmtp-agent/                   # XMTP chat agent
│   ├── package.json
│   ├── src/
│   │   ├── index.ts              # message listener
│   │   ├── commands.ts           # "jobs", "submit", "help"
│   │   ├── fluenceClient.ts      # calls to the Fluence agent
│   │   └── proverLink.ts         # generates vlayer prover URL
│
├── prover-client/                # vlayer ZK-TLS client
│   ├── index.html                # browser app to capture TLS session
│   ├── prover.js
│   ├── zk/
│   └── README.md
│
├── sqd-indexer/                  # SQD indexing logic
│   ├── schema.graphql
│   ├── src/
│   │   ├── mapping.ts
│   │   ├── reputation.ts
│   │   └── payoutEvents.ts
│
├── docs/
│   ├── architecture.md
│   ├── system-flow.png
│   └── bounty-format.md
│
├── README.md                     # main ETHGlobal README
└── LICENSE
