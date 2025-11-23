# 🚨 Database Corruption Fix

## What Happened?

When you force-killed the agent with `Ctrl+C` (especially the `Force killing...` message), the XMTP database got corrupted.

## ✅ **SOLUTION** (30 seconds)

### Quick Fix:

```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
rm -f *.db3*
npm run dev
```

### OR Use the Helper Script:

```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
./fix-and-run.sh
```

## 🔄 **What the Fix Does**

1. Deletes corrupted database files (`*.db3*`)
2. XMTP creates a fresh database on next start
3. Agent runs normally

## ⚠️ **Important: How to Stop the Agent Properly**

**❌ DON'T DO THIS:**
```bash
^C  # Press Ctrl+C twice quickly
# This causes: "Force killing..." and corrupts the database
```

**✅ DO THIS INSTEAD:**
```bash
# Press Ctrl+C ONCE and wait
^C  
# Wait for: "👋 Shutting down GhostBot Agent..."
# Agent shuts down cleanly
```

## 🗃️ **About the Database**

- **File**: `xmtp-dev-[long-hash].db3`
- **Purpose**: Stores your agent's identity and message history
- **Location**: `/Users/dreytech/Projects/ghost-bot/xmtp/`
- **Safe to delete**: Yes! XMTP recreates it automatically

## 🔍 **Troubleshooting**

### If you still see the error:

```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp

# Remove all database files
rm -f *.db3*
rm -rf xmtp_db/*.db3*

# Clear any lock files
rm -f *.db3-shm
rm -f *.db3-wal

# Restart
npm run dev
```

### If it works once then breaks again:

**Remember**: Press Ctrl+C **ONCE** and **WAIT** for the shutdown message.

## 📊 **What You'll See**

### ✅ Successful Start:
```
🚀 Starting GhostBot Agent...

✅ GhostBot Agent is online!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GhostBounties Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: 0x2ea01ea19e4cf7b445ab1f8803463a13b5bd8798
🌐 Environment: dev
🔗 Test URL: http://xmtp.chat/dev/dm/0x...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 Waiting for messages...
```

### ❌ Database Error (What You Saw):
```
❌ Failed to start agent: [Error: Error creating native database 
file is not a database] {
  code: 'GenericFailure'
}
```

**Fix**: Delete database files and restart

## 💡 **Pro Tips**

1. **Development**: Delete database between restarts if testing
   ```bash
   rm -f *.db3* && npm run dev
   ```

2. **Production**: Use persistent volumes (Docker/PM2)
   - Database files are preserved
   - Agent maintains identity

3. **Backup**: Save your `.env` file
   - Contains your wallet private key
   - Database can be recreated, but keys cannot

## 🎯 **Quick Reference**

| Issue | Solution |
|-------|----------|
| Database corrupted | `rm -f *.db3* && npm run dev` |
| Agent won't start | Delete database files |
| Force killed agent | Delete database, restart |
| Want fresh start | Delete database files |

---

**TL;DR**: Your database got corrupted when force-killing. Run:

```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
rm -f *.db3*
npm run dev
```

Then press Ctrl+C **ONCE** (not twice) when stopping! ✅
