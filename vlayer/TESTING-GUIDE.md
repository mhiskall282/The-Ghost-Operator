# Testing Guide - vlayer Web Prover Integration

## Overview

This guide provides detailed instructions for testing the vlayer Web Prover integration for PR verification. All tests verify GitHub pull requests cryptographically using ZK-TLS proofs.

---

## Prerequisites

### 1. Environment Setup

Create a `.env` file in `/Users/dreytech/Projects/ghost-bot/vlayer/`:

```bash
# vlayer Web Prover API Credentials (REQUIRED)
WEB_PROVER_API_CLIENT_ID=your_client_id
WEB_PROVER_API_SECRET=your_api_secret

# Optional: Base Sepolia Deployment
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_key
```

### 2. Dependencies

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
pnpm install
```

### 3. File Permissions

All test scripts must be executable:

```bash
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-quick.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-verification.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-comprehensive.mjs
```

---

## Test Scripts

### 1. Quick Test (`run-quick-test.sh`)

**Purpose:** Fast verification test for both PR creation and merge

**Location:** `/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh`

**What it does:**
- Loads `.env` environment variables
- Tests PR creation verification
- Tests PR merge verification
- Uses microsoft/vscode#200000 (known merged PR)

**How to run:**

```bash
# Option 1: From vlayer directory
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-quick-test.sh

# Option 2: Absolute path (works from anywhere)
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

**Expected output:**

```
============================================================
🚀 Quick PR Verification Test
============================================================

Testing with: microsoft/vscode#200000

📋 Testing PR Creation Verification...
⏳ Please wait 30-60 seconds...

🔐 Proving PR creation: microsoft/vscode#200000
✅ Proof generated, now verifying...
✅ Verified PR creation: #200000 by chengluyu
✅ SUCCESS: PR Creation Verified!
   Title: Apply `font-variation-settings` to the suggestion widget (fix #199954)
   Author: chengluyu
   Proof ID: [cryptographic proof ID]

------------------------------------------------------------

📋 Testing PR Merge Verification...
⏳ Please wait 30-60 seconds...

🔐 Proving PR merge: microsoft/vscode#200000
✅ Proof generated, now verifying...
✅ Verified PR merge: #200000 merged by jrieken
✅ SUCCESS: PR Merge Verified!
   Merged by: jrieken
   Merged at: 2025-06-06T06:51:31Z
   Proof ID: [cryptographic proof ID]

============================================================
🎉 Test Complete!
============================================================
```

**Duration:** 60-120 seconds (30-60 seconds per verification)

---

### 2. Comprehensive Test (`run-comprehensive-test.sh`)

**Purpose:** Detailed test suite with environment checks and error handling

**Location:** `/Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh`

**What it does:**
- Validates environment variables
- Tests PR creation with detailed output
- Tests PR merge with detailed output
- Provides timing information
- Shows detailed error messages if tests fail

**How to run:**

```bash
# Option 1: From vlayer directory
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-comprehensive-test.sh

# Option 2: Absolute path (works from anywhere)
/Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
```

**Expected output:**

```
============================================================
🧪 vlayer Web Prover - Comprehensive Test Suite
============================================================
Testing PR verification with cryptographic proofs
Using: microsoft/vscode#200000 (known merged PR)

────────────────────────────────────────────────────────────
Environment Check
────────────────────────────────────────────────────────────
✅ WEB_PROVER_API_CLIENT_ID: Set
✅ WEB_PROVER_API_SECRET: Set

────────────────────────────────────────────────────────────
TEST 1: PR Creation Verification
────────────────────────────────────────────────────────────
📋 Repository: microsoft/vscode
📌 PR Number: #200000
⏳ Generating proof... (30-60 seconds)

[... detailed output ...]

✅ PR Creation Verified Successfully
   ⏱️  Time: 45.2 seconds
   
────────────────────────────────────────────────────────────
TEST 2: PR Merge Verification
────────────────────────────────────────────────────────────
[... detailed output ...]

✅ PR Merge Verified Successfully
   ⏱️  Time: 42.8 seconds

============================================================
📊 Test Summary
============================================================
Total Tests: 2
Passed: 2
Failed: 0
Total Time: 88.0 seconds

✅ All tests passed!
============================================================
```

**Duration:** 60-120 seconds

---

### 3. Direct Node.js Tests (Without Shell Wrapper)

If you prefer running tests directly with Node.js:

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Load environment variables first
export $(cat .env | grep -v '^#' | xargs)

# Run quick test
node test-pr-quick.mjs

# Run comprehensive test
node test-comprehensive.mjs
```

---

## Test Files Explained

### File Structure

```
vlayer/
├── run-quick-test.sh              # Shell wrapper for quick test
├── run-comprehensive-test.sh      # Shell wrapper for comprehensive test
├── test-pr-quick.mjs              # Quick test implementation (Node.js)
├── test-pr-verification.mjs       # PR verification test
├── test-comprehensive.mjs         # Comprehensive test implementation
└── lib/helpers/
    ├── pr-verifier.js             # JavaScript PR verification helpers
    └── pr-verifier.ts             # TypeScript PR verification helpers
