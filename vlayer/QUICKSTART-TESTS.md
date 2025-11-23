# Quick Start - Running Tests

## 🚀 Quick Commands

### Make Scripts Executable (Run Once)

```bash
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-quick.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-pr-verification.mjs
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/test-comprehensive.mjs
```

Or all at once:
```bash
cd /Users/dreytech/Projects/ghost-bot/vlayer
chmod +x *.sh *.mjs
```

### Run Quick Test

```bash
/Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

**Expected output:**
```
✅ SUCCESS: PR Creation Verified!
✅ SUCCESS: PR Merge Verified!
```

**Duration:** 60-120 seconds

### Run Comprehensive Test

```bash
/Users/dreytech/Projects/ghost-bot/vlayer/run-comprehensive-test.sh
```

**Duration:** 60-120 seconds

---

## 📋 What Each Test Does

### Quick Test (`run-quick-test.sh`)
- ✅ Loads `.env` environment variables
- ✅ Tests PR creation verification
- ✅ Tests PR merge verification
- ✅ Uses microsoft/vscode#200000

### Comprehensive Test (`run-comprehensive-test.sh`)
- ✅ Validates environment variables
- ✅ Shows detailed test output
- ✅ Provides timing information
- ✅ Better error messages

---

## ⚙️ Prerequisites

1. **Environment file exists:**
   ```bash
   ls -la /Users/dreytech/Projects/ghost-bot/vlayer/.env
   ```

2. **Credentials set:**
   ```bash
   cd /Users/dreytech/Projects/ghost-bot/vlayer
   grep -E "WEB_PROVER_API" .env
   ```

3. **Dependencies installed:**
   ```bash
   cd /Users/dreytech/Projects/ghost-bot/vlayer
   pnpm install
   ```

---

## 🔧 Troubleshooting

### Permission Denied
```bash
# Make executable
chmod +x /Users/dreytech/Projects/ghost-bot/vlayer/run-quick-test.sh
```

### Missing .env
```bash
# Check if exists
ls -la /Users/dreytech/Projects/ghost-bot/vlayer/.env

# Create from example
cp /Users/dreytech/Projects/ghost-bot/vlayer/.env.example /Users/dreytech/Projects/ghost-bot/vlayer/.env
# Then edit .env with your credentials
```

### Missing Environment Variables
```bash
# Check credentials
cd /Users/dreytech/Projects/ghost-bot/vlayer
cat .env | grep WEB_PROVER_API
```

---

## 📊 Test Status

**Current Status:** ✅ Working

**Last Test Result:**
```
✅ PR Creation Verified: microsoft/vscode#200000
   Author: chengluyu
   Title: Apply `font-variation-settings` to the suggestion widget (fix #199954)

✅ PR Merge Verified: microsoft/vscode#200000
   Merged by: jrieken
   Merged at: 2025-06-06T06:51:31Z
```

---

## 📖 More Details

See **TESTING-GUIDE.md** for comprehensive documentation.
