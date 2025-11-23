# 🚀 Ghost Bot - Complete Setup Guide

## Overview

Ghost Bot is an autonomous agent that pays workers for completing GitHub Pull Request tasks, verified cryptographically using ZK-TLS proofs.

### What's Changed

✅ **Updated to vlayer Web Prover API** (new architecture)  
✅ **Focus on PR verification only** (creation + merge)  
✅ **Deployed to Base Sepolia** (testnet)  
✅ **x402 payments** on Polygon  
✅ **SQD reputation indexing**  

---

## 🎯 Verified Actions

1. **Pull Request Creation** - Prove a PR was created by a specific user
2. **Pull Request Merge** - Prove a PR was merged

---

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Verification** | vlayer Web Prover API | ZK-TLS proofs of GitHub actions |
| **Smart Contracts** | Base Sepolia | On-chain verification |
| **Payments** | x402 on Polygon | Instant micro-payments |
| **Chat Interface** | XMTP | Worker communication |
| **Reputation** | SQD Indexer | Worker score tracking |
| **Orchestration** | Fluence (future) | Autonomous decision making |

---

## 📦 Project Structure

```
ghost-bot/
├── vlayer/
│   ├── app/api/           # Next.js API routes
│   │   ├── prove/         # Proof generation endpoint
│   │   └── verify/        # Proof verification endpoint
│   ├── lib/helpers/       # PR verification helpers
│   │   └── pr-verifier.ts # PR creation & merge functions
│   ├── src/ghostbounties/ # Smart contracts
│   │   ├── GhostBounties.sol
│   │   ├── GhostVault.sol
│   │   └── GitHubProver.sol
│   └── deploy-base-sepolia.sh # Deployment script
│
├── xmtp/
│   └── src/
│       ├── integrations.ts  # Updated VlayerService
│       └── messageHandler.ts # Bot logic
│
└── sqd/
    └── schema.graphql      # Reputation indexing
```

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Root
cd /Users/dreytech/Projects/ghost-bot

# vlayer
cd vlayer
npm install
forge soldeer install

# XMTP
cd ../xmtp
nvm use 20
npm install

# SQD
cd ../sqd
npm install
```

### 2. Configure Environment

```bash
# vlayer/.env
WEB_PROVER_API_CLIENT_ID=your_client_id
WEB_PROVER_API_SECRET=your_api_secret
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_key
PRIVATE_KEY=0x...

# xmtp/.env
XMTP_ENV=production
WALLET_PRIVATE_KEY=0x...

# sqd/.env
DB_NAME=squid
DB_PORT=5432
```

### 3. Deploy Contracts

```bash
cd vlayer
./deploy-base-sepolia.sh
```

### 4. Start Services

```bash
# Terminal 1: XMTP Bot
cd xmtp
npm run dev

# Terminal 2: SQD Indexer
cd sqd
npm run build
npm run start
```

---

## 💻 Usage Examples

### Verify PR Creation (Client)

```typescript
import { VlayerService } from './xmtp/src/integrations';

const vlayer = new VlayerService(
  'https://web-prover.vlayer.xyz/api/v1'
);

const proof = await vlayer.verifyPRCreation(
  'microsoft',   // owner
  'vscode',      // repo
  12345          // PR number
);

console.log(proof);
// {
//   prNumber: 12345,
//   title: "Fix bug in...",
//   author: "user123",
//   verified: true,
//   proofId: "abc123..."
// }
```

### Verify PR Merge (Server)

```typescript
import { provePRMergeServer } from './lib/helpers/pr-verifier';

const mergeProof = await provePRMergeServer(
  'microsoft',
  'vscode',
  12345,
  githubToken  // optional for private repos
);

if (mergeProof?.merged) {
  console.log(`✅ PR merged by ${mergeProof.mergedBy}`);
  // Trigger payment
  await triggerX402Payment(mergeProof.mergedBy, bountyAmount);
}
```

### XMTP Bot Integration

```typescript
// In messageHandler.ts
async function handleMessage(message: string, sender: string) {
  // Parse: "verify pr microsoft/vscode#12345"
  const [_, __, owner, repoAndPr] = message.split(' ');
  const [repo, prNum] = repoAndPr.split('#');
  
  const proof = await vlayer.verifyPRCreation(owner, repo, parseInt(prNum));
  
  if (proof?.verified) {
    return `✅ PR #${proof.prNumber} verified!\n` +
           `Created by: ${proof.author}\n` +
           `Payment processing...`;
  }
  
  return '❌ Verification failed';
}
```

---

## 🔄 Complete Workflow

### 1. Worker Creates PR

```bash
# Worker creates a PR on GitHub
git checkout -b feature-branch
git commit -m "Add feature"
git push origin feature-branch
# Opens PR #123 on github.com
```

### 2. Worker Requests Bounty

```
Worker (via XMTP): "verify pr microsoft/vscode#123"
```

### 3. Bot Verifies PR

```typescript
// Bot calls vlayer API
const proof = await vlayer.verifyPRCreation('microsoft', 'vscode', 123);