```

### Script Details

#### `run-quick-test.sh`
```bash
#!/bin/bash
cd "$(dirname "$0")"
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi
node test-pr-quick.mjs
```

- **chmod required:** `chmod +x run-quick-test.sh`
- **Purpose:** Loads .env and runs quick test
- **Dependencies:** Node.js, .env file

#### `run-comprehensive-test.sh`
```bash
#!/bin/bash
cd "$(dirname "$0")"
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi
node test-comprehensive.mjs
```

- **chmod required:** `chmod +x run-comprehensive-test.sh`
- **Purpose:** Loads .env and runs comprehensive test
- **Dependencies:** Node.js, .env file

---

## Common Issues & Solutions

### Issue 1: Permission Denied

**Error:**
```
zsh: permission denied: ./run-quick-test.sh
```

**Solution:**
```bash
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
```

### Issue 2: Missing Environment Variables

**Error:**
```
❌ WEB_PROVER_API_CLIENT_ID: Missing
❌ WEB_PROVER_API_SECRET: Missing
```

**Solution:**
1. Create `.env` file in `/Users/dreytech/Projects/ghost-bot/vlayer/`
2. Add your vlayer credentials:
   ```bash
   WEB_PROVER_API_CLIENT_ID=your_client_id
   WEB_PROVER_API_SECRET=your_api_secret
   ```

### Issue 3: File Not Found

**Error:**
```
zsh: no such file or directory: ./run-quick-test.sh
```

**Solution:**
```bash
# Always use absolute path or cd first
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-quick-test.sh

# OR use absolute path
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

### Issue 4: Old TypeScript Config Error

**Error:**
```
No inputs were found in config file '/Users/dreytech/Projects/ghost-bot/vlayer/vlayer/tsconfig.json'
```

**Solution:**
This is a VS Code TypeScript language server cache issue. The old `vlayer/vlayer/` directory has been deleted. To fix:

1. **Reload VS Code window:**
   - Press `Cmd+Shift+P` (macOS)
   - Type "Reload Window"
   - Press Enter

2. **Or restart TypeScript server:**
   - Press `Cmd+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

The error is editor-only and doesn't affect test execution.

---

## Manual Testing

### Test PR Creation Only

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
export $(cat .env | grep -v '^#' | xargs)

node -e "
import('./lib/helpers/pr-verifier.js').then(async ({ provePRCreationServer }) => {
  const result = await provePRCreationServer('microsoft', 'vscode', 200000);
  console.log('✅ PR Creation:', result);
});
"
```

### Test PR Merge Only

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
export $(cat .env | grep -v '^#' | xargs)

node -e "
import('./lib/helpers/pr-verifier.js').then(async ({ provePRMergeServer }) => {
  const result = await provePRMergeServer('microsoft', 'vscode', 200000);
  console.log('✅ PR Merge:', result);
});
"
```

### Test Custom PR

Replace with your own PR:

```bash
export $(cat .env | grep -v '^#' | xargs)
node -e "
import('./lib/helpers/pr-verifier.js').then(async ({ provePRCreationServer }) => {
  const result = await provePRCreationServer('OWNER', 'REPO', PR_NUMBER);
  console.log(result);
});
"
```

---

## Performance

### Expected Timings

| Test Type | Duration | What's Happening |
|-----------|----------|------------------|
| PR Creation | 30-60 seconds | ZK-TLS proof generation via vlayer |
| PR Merge | 30-60 seconds | ZK-TLS proof generation via vlayer |
| Full Test Suite | 60-120 seconds | Both creation + merge verification |

### Why Does It Take Time?

Each verification involves:
1. **Fetching GitHub data** (1-2 seconds)
2. **Generating cryptographic proof** (25-55 seconds) - This is the ZK-TLS proof generation via vlayer Web Prover API
3. **Verifying proof** (2-5 seconds)

The proof generation is intentionally slow because it's performing cryptographic operations to create a verifiable proof.

---

## Test Data

### Default Test Case

All tests use **microsoft/vscode#200000** because:
- ✅ Known merged PR (stable test data)
- ✅ Public repository (no auth needed)
- ✅ Successfully merged by `jrieken` on 2025-06-06
- ✅ Created by `chengluyu`
- ✅ Title: "Apply `font-variation-settings` to the suggestion widget (fix #199954)"

---

## Next Steps After Testing

Once all tests pass:

1. **Deploy Smart Contracts to Base Sepolia**
   ```bash
   cd /Users/dreytech/Projects/ghost-bot/vlayer
   ./deploy-base-sepolia.sh
   ```

2. **Integrate with XMTP Bot**
   - Update `xmtp/src/messageHandler.ts`
   - Add PR verification message handling
   - Test end-to-end flow

3. **Configure SQD Indexer**
   - Index verified PRs for Worker Reputation
   - Set up Worker Score calculation

4. **Set Up x402 Payments**
   - Configure payment triggers
   - Test fund disbursement

---

## Troubleshooting

### Check Environment

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Check if .env exists
ls -la .env

# Verify credentials are set
if [ -f .env ]; then
  source .env
  echo "Client ID: ${WEB_PROVER_API_CLIENT_ID:0:10}..."
  echo "Secret: ${WEB_PROVER_API_SECRET:0:10}..."
fi
```

### Check File Permissions

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
ls -la *.sh *.mjs
```

All scripts should show `-rwxr-xr-x` (executable).

### Verify Dependencies

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
pnpm list next @types/node typescript
```

### Check Test Files

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
node -c test-pr-quick.mjs && echo "✅ Syntax OK"
node -c test-comprehensive.mjs && echo "✅ Syntax OK"
```

---

## Support

If tests fail:
1. Check environment variables are set
2. Verify internet connection (needs to reach vlayer API)
3. Confirm vlayer API credentials are valid
4. Check GitHub API rate limits
5. Review error messages in test output

For persistent issues, check:
- [vlayer Documentation](https://docs.vlayer.xyz/)
- [GitHub API Status](https://www.githubstatus.com/)
- Project documentation in `vlayer/CLEAN-ARCHITECTURE.md`
