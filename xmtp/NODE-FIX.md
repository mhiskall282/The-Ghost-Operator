# 🔧 Node.js Version Fix - SOLUTION

## Problem
XMTP SDK v1.1.15 has compatibility issues with Node.js v22+. You need Node.js v20 LTS.

## ✅ SOLUTION (Steps to Run Your Agent)

### Step 1: Switch to Node v20

```bash
nvm use 20
```

If you don't have v20 installed:
```bash
nvm install 20
nvm use 20
```

### Step 2: Reinstall Dependencies

```bash
cd /Users/dreytech/Projects/ghost-bot/xmtp
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Run Your Agent

```bash
npm run dev
```

## 🎯 Complete One-Liner

```bash
nvm use 20 && cd /Users/dreytech/Projects/ghost-bot/xmtp && npm run dev
```

## ⚙️ Make Node v20 Default (Optional)

To avoid switching every time:

```bash
nvm alias default 20
```

## 📱 Using XMTP.chat (What You Saw in Screenshots)

### Step 1: Connect Wallet
You already did this! Your MetaMask is connected at address:
`0x525d...4ee6`

### Step 2: Select Network
Choose **"dev"** network (as shown in your screenshot)

### Step 3: Connect to XMTP
Click the blue **"Connect"** button (it's loading in your screenshot)

### Step 4: Chat with Your Agent
Once connected, you can:
1. Enter your agent's address: `0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798`
2. Or visit the direct link: https://xmtp.chat/dm/0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798
3. Start sending messages!

## 🧪 Test Commands

Once your agent is running and you're chatting:

```
help          - Show available commands
jobs          - List bounties
claim bounty-001  - Claim a bounty
submit 0xabc...   - Submit a proof
status        - Check your stats
```

## 🌐 Network Options (From XMTP.chat)

As you saw, there are 3 options:

| Network | URL | Use For |
|---------|-----|---------|
| **dev** | dev network | ✅ Testing (recommended) |
| **local** | localhost:5555 | Local development |
| **production** | production network | Real users |

**Use "dev" for testing** - that's what your agent is configured for!

## 🚨 Troubleshooting

### If you see the module error again:
```bash
# Make sure you're using Node v20
node --version
# Should show v20.x.x

# If not:
nvm use 20
```

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### If agent won't start:
```bash
# Check you're in the right directory
pwd
# Should be: /Users/dreytech/Projects/ghost-bot/xmtp

# Check .env exists
ls -la .env
```

## ✅ Expected Output When Agent Starts

```
🚀 Starting GhostBot Agent...

✅ GhostBot Agent is online!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👻 GhostBounties Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Address: 0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798
🌐 Environment: dev
🔗 Test URL: https://xmtp.chat/dm/0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 Waiting for messages...
```

## 📝 Quick Reference

```bash
# Always use Node v20
nvm use 20

# Run agent
cd /Users/dreytech/Projects/ghost-bot/xmtp
npm run dev

# In another terminal, or on xmtp.chat:
# Chat with: 0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798
```

---

**Your agent address:** `0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798`

**Direct chat link:** https://xmtp.chat/dm/0x2Ea01Ea19E4Cf7B445aB1f8803463A13b5bd8798
