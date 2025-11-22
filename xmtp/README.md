# 👻 GhostBounties XMTP Agent

> An autonomous agent that hires humans, validates work cryptographically, and pays instantly via XMTP messaging.

## What is This?

This is the **conversational interface** for GhostBounties - a trustless bounty platform where:

1. 🤖 **Users chat with an AI agent** via XMTP
2. 📋 **Browse and claim bounties** (GitHub tasks like stars, PRs, issues)
3. 🔐 **Generate ZK proofs** of task completion (via vlayer)
4. ⚡ **Get paid instantly** on Polygon after verification (via Fluence)
5. 📊 **Build reputation** tracked by SQD indexer

## The "Ghost" Stack

| Component | Role | Status |
|-----------|------|--------|
| **XMTP** | Messaging interface | ✅ **Live** |
| **vlayer** | ZK-TLS proof generation | 🚧 Placeholder |
| **Fluence** | Decentralized verification | 🚧 Placeholder |
| **Polygon** | Payment settlement | 🚧 Placeholder |
| **SQD** | Payment history indexing | 🚧 Planned |

## Quick Start

### Prerequisites

- Node.js 18+
- A wallet private key
- 3 minutes ⏱️

### Installation

```bash
cd xmtp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuration

Edit `.env`:

```bash
# REQUIRED
XMTP_WALLET_KEY=0xYOUR_PRIVATE_KEY_HERE
XMTP_DB_ENCRYPTION_KEY=<paste the key generated above>
XMTP_ENV=dev

# Optional (for production integration)
FLUENCE_PEER_URL=http://localhost:9991
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
BOUNTY_CONTRACT_ADDRESS=0x...
VLAYER_VERIFIER_URL=http://localhost:3000
```

### Run

```bash
# Development (auto-reload)
npm run dev

# OR use helper script
./start.sh

# Production
npm run build && npm start
```

## Test Your Agent

Once running, visit the test URL shown in console:

```
🔗 Test URL: https://xmtp.chat/dm/0x1234...5678
```

Or visit https://xmtp.chat and paste your agent's address.

## Example Conversation

```
👤 User: hi

🤖 Agent: 👻 Welcome to GhostBounties!
         
         Commands:
         • jobs - See available bounties
         • claim [bounty-id] - Claim a bounty
         • submit [proof-id] - Submit your proof
         • status - Check your claimed bounties

─────────────────────────────────────

👤 User: jobs

🤖 Agent: 💰 Available Bounties:

         1. Star the GhostBot Repository (ID: bounty-001)
            📝 Star the ghost-op/core repository
            💵 Reward: 5 USDC
            🔗 https://github.com/ghost-op/core

         2. Merge PR #42 (ID: bounty-002)
            📝 Review and merge PR #42
            💵 Reward: 25 USDC
            🔗 https://github.com/ghost-op/core/pull/42

─────────────────────────────────────

👤 User: claim bounty-001

🤖 Agent: ✅ Bounty Claimed!

         📋 Task: Star the GhostBot Repository
         💵 Reward: 5 USDC
         
         Next Steps:
         1. Complete the task on GitHub
         2. Generate proof: https://prover.vlayer.xyz/...
         3. Copy the Proof ID
         4. Send: submit [proof-id]

─────────────────────────────────────

👤 User: submit 0xabc123def456...

🤖 Agent: 🔍 Proof Received!
         ⏳ Verifying with Fluence...
         
         ⚙️ Step 1/3: Verifying proof...
         ✅ Step 1/3: Proof verified!
         
         ⚙️ Step 2/3: Cross-verifying with vlayer...
         ✅ Step 2/3: Cross-verification passed!
         
         ⚙️ Step 3/3: Processing payment...
         
         🎉 PAYMENT SENT!
         
         ✅ Amount: 5 USDC
         ✅ TX: 0x789...xyz
         🔍 https://amoy.polygonscan.com/tx/0x789...
```

## Architecture

```
src/
├── index.ts           # Main agent (XMTP setup, event handlers)
├── types.ts           # TypeScript interfaces
├── bountyStore.ts     # In-memory bounty management
├── messageHandler.ts  # Command routing & response formatting
└── integrations.ts    # Fluence, vlayer, Polygon services
```

### Key Files

**`index.ts`** - GhostBotAgent class
- Initializes XMTP connection
- Sets up event handlers
- Orchestrates verification flow

**`messageHandler.ts`** - MessageHandler class  
- Routes commands (jobs, claim, submit, status, help)
- Formats rich text responses
- Extracts proof IDs from messages

**`bountyStore.ts`** - BountyStore class
- Manages available bounties (in-memory)
- Tracks claimed/completed status
- TODO: Integrate with SQD indexer

**`integrations.ts`** - Service classes
- `FluenceService` - Proof verification (placeholder)
- `VlayerService` - ZK proof generation (placeholder)
- `PolygonService` - Payment settlement (placeholder)

## Integration Status

### ✅ XMTP (Production Ready)

The agent uses the official `@xmtp/agent-sdk` with:
- Event-driven message handling
- Persistent local database
- Full typing support
- Error handling

### 🚧 Fluence (Placeholder)

```typescript
// Current: Mock verification
const result = await fluenceService.verifyProof(proofId, bountyId);

// TODO: Implement Marine service call
// - Deploy Fluence Marine service
// - Call service with proof data
// - Return verification result
```

See `/fluence` directory (planned).

### 🚧 vlayer (Placeholder)

```typescript
// Current: Mock proof verification
const valid = await vlayerService.verifyProofDirect(proofId);

