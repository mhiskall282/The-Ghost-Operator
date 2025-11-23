# 👻 GhostBounties XMTP Agent

> An autonomous agent that hires humans to perform tasks, validates their work cryptographically, and pays them instantly.

## Overview

The GhostBounties XMTP Agent is the conversational interface for the GhostBounties platform. Users chat with the agent to discover bounties, submit zero-knowledge proofs of task completion, and receive instant payments—all without leaving their messaging app.

### The "Ghost" Stack

- **Compute (Brain)**: Fluence (Rust/Marine) - Validates proofs and triggers payments
- **Verification (Eyes)**: vlayer (ZK-TLS) - Generates zero-knowledge proofs of HTTPS requests
- **Interface (Mouth)**: XMTP - Chat-based user interaction
- **Settlement (Hands)**: Polygon - Smart contract payments
- **Data (Memory)**: SQD - Indexes payment history for reputation

## User Flow

1. **Discovery**: User asks "What jobs are available?"
2. **Assignment**: Agent replies with available bounties
3. **Action**: User completes the task (e.g., stars a repo on GitHub)
4. **Proof**: User generates a ZK proof via a provided link
5. **Submission**: User sends the Proof ID to the agent
6. **Verification**: Fluence validates the proof
7. **Payout**: Polygon contract sends payment
8. **Notification**: User receives confirmation via XMTP

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- A wallet with a private key (for the agent)
- XMTP account (auto-created from wallet)

### Installation

```bash
# Navigate to xmtp directory
cd xmtp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your values
# REQUIRED:
# - XMTP_WALLET_KEY (your private key)
# - XMTP_DB_ENCRYPTION_KEY (32+ character random string)
```

### Generate Keys

```bash
# Generate a new wallet (optional)
node -e "console.log(require('ethers').Wallet.createRandom().privateKey)"

# Generate encryption key (required)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Running the Agent

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## Usage

### Talking to Your Agent

Once your agent is running, you'll see:

```
✅ GhostBot Agent is online!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GhostBounties Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: 0x1234...5678
🌐 Environment: dev
🔗 Test URL: https://xmtp.chat/dm/0x1234...5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Test at xmtp.chat

1. Visit the test URL shown in your console
2. Or go to https://xmtp.chat
3. Paste your agent's address
4. Start chatting!

### Example Conversation

```
You: hi

Agent: 👻 Welcome to GhostBounties!
I'm an autonomous agent that pays you instantly for completing verified GitHub tasks.

Commands:
• jobs or bounties - See available bounties
• claim [bounty-id] - Claim a bounty
• submit [proof-id] - Submit your ZK proof
• status - Check your claimed bounties
• help - Show this message

Type jobs to get started! 🚀

---

You: jobs

Agent: 💰 Available Bounties:

1. Star the GhostBot Repository (ID: bounty-001)
   📝 Star the ghost-op/core repository on GitHub
   💵 Reward: 5 USDC
   🔗 https://github.com/ghost-op/core

2. Merge PR #42 (ID: bounty-002)
   📝 Review and merge pull request #42 in the main repository
   💵 Reward: 25 USDC
   🔗 https://github.com/ghost-op/core/pull/42

💡 To claim a bounty, type: claim bounty-001

---

You: claim bounty-001

Agent: ✅ Bounty Claimed!

📋 Task: Star the GhostBot Repository
💵 Reward: 5 USDC
🔗 GitHub: https://github.com/ghost-op/core

Next Steps:
1. Complete the task on GitHub
2. Generate your ZK proof: https://prover.vlayer.xyz/prove/star?repo=ghost-op/core
3. Copy the Proof ID you receive
4. Send me: submit [your-proof-id]

⏰ You have 24 hours to complete this task. Good luck! 🚀

---

You: submit 0xabc123def456...

Agent: 🔍 Proof Received!
⏳ Verifying your proof with Fluence...

⚙️ Step 1/3: Verifying proof with Fluence...
✅ Step 1/3: Proof verified!

⚙️ Step 2/3: Cross-verifying with vlayer...
✅ Step 2/3: Cross-verification passed!

⚙️ Step 3/3: Processing payment on Polygon...

🎉 PAYMENT SENT!

✅ Verification: Passed
✅ Amount: 5 USDC
✅ Transaction: 0x789...xyz

💰 Payment sent to: 0x1234...5678

🔍 View on Polygonscan:
https://amoy.polygonscan.com/tx/0x789...xyz

Thanks for completing the bounty! Type jobs to find more. 🚀
```

## Architecture

```
src/
├── index.ts              # Main agent entry point
├── types.ts              # TypeScript interfaces
├── bountyStore.ts        # In-memory bounty storage
├── messageHandler.ts     # Message routing and responses
└── integrations.ts       # Fluence, vlayer, Polygon services
```

### Core Components

#### 1. Agent (`index.ts`)
- Initializes XMTP connection
- Handles incoming messages
- Orchestrates verification and payment flow

