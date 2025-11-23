# 🧪 Testing PR Verification Functions

This directory contains test scripts for verifying GitHub Pull Requests using vlayer's Web Prover API.

## Prerequisites

1. **Environment Variables** - Create a `.env` file:
```bash
WEB_PROVER_API_CLIENT_ID=your_client_id
WEB_PROVER_API_SECRET=your_api_secret
```

2. **Node.js 20+**
```bash
nvm use 20
```

3. **Dependencies Installed**
```bash
npm install  # or pnpm install
```

---

## Test Scripts

### 1. Quick Test (`test-pr-quick.mjs`)

Tests with a known merged PR from microsoft/vscode:

```bash
node test-pr-quick.mjs
```

**What it tests:**
- ✅ PR Creation verification
- ✅ PR Merge verification
- Uses PR #200000 from microsoft/vscode (a real merged PR)

**Expected output:**
```
🚀 Quick PR Verification Test
========================================

Testing with: microsoft/vscode#200000

📋 Testing PR Creation Verification...
⏳ Please wait 30-60 seconds...

✅ SUCCESS: PR Creation Verified!
   Title: [PR title here]
   Author: [username]
   Proof ID: [proof-id]

📋 Testing PR Merge Verification...
⏳ Please wait 30-60 seconds...

✅ SUCCESS: PR Merge Verified!
   Merged by: [username]
   Merged at: [timestamp]
   Proof ID: [proof-id]

🎉 Test Complete!
```

---

### 2. Custom Test (`test-pr-verification.mjs`)

Test with any PR you specify:

```bash
node test-pr-verification.mjs <owner> <repo> <pr-number> [github-token]
```

**Examples:**

```bash
# Test a public repo PR
node test-pr-verification.mjs microsoft vscode 200000

# Test a private repo PR (requires GitHub token)
node test-pr-verification.mjs myorg myrepo 123 ghp_yourtoken
```

**What it tests:**
- ✅ PR Creation verification with custom PR
- ✅ PR Merge verification with custom PR
- ✅ Both public and private repos (with token)

---

## Understanding the Output

### Successful PR Creation Verification

```
✅ PR Creation Verified!
   PR #12345: Fix bug in feature X
   Created by: username123
   Created at: 11/23/2025, 10:30:00 AM
   State: closed
   URL: https://github.com/owner/repo/pull/12345
   Proof ID: abc123-def456-789
   Duration: 45.2s
```

### Successful PR Merge Verification

```
✅ PR Merge Verified!
   PR #12345 is MERGED
   Merged by: maintainer456
   Merged at: 11/23/2025, 11:45:00 AM
   Proof ID: xyz789-abc123-456
   Duration: 38.7s
```

### PR Not Merged Yet

```
⚠️  PR is NOT merged yet
   PR #12345 is still open or closed (not merged)
   Proof ID: proof-id-here
   Duration: 42.1s
```

### Failed Verification

```
❌ PR Creation Verification Failed
   Proof was not generated or verified
```

---

## How It Works

### 1. Proof Generation

```javascript
// The test calls vlayer Web Prover API
const proveResponse = await fetch('https://web-prover.vlayer.xyz/api/v1/prove', {
  method: 'POST',
  headers: {
    'x-client-id': CLIENT_ID,
    'Authorization': 'Bearer ' + API_SECRET,
  },
  body: JSON.stringify({
    url: 'https://api.github.com/repos/owner/repo/pulls/123',
    headers: ['User-Agent: ...', 'Accept: application/vnd.github+json']
  })
});
```

### 2. Proof Verification

```javascript
// Verify the cryptographic proof
const verifyResponse = await fetch('https://web-prover.vlayer.xyz/api/v1/verify', {
  method: 'POST',
  headers: {
    'x-client-id': CLIENT_ID,
    'Authorization': 'Bearer ' + API_SECRET,
  },
  body: JSON.stringify(presentation)
});
```

### 3. Data Extraction

```javascript
// Parse verified GitHub data
const verificationResult = await verifyResponse.json();
const prData = JSON.parse(verificationResult.response.body);

// Now we have cryptographically verified PR data:
// - prData.number
// - prData.title
// - prData.user.login (author)
// - prData.merged (true/false)
// - prData.merged_by (who merged it)
```

---

## Troubleshooting

### Error: "Missing vlayer API credentials"

**Fix:**
```bash
# Check .env file exists
cat .env

# If not, create it
echo "WEB_PROVER_API_CLIENT_ID=your_id" > .env
echo "WEB_PROVER_API_SECRET=your_secret" >> .env
```

### Error: "Cannot find module"

**Fix:**
```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

### Error: "Proof generation timeout"

**Cause:** ZK proof generation takes 30-60 seconds (normal)

**Fix:** Just wait - this is expected behavior

### Error: "PR not found"

**Cause:** Invalid PR number or private repo without token

**Fix:**
```bash
# For private repos, provide GitHub token
node test-pr-verification.mjs owner repo 123 ghp_yourtoken
```

### Error: "Rate limit exceeded"

**Cause:** Too many GitHub API requests

**Fix:** Wait a few minutes or use a GitHub token for higher rate limits

---

## Next Steps

After successful tests:

1. **Integrate with XMTP Bot**
   ```bash
   cd ../xmtp
   # Update messageHandler.ts to use these functions
   ```

2. **Deploy Smart Contracts**
   ```bash
   cd ../vlayer
   ./deploy-base-sepolia.sh
   ```

3. **Set up SQD Indexer**
   ```bash
   cd ../sqd
   npm run build
   npm run start
   ```

---

## Test Results Checklist

- [ ] Quick test passes (both creation and merge)
- [ ] Custom test works with public repos
- [ ] Custom test works with private repos (with token)
- [ ] Proof generation completes in 30-60 seconds
- [ ] Verification returns correct PR data
- [ ] Error handling works (invalid PRs, missing credentials)

---

## Support

If tests fail:

1. Check vlayer API credentials
2. Verify GitHub API is accessible
3. Test with a known merged PR (e.g., microsoft/vscode#200000)
4. Check network connectivity
5. Review logs for specific error messages

For more help, see:
- [vlayer Documentation](https://docs.vlayer.xyz)
- [Setup Guide](../SETUP-GUIDE.md)
- [Implementation Summary](../IMPLEMENTATION-SUMMARY.md)
