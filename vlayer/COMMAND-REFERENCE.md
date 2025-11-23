# Complete Test Command Reference

## 🎯 **Expected Test Output**

When you run the tests successfully, you should see:

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
   Proof ID: unknown

------------------------------------------------------------

📋 Testing PR Merge Verification...
⏳ Please wait 30-60 seconds...

🔐 Proving PR merge: microsoft/vscode#200000
✅ Proof generated, now verifying...
✅ Verified PR merge: #200000 merged by jrieken
✅ SUCCESS: PR Merge Verified!
   Merged by: jrieken
   Merged at: 2025-06-06T06:51:31Z
   Proof ID: unknown

============================================================
🎉 Test Complete!
============================================================
```

---

## ⚙️ **Prerequisites Setup**

### 1. Environment Variables (.env file)

**Location:** `/Users/dreytech/Projects/ghost-bot/vlayer/.env`

**Create the file:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
cat > .env << 'EOF'
# vlayer Web Prover API Credentials (REQUIRED)
WEB_PROVER_API_CLIENT_ID=your_client_id_here
WEB_PROVER_API_SECRET=your_api_secret_here

# Optional: Base Sepolia Deployment
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_key
EOF
```

**Verify .env exists:**
```bash
ls -la /Users/dreytech/Projects/ghost-bot/vlayer/.env
```

**Check credentials are set:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
grep -E "WEB_PROVER_API" .env
```

### 2. Install Dependencies

```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
pnpm install
```

**Verify installation:**
```bash
ls -la /Users/dreytech/Projects/ghost-bot/vlayer/node_modules/next
ls -la /Users/dreytech/Projects/ghost-bot/vlayer/node_modules/@types/node
```

### 3. Set File Permissions (REQUIRED - Run Once)

**Make all test scripts executable:**
```bash
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-quick.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-verification.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-comprehensive.mjs
```

**Or set all at once:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
chmod +x *.sh *.mjs
```

**Verify permissions:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
ls -la run-quick-test.sh run-comprehensive-test.sh
```

Should show: `-rwxr-xr-x` (the `x` means executable)

---

## 🚀 **Running Tests**

### Option 1: Quick Test (Recommended)

**Command (works from anywhere):**
```bash
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

**Or from vlayer directory:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-quick-test.sh
```

**What it does:**
1. Changes to the vlayer directory
2. Loads environment variables from `.env`
3. Runs PR creation verification test
4. Runs PR merge verification test
5. Shows success/failure for both tests

**Duration:** 60-120 seconds (30-60s per test)

### Option 2: Comprehensive Test

**Command (works from anywhere):**
```bash
/Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
```

**Or from vlayer directory:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-comprehensive-test.sh
```

**What it does:**
1. Validates environment variables first
2. Shows detailed test output with colors
3. Provides timing for each test
4. Shows comprehensive summary at the end

**Duration:** 60-120 seconds

### Option 3: Manual Node.js Test (Without Shell Wrapper)

**First, load environment variables:**
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
export $(cat .env | grep -v '^#' | xargs)
```

**Then run test:**
```bash
node test-pr-quick.mjs
```

---

## 📋 **Complete Step-by-Step Guide**

### First Time Setup (Do Once)

```bash
# Step 1: Navigate to vlayer directory
cd /Users/dreytech/Projects/ghost-bot/vlayer

# Step 2: Create .env file with your credentials
# (Edit this file with your actual vlayer credentials)
nano .env

# Step 3: Install dependencies
pnpm install

# Step 4: Make scripts executable
chmod +x *.sh *.mjs

# Step 5: Verify setup
ls -la .env
ls -la run-quick-test.sh
```

### Running Tests (Every Time)

```bash
# Quick method - just run this command:
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh

# Wait 60-120 seconds for results
```

---

## 🔍 **Verification Commands**

### Check if .env file exists
```bash
test -f /Users/dreytech/Projects/ghost-bot/vlayer/.env && echo "✅ .env exists" || echo "❌ .env missing"
```

### Check if credentials are set
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
if [ -f .env ]; then
  source .env
  if [ -n "$WEB_PROVER_API_CLIENT_ID" ] && [ -n "$WEB_PROVER_API_SECRET" ]; then
    echo "✅ Credentials configured"
  else
    echo "❌ Credentials missing"
  fi
fi
```

### Check if scripts are executable
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
ls -la run-quick-test.sh | grep -q "rwxr-xr-x" && echo "✅ Executable" || echo "❌ Not executable - run chmod +x"
```

### Check if dependencies are installed
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
test -d node_modules && echo "✅ Dependencies installed" || echo "❌ Run pnpm install"
```

### Run all checks at once
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer

echo "📋 Environment Check:"
echo -n "  .env file: "
test -f .env && echo "✅ Exists" || echo "❌ Missing"

echo -n "  Credentials: "
if [ -f .env ]; then
  source .env
  [ -n "$WEB_PROVER_API_CLIENT_ID" ] && [ -n "$WEB_PROVER_API_SECRET" ] && echo "✅ Set" || echo "❌ Not set"