#### 2. Message Handler (`messageHandler.ts`)
- Routes commands (jobs, claim, submit, status, help)
- Formats responses with bounty information
- Extracts proof IDs from user messages

#### 3. Bounty Store (`bountyStore.ts`)
- Manages available bounties (in-memory)
- Tracks claimed and completed bounties
- TODO: Integrate with SQD indexer

#### 4. Integrations (`integrations.ts`)
- **FluenceService**: Verifies proofs via decentralized compute
- **VlayerService**: Generates proof URLs and cross-verifies
- **PolygonService**: Triggers smart contract payments

## Integrations

### Current Status (Placeholders)

The agent currently uses **mock implementations** for the following:

#### ✅ XMTP (Live)
- Real messaging interface
- Persistent local database
- Production-ready

#### 🚧 Fluence (Placeholder)
```typescript
// TODO: Implement actual Marine service call
await fluenceService.verifyProof(proofId, bountyId);
```

#### 🚧 vlayer (Placeholder)
```typescript
// TODO: Implement verifier contract call
await vlayerService.verifyProofDirect(proofId);
```

#### 🚧 Polygon (Placeholder)
```typescript
// TODO: Implement smart contract interaction
await polygonService.releasePayment(userAddress, amount, bountyId);
```

#### 🚧 SQD (Not Yet Integrated)
```typescript
// TODO: Query indexer for payment history
await polygonService.getPaymentHistory(userAddress);
```

### Next Steps

1. **Fluence Integration**
   - Write Marine service for proof verification
   - Deploy to Fluence network
   - Update `FluenceService` to call real endpoint

2. **vlayer Integration**
   - Deploy vlayer verifier contract
   - Implement on-chain proof verification
   - Generate real proof URLs

3. **Polygon Contract**
   - Deploy bounty escrow contract
   - Implement releaseBounty() function
   - Connect with ethers.js

4. **SQD Indexer**
   - Set up SQD project
   - Index payment events
   - Build reputation score system

## Environment Variables

```bash
# XMTP Configuration (REQUIRED)
XMTP_WALLET_KEY=           # Private key of agent wallet
XMTP_DB_ENCRYPTION_KEY=    # 32+ char encryption key
XMTP_ENV=dev              # local, dev, or production

# Fluence Configuration
FLUENCE_PEER_URL=          # Fluence peer endpoint
FLUENCE_SERVICE_ID=        # Marine service ID

# Polygon Configuration
POLYGON_RPC_URL=           # RPC endpoint (Amoy testnet or mainnet)
BOUNTY_CONTRACT_ADDRESS=   # Deployed contract address

# vlayer Configuration
VLAYER_VERIFIER_URL=       # vlayer prover URL
```

## Database Files

XMTP creates local database files that **must persist** between restarts:

```
./xmtp_db/              # Default database directory
├── *.db3               # SQLite database files
└── *.db3-*            # Database journals
```

⚠️ **Important**: Without persistent storage, you're limited to 10 installations per inbox.

### Docker Volumes

```yaml
volumes:
  - ./xmtp_db:/app/xmtp_db
```

## Deployment

### Option 1: Local/VPS

```bash
# Build
npm run build

# Run with PM2
pm2 start dist/index.js --name ghost-bot

# Or with systemd
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
3. Add persistent disk (required!)
4. Deploy

## Troubleshooting

### Agent Won't Start

```bash
# Check environment variables
cat .env

# Verify Node version
node --version  # Should be 18+

# Clear database (if corrupted)
rm -rf xmtp_db/*.db*
```

### Messages Not Appearing

- Ensure you're using the correct XMTP environment (dev/prod)
- Check that both parties are on the same network
- Try clearing browser cache on xmtp.chat

### "Too Many Installations" Error

- Mount a persistent volume for `xmtp_db/`
- Don't delete database files between restarts

## Commands Reference

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `jobs` or `bounties` | List active bounties |
| `claim bounty-001` | Claim a specific bounty |
| `submit 0xabc...` | Submit proof ID |
| `status` | Check your claimed bounties |

## Contributing

This is a **hackathon/demo project** showcasing the integration of:
- XMTP for messaging
- vlayer for ZK proofs
- Fluence for compute
- Polygon for settlement
- SQD for indexing

To extend this agent:

1. Replace placeholder services with real implementations
2. Deploy smart contracts (see `/contracts` directory)
3. Set up Fluence Marine services (see `/fluence` directory)
4. Configure SQD indexer (see `/sqd` directory)

## Resources

- [XMTP Docs](https://docs.xmtp.org)
- [vlayer Docs](https://docs.vlayer.xyz)
- [Fluence Docs](https://fluence.dev)
- [SQD Docs](https://docs.sqd.dev)
- [Polygon Docs](https://docs.polygon.technology)

## License

MIT

---

Built with 👻 for the future of trustless work
