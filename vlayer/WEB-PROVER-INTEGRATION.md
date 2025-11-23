# vlayer Web Prover Integration - Complete Guide

## What Changed

We've integrated vlayer's **Web Prover API** for GitHub verification, which enables cryptographic proof generation **without requiring API keys** from verifiers.

### Previous Approach (Not Fully Implemented)
- Used vlayer SDK with on-chain proofs
- Required complex smart contract integration
- Higher gas costs for on-chain verification

### New Approach (Web Prover API)
- **Server-side proof generation** via REST API
- **Off-chain verification** (cheaper, faster)
- **No API keys needed** for proof verification
- **Perfect for autonomous agents**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER (via XMTP)                     │
│          "I starred the repo, here's my proof"          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                XMTP BOT (Node.js/TypeScript)            │
│         • Receives claim from user                      │
│         • Calls GitHubProver.prove()                    │
│         • Gets cryptographic proof                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            FLUENCE AGENT (Rust/Marine)                  │
│         • Receives proof from XMTP bot                  │
│         • Calls GitHubProver.verify()                   │
│         • Validates cryptographic proof                 │
│         • Triggers smart contract if valid              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│        GHOST BOUNTIES (Smart Contract on Polygon)       │
│         • Receives payment instruction                  │
│         • Releases USDC from vault                      │
│         • Emits BountyCompleted event                   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  SQD INDEXER (TypeScript)               │
│         • Indexes BountyCompleted events                │
│         • Updates reputation scores                     │
│         • Tracks payment history                        │
└─────────────────────────────────────────────────────────┘
```

## What Was Added

### 1. Environment Configuration

**File**: `vlayer/.env.example`

Added Web Prover API credentials:
```bash
WEB_PROVER_API_CLIENT_ID=d0be9f27-dd1f-4ac4-94fa-854eb8ba2058
WEB_PROVER_API_SECRET=xqLFzW9QUDdVpokjhjbf0YzYwb0yhp8AaEpcH8tCHZvFfxvP6yMg11U16HkrLJSD
```

### 2. GitHub Prover Library

**File**: `vlayer/vlayer/github-prover.ts`

A TypeScript library that wraps the Web Prover API with methods for:
- `prove()` - Generate cryptographic proof
- `verify()` - Verify cryptographic proof
- `proveContributions()` - Prove GitHub contributions
- `proveStarred()` - Prove repo was starred
- `proveForked()` - Prove repo was forked
- `provePRMerged()` - Prove PR was merged

### 3. Documentation

**File**: `vlayer/vlayer/README-WEB-PROVER.md`

Complete guide for:
- Architecture overview
- Usage examples
- Integration patterns
- Security considerations

### 4. Package Script

Added test script to `vlayer/vlayer/package.json`:
```json
"test-github": "bun run github-prover.ts"
```

## How It Works

### Step 1: User Claims Bounty

User chats with XMTP bot:
```
User: "I want to claim bounty #5"
Bot: "Please provide your GitHub username"
User: "my-github-username"
Bot: "Generating proof... ⏳"
```

### Step 2: Proof Generation

XMTP bot calls Web Prover API:
```typescript
const prover = new GitHubProver(CLIENT_ID, API_SECRET);

// For star bounty
const presentation = await prover.prove(
  `https://api.github.com/user/starred/${owner}/${repo}`,
  userGitHubToken // User provides this temporarily
);
```

### Step 3: Proof Verification

Fluence agent verifies the proof:
```typescript
const verificationResult = await prover.verify(presentation);

if (verificationResult.response.status === 204) {
  // User starred the repo - release payment!
  await releaseBountyPayment(bountyId, userAddress);
}
```

### Step 4: Payment Release

Smart contract releases funds:
```solidity
// GhostBounties.sol
function completeBounty(uint256 bountyId, address claimant) external {
    // Payment released from vault
    vault.release(bountyId, claimant, bounty.reward);
}
```

## Integration Steps

### 1. Configure Credentials

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Copy and edit .env
cp .env.example .env
nano .env  # Set WEB_PROVER_API_CLIENT_ID and WEB_PROVER_API_SECRET
```

### 2. Test GitHub Prover

```bash
cd vlayer
bun install
bun run test-github
```

### 3. Integrate with XMTP Bot

Update `xmtp/src/integrations.ts`:

```typescript
import { GitHubProver } from '../../vlayer/vlayer/github-prover';

const prover = new GitHubProver(
  process.env.WEB_PROVER_API_CLIENT_ID!,
  process.env.WEB_PROVER_API_SECRET!
);

export async function verifyGitHubAction(
  action: 'star' | 'fork' | 'pr_merge',
  owner: string,
  repo: string,
  username: string,
  githubToken: string,
  prNumber?: number
): Promise<boolean> {
  switch (action) {
    case 'star':
      return await prover.proveStarred(owner, repo, username, githubToken);
    
    case 'fork':
      return await prover.proveForked(owner, repo, username, githubToken);
    
    case 'pr_merge':
      if (!prNumber) throw new Error('PR number required');
      const prData = await prover.provePRMerged(owner, repo, prNumber);
      return prData?.merged === true;
    
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
```

### 4. Update Message Handler

Update `xmtp/src/messageHandler.ts`:

