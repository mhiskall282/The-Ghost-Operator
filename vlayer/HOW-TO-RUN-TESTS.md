# How to Run vlayer PR Verification Tests

## Prerequisites

1. **Node.js 20+** installed
2. **vlayer API credentials** in `.env` file
3. **Execute permissions** on test scripts

## Quick Setup

### 1. Set Execute Permissions

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Make scripts executable
chmod +x run-quick-test.sh
chmod +x run-test.sh
chmod +x test-comprehensive.mjs
chmod +x test-pr-quick.mjs
chmod +x test-pr-verification.mjs
```

### 2. Verify Environment Variables

```bash
# Check if .env exists
ls -la .env

# Verify credentials are set
cat .env | grep WEB_PROVER_API
```

Your `.env` should contain:
```bash
WEB_PROVER_API_CLIENT_ID=your_client_id_here
WEB_PROVER_API_SECRET=your_api_secret_here
```

---

## Running Tests

### Option 1: Quick Test (Bash Wrapper)

**Simplest method** - automatically loads `.env` variables:

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-quick-test.sh
```

**What it does:**
- Loads environment variables from `.env`
- Runs `test-pr-quick.mjs`
- Tests PR #200000 from microsoft/vscode
- Verifies both creation and merge

**Expected output:**
```
============================================================
🚀 Quick PR Verification Test
============================================================

Testing with: microsoft/vscode#200000

📋 Testing PR Creation Verification...
✅ SUCCESS: PR Creation Verified!
   Title: Apply `font-variation-settings` to the suggestion widget
   Author: chengluyu

📋 Testing PR Merge Verification...
✅ SUCCESS: PR Merge Verified!
   Merged by: jrieken
   Merged at: 2025-06-06T06:51:31Z

============================================================
🎉 Test Complete!
============================================================
```

**Duration:** ~60-120 seconds (30-60s per test)

---

### Option 2: Comprehensive Test (Node.js)

**Most detailed** - includes environment checks and colored output:

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Method 1: With bash wrapper (loads .env automatically)
./run-test.sh

# Method 2: Direct execution (requires manual .env loading)
export $(cat .env | grep -v '^#' | xargs)
node test-comprehensive.mjs
```

**What it does:**
- Checks environment variables
- Tests PR creation verification
- Tests PR merge verification
- Provides detailed timing and results
- Shows test summary with percentage

**Expected output:**
```
============================================================
🧪 vlayer Web Prover - Comprehensive Test Suite
============================================================

Environment Check
─────────────────────────────────────────────────────────
✅ WEB_PROVER_API_CLIENT_ID: Set
✅ WEB_PROVER_API_SECRET: Set

TEST 1: PR Creation Verification
─────────────────────────────────────────────────────────
✅ SUCCESS: PR Creation Verified!
   Duration: 45.23s
   PR #200000
   Title: Apply `font-variation-settings` to the suggestion widget
   Author: chengluyu

TEST 2: PR Merge Verification
─────────────────────────────────────────────────────────
✅ SUCCESS: PR Merge Verified!
   Duration: 38.91s
   PR #200000
   Merged: Yes
   Merged By: jrieken

============================================================
📊 Test Summary
============================================================
1. PR Creation Verification: ✅ PASS
2. PR Merge Verification: ✅ PASS

Tests Passed: 2/2 (100%)

🎉 All tests passed! System is ready for deployment.
```

**Duration:** ~60-120 seconds total

---

### Option 3: Individual Test Scripts

**For debugging** - run specific tests:

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Load environment variables first
export $(cat .env | grep -v '^#' | xargs)

# Run quick test
node test-pr-quick.mjs

# OR run verification test
node test-pr-verification.mjs
```

---

## Understanding Test Results

### Success Indicators

✅ **PR Creation Verified:**
- Proof generated and verified
- Returns PR details: title, author, creation date, state
- Cryptographic proof confirms GitHub API data authenticity

✅ **PR Merge Verified:**
- Proof generated and verified
- Returns merge details: merger, merge timestamp
- Cryptographic proof confirms PR was actually merged

### What Gets Tested

1. **Environment Setup**
   - API credentials present
   - .env file configured

