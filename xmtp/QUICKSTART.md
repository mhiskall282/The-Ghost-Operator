# 🎯 Quick Start Guide

## Setup (3 minutes)

### 1. Generate Keys

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Optional: Generate a new wallet
node -e "console.log(require('ethers').Wallet.createRandom().privateKey)"
```

### 2. Configure Environment

Edit `.env` file:

```bash
# Required
XMTP_WALLET_KEY=0xYOUR_PRIVATE_KEY_HERE
XMTP_DB_ENCRYPTION_KEY=YOUR_32_CHAR_HEX_STRING_HERE
XMTP_ENV=dev

# Optional (for later integration)
FLUENCE_PEER_URL=http://localhost:9991
FLUENCE_SERVICE_ID=ghost-bounty-verifier
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
BOUNTY_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
VLAYER_VERIFIER_URL=http://localhost:3000
```

### 3. Run

```bash
# Development mode (auto-reload)
npm run dev

# OR use the setup script
./start.sh

# Production mode
npm run build
npm start
```

## Test Your Agent

Once running, you'll see:

```
✅ GhostBot Agent is online!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GhostBounties Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: 0x1234...5678
🌐 Environment: dev
🔗 Test URL: https://xmtp.chat/dm/0x1234...5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 Waiting for messages...
```

**Visit the Test URL** or go to https://xmtp.chat and paste your agent's address!

## Example Chat

```
You: hi
Agent: 👻 Welcome to GhostBounties! ...

You: jobs
Agent: 💰 Available Bounties:
1. Star the GhostBot Repository - 5 USDC
2. Merge PR #42 - 25 USDC
...

You: claim bounty-001
Agent: ✅ Bounty Claimed! ...

You: submit 0xabc123...
Agent: 🔍 Verifying... 🎉 PAYMENT SENT!
```

## Troubleshooting

### "Cannot find module '@xmtp/agent-sdk'"
```bash
npm install
```

### "Missing environment variables"
Make sure `.env` has:
- `XMTP_WALLET_KEY`
- `XMTP_DB_ENCRYPTION_KEY`

### TypeScript Errors
```bash
npm run build
```

## Next Steps

1. **Test the agent** at https://xmtp.chat
2. **Implement Fluence** verification (see `src/integrations.ts`)
3. **Deploy vlayer** prover and verifier
4. **Deploy Polygon** bounty contract
5. **Set up SQD** indexer for payment history

## Project Structure

```
src/
├── index.ts           - Main agent
├── types.ts           - TypeScript types
├── bountyStore.ts     - Bounty management
├── messageHandler.ts  - Command routing
└── integrations.ts    - Fluence/vlayer/Polygon
```

## Commands Reference

| Command | Action |
|---------|--------|
| `help` | Show help message |
| `jobs` | List bounties |
| `claim bounty-XXX` | Claim a bounty |
| `submit 0x...` | Submit proof |
| `status` | Check your status |

---

Built with 👻 for GhostBounties