// TODO: Implement verifier contract
// - Deploy vlayer verifier contract
// - Verify proof on-chain
// - Return boolean result
```

See `/vlayer` directory for prover examples.

### 🚧 Polygon (Placeholder)

```typescript
// Current: Mock payment
const result = await polygonService.releasePayment(address, amount, bountyId);

// TODO: Implement smart contract
// - Deploy bounty escrow contract
// - Call releaseBounty() function
// - Return transaction hash
```

See `/contracts` directory (planned).

### 🚧 SQD (Not Yet Integrated)

```typescript
// TODO: Query payment history
const history = await polygonService.getPaymentHistory(userAddress);

// - Set up SQD indexer
// - Index payment events
// - Calculate reputation scores
```

See `/sqd` directory (planned).

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show help message | `help` |
| `jobs` or `bounties` | List active bounties | `jobs` |
| `claim [id]` | Claim a bounty | `claim bounty-001` |
| `submit [proof]` | Submit ZK proof | `submit 0xabc...` |
| `status` | Check your status | `status` |

## Environment Variables

### Required

```bash
XMTP_WALLET_KEY=           # Private key (0x...)
XMTP_DB_ENCRYPTION_KEY=    # 32+ char hex string
XMTP_ENV=                  # dev, production, or local
```

### Optional (For Integrations)

```bash
FLUENCE_PEER_URL=          # Fluence peer endpoint
FLUENCE_SERVICE_ID=        # Marine service ID
POLYGON_RPC_URL=           # Polygon RPC
BOUNTY_CONTRACT_ADDRESS=   # Deployed contract
VLAYER_VERIFIER_URL=       # vlayer prover URL
```

## Database Persistence

⚠️ **Important**: XMTP creates local database files that must persist between restarts.

```
./xmtp_db/              # Default database directory
├── *.db3               # SQLite databases
└── *.db3-*            # Database journals
```

**Without persistence**: Limited to 10 installations per inbox.

### Docker Volumes

```yaml
volumes:
  - ./xmtp_db:/app/xmtp_db
```

## Deployment

### Option 1: VPS/Cloud

```bash
# Build
npm run build

# Run with PM2
pm2 start dist/index.js --name ghost-bot

# With systemd
sudo systemctl enable ghost-bot
sudo systemctl start ghost-bot
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
VOLUME ["/app/xmtp_db"]
CMD ["node", "dist/index.js"]
```

```bash
docker build -t ghost-bot .
docker run -d \
  --name ghost-bot \
  -v $(pwd)/xmtp_db:/app/xmtp_db \
  --env-file .env \
  ghost-bot
```

### Option 3: Railway/Render

1. Connect GitHub repo
2. Set environment variables
3. **Add persistent disk** (required!)
4. Deploy

## Troubleshooting

### TypeScript Errors

```bash
# Check for errors
npm run build

# Ensure all packages installed
npm install

# Verify tsconfig.json has:
# - "lib": ["ES2022", "DOM"]
# - "types": ["node"]
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Agent Won't Start

```bash
# Verify .env file exists
cat .env

# Check Node version (18+)
node --version

# Clear corrupted database
rm -rf xmtp_db/*.db*
```

### Messages Not Received

- Ensure both parties use same XMTP environment (dev/prod)
- Check wallet has correct private key format (0x...)
- Try clearing xmtp.chat cache

## Development

### Adding New Commands

Edit `src/messageHandler.ts`:

```typescript
// Add to handleMessage()
if (normalizedMsg.includes('mynewcommand')) {
  return this.handleMyNewCommand(normalizedMsg, userAddress);
}

// Implement handler
private handleMyNewCommand(message: string, userAddress: string): string {
  return '✅ Command executed!';
}
```

### Adding New Bounties

Edit `src/bountyStore.ts`:

```typescript
const newBounty: Bounty = {
  id: 'bounty-004',
  title: 'Follow on Twitter',
  description: 'Follow @ghostbounties',
  reward: '2 USDC',
  rewardAmount: 2,
  taskType: 'follow',
  githubUrl: 'https://twitter.com/ghostbounties',
  status: 'active',
};

this.bounties.set(newBounty.id, newBounty);
```

### Testing Locally

```bash
# Terminal 1: Run agent
npm run dev

# Terminal 2: Test at xmtp.chat
# Or use XMTP React SDK for custom UI
```

## Resources

- [XMTP Documentation](https://docs.xmtp.org)
- [XMTP Agent SDK](https://github.com/xmtp/xmtp-js/tree/main/packages/agent-sdk)
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Fluence Documentation](https://fluence.dev)
- [SQD Documentation](https://docs.sqd.dev)

## Next Steps

1. ✅ **Test the agent** at https://xmtp.chat
2. 🚧 **Implement Fluence** verification service
3. 🚧 **Deploy vlayer** prover and verifier contracts
4. 🚧 **Deploy Polygon** bounty escrow contract
5. 🚧 **Set up SQD** indexer for payment history
6. 🚧 **Add authentication** for bounty creation
7. 🚧 **Build admin dashboard** for bounty management

## License

MIT

---

**Built with 👻 for the future of trustless work**

*Part of the GhostBounties project - autonomous task verification and instant payments*

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

Indexes:
• payouts
• tasks completed
• proof histories
…and generates a Worker Reputation Score.

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
