# 🚀 Quick Start Guide

## Running the Agent (Easy Way)

We've created scripts that handle everything automatically:

### Option 1: Use the Quick Start Script (Recommended)
```bash
./start-agent.sh
```

This script will:
- ✅ Automatically use Node v20
- ✅ Clean any corrupted database files
- ✅ Start the agent

### Option 2: Use npm with auto-cleanup
```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
npm run dev
```

The `predev` hook will automatically:
- ✅ Check Node version (must be v20)
- ✅ Clean database files
- ✅ Start the agent

### Option 3: Manual (if scripts don't work)
```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
nvm use 20
rm -f *.db3*
npm run dev
```

## What's Automatic Now?

1. **Node Version Check**: The script detects if you're using the wrong Node version and switches to v20 automatically.

2. **Database Cleanup**: Before each start, the script removes any corrupted `.db3` files, ensuring a fresh start every time.

3. **Error Prevention**: No more "file is not a database" errors!

## Usage

1. **Start the agent**:
   ```bash
   ./start-agent.sh
   ```

2. **Test the agent**:
   - Visit: http://xmtp.chat/dev/dm/0x2ea01ea19e4cf7b445ab1f8803463a13b5bd8798
   - Send a message like "jobs" or "help"

3. **Stop the agent gracefully**:
   - Press `Ctrl+C` once
   - Wait for "👋 Shutting down GhostBot Agent..."
   - **DO NOT** press Ctrl+C twice (this corrupts the database)

## Commands

Once connected to the agent via XMTP, you can use:

- `help` - Show available commands
- `jobs` or `bounties` - List available bounties
- `claim bounty-001` - Claim a specific bounty
- `submit [proof-id]` - Submit your ZK proof
- `status` - Check your progress

## Website

Visit: https://the-ghost-operator.vercel.app/

## Troubleshooting

### "Missing script: dev" error
You're in the wrong directory. Make sure you're in `/Users/dreytech/Projects/ghost-bot/xmtp`

### Node version error
The script should handle this automatically. If not:
```bash
nvm use 20
```

### Database corruption
The script now handles this automatically by cleaning `.db3` files before each start.

### Still having issues?
```bash
# Nuclear option - clean everything and restart
cd /Users/dreytech/Projects/ghost-bot/xmtp
rm -f *.db3*
nvm use 20
npm install
npm run dev
```

## What Changed?

The message formatting has been improved to display properly in XMTP:
- ❌ No more asterisks (\*\*bold\*\*)
- ❌ No more backticks (\`code\`)
- ✅ Clean, readable text
- ✅ Proper emoji support
- ✅ Website URL included in messages

## Files Created

- `predev.sh` - Pre-flight checks (runs automatically before `npm run dev`)
- `dev.sh` - Wrapper script with full automation
- `start-agent.sh` - Quick start script (recommended)

All three scripts handle Node version switching and database cleanup automatically!