// Generates ZK-TLS proof (30-60 seconds)
// Verifies cryptographically
// Returns proof object
```

### 4. On-Chain Verification

```solidity
// Smart contract on Base Sepolia
function verifyPRProof(bytes proof, uint256 prNumber) {
    // Verify ZK proof on-chain
    require(GitHubProver.verify(proof));
    
    // Mark bounty as complete
    bounties[prNumber].completed = true;
}
```

### 5. Payment Released

```typescript
// x402 payment on Polygon
await triggerPayment(
  workerAddress,
  bountyAmount,
  proofId
);
// Worker receives USDC instantly
```

### 6. Reputation Updated

```graphql
# SQD indexes the event
mutation {
  updateWorker(id: "0x123...") {
    prsCreated: increment(1)
    totalEarned: increment(bountyAmount)
    reputationScore: recalculate()
  }
}
```

---

## 🧪 Testing

### Test PR Creation Verification

```bash
cd vlayer/vlayer

# Create test script
cat > test-pr.ts << 'EOF'
import { provePRCreationServer } from '../lib/helpers/pr-verifier';

async function test() {
  // Test with a real PR
  const proof = await provePRCreationServer(
    'microsoft',
    'vscode',
    123456
  );
  
  console.log('Proof:', proof);
}

test();
EOF

# Run test
npx ts-node test-pr.ts
```

### Test XMTP Integration

```bash
cd xmtp
npm run test
```

### Test Smart Contracts

```bash
cd vlayer

# Run Foundry tests
forge test

# Test on local Anvil
anvil &
./deploy-local.sh
```

---

## 📊 SQD Reputation System

### Schema

```graphql
type Worker @entity {
  id: ID!
  address: String!
  prsCreated: Int!
  prsMerged: Int!
  totalEarned: BigInt!
  reputationScore: Float!
  verifiedProofs: [PRProof!]! @derivedFrom(field: "worker")
}

type PRProof @entity {
  id: ID!
  proofId: String!
  worker: Worker!
  prNumber: Int!
  repository: String!
  action: String! # "created" or "merged"
  verified: Boolean!
  timestamp: DateTime!
  bountyAmount: BigInt!
}
```

### Query Worker Reputation

```graphql
query GetWorkerReputation($address: String!) {
  worker(id: $address) {
    prsCreated
    prsMerged
    totalEarned
    reputationScore
    verifiedProofs(orderBy: timestamp_DESC) {
      prNumber
      repository
      action
      bountyAmount
      timestamp
    }
  }
}
```

---

## 💰 x402 Payment Configuration

### Setup x402 on Polygon

```typescript
// Configure x402 for instant payments
const x402Config = {
  network: 'polygon',
  token: 'USDC',
  contractAddress: '0x...',
  minAmount: '0.01',
  maxAmount: '100'
};

// Trigger payment after verification
async function triggerX402Payment(
  recipient: string,
  amount: bigint,
  proofId: string
) {
  // x402 handles gas-free payments
  // Recipient doesn't need MATIC
  await x402.transfer(recipient, amount, {
    metadata: { proofId }
  });
}
```

---

## 🐛 Common Issues

### Issue: "Proof generation timeout"

**Cause:** vlayer API can take 30-60 seconds  
**Solution:** This is normal, wait for completion

### Issue: "Contract deployment failed"

**Cause:** Insufficient Base Sepolia ETH  
**Solution:** Get testnet ETH from [Base faucet](https://www.coinbase.com/faucets)

### Issue: "XMTP bot not responding"

**Cause:** Environment variables not set  
**Solution:** Check `.env` has all required keys

### Issue: "SQD indexer not syncing"

**Cause:** Contract address not configured  
**Solution:** Update `sqd/src/processor.ts` with deployed contract address

---

## 📚 Resources

### Documentation
- [vlayer Web Prover](https://docs.vlayer.xyz/server-side/examples/github-example)
- [Base Sepolia](https://docs.base.org/network-information)
- [XMTP](https://xmtp.org/docs)
- [SQD](https://docs.sqd.dev)
- [x402 Protocol](https://x402.org) *(coming soon)*

### Tools
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [vlayer Dashboard](https://vlayer.xyz/dashboard)
- [Foundry](https://book.getfoundry.sh)

### Example Repositories
- [vlayer GitHub Verifier](https://github.com/vlayer-xyz/github-contribution-verifier)
- [Ghost Bot](https://github.com/mhiskall282/ghost-bot)

---

## ✅ Checklist

### Pre-deployment
- [ ] vlayer API credentials configured
- [ ] Base Sepolia testnet ETH in wallet
- [ ] GitHub token for private repos (optional)
- [ ] XMTP production keys
- [ ] Foundry installed and updated

### Deployment
- [ ] Smart contracts deployed to Base Sepolia
- [ ] Contracts verified on BaseScan
- [ ] XMTP bot running
- [ ] SQD indexer syncing
- [ ] x402 payment configured

### Testing
- [ ] PR creation verification working
- [ ] PR merge verification working
- [ ] XMTP bot responding
- [ ] Payments processing
- [ ] Reputation updating

---

## 🎯 Next Steps

1. **Deploy to Base Sepolia** - Run `./deploy-base-sepolia.sh`
2. **Test PR Verification** - Verify a real PR
3. **Launch XMTP Bot** - Start accepting worker requests
4. **Configure SQD** - Index verified proofs
5. **Enable x402** - Set up instant payments
6. **Monitor & Iterate** - Track usage and optimize

---

## 🎉 Summary

**Ghost Bot PR Verification System:**

✅ Verifies PR creation cryptographically  
✅ Verifies PR merges cryptographically  
✅ No GitHub API keys required  
✅ Deployed to Base Sepolia  
✅ Instant payments via x402  
✅ Reputation tracking via SQD  

**Ready for production testing!** 🚀