else
  echo "❌ No .env"
fi

echo -n "  Dependencies: "
test -d node_modules && echo "✅ Installed" || echo "❌ Missing"

echo -n "  Scripts executable: "
[ -x run-quick-test.sh ] && echo "✅ Yes" || echo "❌ No"
```

---

## 🛠️ **Troubleshooting**

### Error: "Permission denied"

```bash
# Problem: Script is not executable
# Solution: Make it executable
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh

# Verify
ls -la /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
# Should show: -rwxr-xr-x
```

### Error: "WEB_PROVER_API_CLIENT_ID: Missing"

```bash
# Problem: Environment variables not set
# Solution: Create/edit .env file
cd /Users/dreytech/Projects/ghost-bot/vlayer
nano .env

# Add these lines:
WEB_PROVER_API_CLIENT_ID=your_client_id
WEB_PROVER_API_SECRET=your_api_secret

# Save and exit (Ctrl+X, Y, Enter)

# Verify
cat .env | grep WEB_PROVER_API
```

### Error: "No such file or directory: ./run-quick-test.sh"

```bash
# Problem: Wrong directory or using relative path
# Solution: Use absolute path
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh

# Or navigate to directory first
cd /Users/dreytech/Projects/ghost-bot/vlayer
./run-quick-test.sh
```

### Error: TypeScript config error (vlayer/vlayer/tsconfig.json)

```bash
# Problem: VS Code cache references deleted directory
# Solution: Reload VS Code window

# Press Cmd+Shift+P (macOS)
# Type: "Reload Window"
# Press Enter

# OR restart TypeScript server:
# Press Cmd+Shift+P
# Type: "TypeScript: Restart TS Server"
# Press Enter
```

**Note:** This is only an editor error. Tests run fine regardless.

---

## 📊 **What Each File Does**

### Shell Wrapper Scripts

**`run-quick-test.sh`**
```bash
#!/bin/bash
cd "$(dirname "$0")"           # Go to script directory
if [ -f .env ]; then           # Check if .env exists
  export $(cat .env | grep -v '^#' | xargs)  # Load variables
fi
node test-pr-quick.mjs         # Run test
```

**`run-comprehensive-test.sh`**
```bash
#!/bin/bash
cd "$(dirname "$0")"
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi
node test-comprehensive.mjs
```

### Test Implementation Files

**`test-pr-quick.mjs`**
- Node.js module that runs both PR creation and merge tests
- Imports from `lib/helpers/pr-verifier.js`
- Shows success/failure messages

**`test-comprehensive.mjs`**
- More detailed version with timing and colored output
- Validates environment before running
- Shows comprehensive summary

**`lib/helpers/pr-verifier.js`**
- Core verification functions
- `provePRCreationServer()` - Verifies PR creation
- `provePRMergeServer()` - Verifies PR merge
- Calls vlayer Web Prover API directly

---

## 🎯 **Success Criteria**

Your test is successful when you see:

✅ **Both verifications pass:**
- PR Creation Verified
- PR Merge Verified

✅ **Test data shown:**
- PR title
- Author/Merger name
- Timestamps
- Proof ID

✅ **"Test Complete!" message** at the end

---

## 📝 **Test Data Used**

All tests use: **microsoft/vscode#200000**

**Why this PR?**
- ✅ Publicly accessible (no auth needed)
- ✅ Successfully merged
- ✅ Stable test data (won't change)
- ✅ Created by: `chengluyu`
- ✅ Merged by: `jrieken`
- ✅ Merged on: 2025-06-06

---

## 🔗 **Quick Links**

- **Detailed Testing Guide:** `TESTING-GUIDE.md`
- **Project Status:** `PROJECT-STATUS.md`
- **Architecture Overview:** `CLEAN-ARCHITECTURE.md`
- **vlayer Docs:** https://docs.vlayer.xyz/

---

## 📞 **Support Checklist**

Before asking for help, verify:

- [ ] `.env` file exists in `/Users/dreytech/Projects/ghost-bot/vlayer/`
- [ ] `.env` contains `WEB_PROVER_API_CLIENT_ID` and `WEB_PROVER_API_SECRET`
- [ ] Dependencies installed: `node_modules/` directory exists
- [ ] Scripts are executable: `ls -la *.sh` shows `-rwxr-xr-x`
- [ ] Using correct path: `/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh`
- [ ] Internet connection working (needs to reach vlayer API)

---

## 🎉 **Quick Start Summary**

```bash
# 1. Setup (first time only)
cd /Users/dreytech/Projects/ghost-bot/vlayer
nano .env  # Add your credentials
pnpm install
chmod +x *.sh *.mjs

# 2. Run test (every time)
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh

# 3. Wait 60-120 seconds

# 4. Check for success messages:
# ✅ SUCCESS: PR Creation Verified!
# ✅ SUCCESS: PR Merge Verified!
# 🎉 Test Complete!
```

---

**That's it! You're ready to test PR verification with cryptographic proofs.** 🚀