2. **PR Creation Verification**
   - Calls GitHub GraphQL API
   - Generates ZK-TLS proof via vlayer Web Prover
   - Verifies proof cryptographically
   - Returns verified PR data

3. **PR Merge Verification**
   - Calls GitHub GraphQL API
   - Generates ZK-TLS proof for merge event
   - Verifies proof cryptographically
   - Returns verified merge data

---

## Troubleshooting

### Error: "Permission denied"

```bash
# Fix: Make script executable
chmod +x run-quick-test.sh
# OR use absolute path
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

### Error: "WEB_PROVER_API_CLIENT_ID not set"

```bash
# Check if .env exists
ls -la .env

# Check if credentials are in .env
cat .env

# Load manually
export $(cat .env | grep -v '^#' | xargs)

# Verify loaded
echo $WEB_PROVER_API_CLIENT_ID
```

### Error: "Cannot find module './lib/helpers/pr-verifier.js'"

```bash
# Make sure you're in the correct directory
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Verify file exists
ls -la lib/helpers/pr-verifier.js

# Run with absolute path
node /Users/dreytech/Projects/ghost-bot/vlayer/test-comprehensive.mjs
```

### Error: "Proof generation timeout"

This is normal for large PRs. The vlayer Web Prover can take 30-60 seconds per proof. Wait for completion.

### Error: "No such file or directory: vlayer/vlayer/tsconfig.json"

This is a VS Code cache issue (the old directory was deleted). Fix:
```bash
# Reload VS Code window
# Command Palette (Cmd+Shift+P) → "Developer: Reload Window"
```

---

## Test Scripts Overview

| Script | Purpose | Duration | Best For |
|--------|---------|----------|----------|
| `run-quick-test.sh` | Quick smoke test | 60-120s | Daily checks |
| `run-test.sh` | Full comprehensive test | 60-120s | Pre-deployment |
| `test-comprehensive.mjs` | Detailed Node.js test | 60-120s | Debugging |
| `test-pr-quick.mjs` | Basic PR verification | 60-120s | Development |
| `test-pr-verification.mjs` | Custom PR testing | 60-120s | Specific PRs |

---

## Running Tests in Different Scenarios

### Scenario 1: First Time Setup

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# 1. Check Node.js version
node --version  # Should be 20+

# 2. Set permissions
chmod +x *.sh *.mjs

# 3. Verify .env
cat .env

# 4. Run quick test
./run-quick-test.sh
```

### Scenario 2: Before Deployment

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Run comprehensive test
./run-test.sh

# Should show 100% pass rate
```

### Scenario 3: Testing Specific PR

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Edit test-pr-verification.mjs
# Change owner, repo, prNumber

# Load env and run
export $(cat .env | grep -v '^#' | xargs)
node test-pr-verification.mjs
```

### Scenario 4: CI/CD Pipeline

```bash
#!/bin/bash
set -e

cd /Users/dreytech/Projects/ghost-bot/vlayer

# Load environment
export $(cat .env | grep -v '^#' | xargs)

# Run comprehensive test
node test-comprehensive.mjs

# Exit code 0 = all tests passed
# Exit code 1 = some tests failed
```

---

## Expected Test Performance

- **PR Creation Proof:** 30-60 seconds
- **PR Merge Proof:** 30-60 seconds
- **Total Test Time:** 60-120 seconds
- **Success Rate:** 100% (with valid credentials)

---

## Next Steps After Tests Pass

Once all tests show ✅ PASS:

1. **Deploy Smart Contracts to Base Sepolia**
   ```bash
   ./deploy-base-sepolia.sh
   ```

2. **Integrate with XMTP Bot**
   - Update `xmtp/src/messageHandler.ts`
   - Add PR verification message handling

3. **Configure SQD Indexer**
   - Index BountyCompleted events
   - Track worker reputation scores

4. **Set up x402 Payments**
   - Configure Polygon integration
   - Enable automatic fund disbursement

---

## Support

For issues or questions:
- Check [CLEAN-ARCHITECTURE.md](./CLEAN-ARCHITECTURE.md) for architecture details
- Check [TESTING.md](./TESTING.md) for testing documentation
- Review [vlayer docs](https://docs.vlayer.xyz/server-side/examples/github-example)