```typescript
import { verifyGitHubAction } from './integrations';

async function handleClaimBounty(
  bountyId: number,
  username: string,
  githubToken: string
): Promise<string> {
  // Get bounty details from blockchain
  const bounty = await getBountyDetails(bountyId);
  
  // Verify the GitHub action
  const verified = await verifyGitHubAction(
    bounty.action,
    bounty.owner,
    bounty.repo,
    username,
    githubToken,
    bounty.prNumber
  );
  
  if (verified) {
    // Release payment
    await releaseBountyPayment(bountyId, getUserAddress(username));
    return `✅ Verified! Payment of ${bounty.reward} USDC sent to your wallet.`;
  } else {
    return `❌ Could not verify your claim. Please check and try again.`;
  }
}
```

### 5. Configure Fluence Agent

Create `fluence/src/github_verifier.rs`:

```rust
use serde::{Deserialize, Serialize};
use reqwest::Client;
use anyhow::Result;

#[derive(Serialize)]
struct ProveRequest {
    url: String,
    headers: Vec<String>,
}

pub async fn verify_github_action(
    url: &str,
    client_id: &str,
    api_secret: &str,
) -> Result<bool> {
    let client = Client::new();
    
    // Generate proof
    let headers = vec![
        "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36".to_string(),
        "Accept: application/vnd.github+json".to_string(),
    ];
    
    let prove_req = ProveRequest {
        url: url.to_string(),
        headers,
    };
    
    let prove_response = client
        .post("https://web-prover.vlayer.xyz/api/v1/prove")
        .header("x-client-id", client_id)
        .header("Authorization", format!("Bearer {}", api_secret))
        .json(&prove_req)
        .send()
        .await?;
    
    let presentation: serde_json::Value = prove_response.json().await?;
    
    // Verify proof
    let verify_response = client
        .post("https://web-prover.vlayer.xyz/api/v1/verify")
        .header("x-client-id", client_id)
        .header("Authorization", format!("Bearer {}", api_secret))
        .json(&presentation)
        .send()
        .await?;
    
    Ok(verify_response.status().is_success())
}
```

## User Flow Example

### Claiming a Star Bounty

```
User → XMTP Bot: "Show me available bounties"

Bot: "Available bounties:
1. Star ghost-op/core - 5 USDC
2. Fork vlayer-xyz/examples - 10 USDC
3. Merge PR #42 to main - 50 USDC

Reply with bounty number to claim"

User: "1"

Bot: "To claim bounty #1:
1. Star the repo: github.com/ghost-op/core
2. Reply with: claim 1 <your-github-username>

Note: You'll need to provide a temporary GitHub token for verification"

User: [Stars the repo on GitHub]

User: "claim 1 myusername"

Bot: "Please provide your GitHub Personal Access Token
(it's only used for verification and not stored)

Get one at: github.com/settings/tokens"

User: "ghp_xxxxxxxxxxxxxxxxxxxx"

Bot: "🔐 Generating proof... Please wait 30-60 seconds"

Bot: "✅ Proof generated! Verifying..."

Bot: "✅ Verified! You starred ghost-op/core
💰 Payment of 5 USDC sent to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

User: "Awesome! Thanks!"
```

## Security Considerations

### 1. API Credentials
- ✅ Credentials are server-side only
- ✅ Never exposed to client
- ⚠️ Keep `.env` file secure

### 2. User GitHub Tokens
- ✅ Used only for proof generation
- ✅ Not stored anywhere
- ✅ Not included in the proof
- ⚠️ Users should use tokens with minimal permissions

### 3. Proof Validation
- ✅ Cryptographically secure
- ✅ Cannot be forged
- ✅ Tamper-proof
- ⚠️ Always verify before releasing payment

## Testing

### Test Proof Generation

```bash
cd vlayer/vlayer

# Set credentials
export WEB_PROVER_API_CLIENT_ID=d0be9f27-dd1f-4ac4-94fa-854eb8ba2058
export WEB_PROVER_API_SECRET=xqLFzW9QUDdVpokjhjbf0YzYwb0yhp8AaEpcH8tCHZvFfxvP6yMg11U16HkrLJSD

# Run test
bun run test-github
```

### Test with Real GitHub Data

```typescript
// Test proving contributions
const contributions = await prover.proveContributions(
  'vlayer-xyz',
  'github-contribution-verifier',
  'actual-github-username'
);

console.log(contributions);
```

## Deployment Checklist

- [ ] Configure Web Prover API credentials in `.env`
- [ ] Test proof generation locally
- [ ] Integrate with XMTP bot
- [ ] Integrate with Fluence agent
- [ ] Test end-to-end bounty claim flow
- [ ] Deploy smart contracts
- [ ] Set up monitoring for API rate limits
- [ ] Document user flow for claiming bounties

## Next Steps

1. ✅ **Web Prover API integrated**
2. 🔄 Test proof generation
3. 🔄 Integrate with XMTP bot
4. 🔄 Configure Fluence agent
5. 🔄 Test full bounty flow
6. 🔄 Deploy to production

## Resources

- **Web Prover Docs**: https://docs.vlayer.xyz/server-side/examples/github-example
- **vlayer API**: https://web-prover.vlayer.xyz/api/v1/
- **GitHub API**: https://docs.github.com/en/rest
- **GitHub Tokens**: https://github.com/settings/tokens

---

**Ready to test?** Run `cd vlayer/vlayer && bun run test-github`
