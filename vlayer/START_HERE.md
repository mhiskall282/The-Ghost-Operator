# 🎯 START HERE - Deploy GhostBounties Contracts

## ⚡ Super Quick (3 Steps)

### 1. Start Anvil (Local Testing)
Open a new terminal and run:
```bash
anvil
```
**Keep this terminal open!**

### 2. Create `.env` File
In the `vlayer` folder, create `.env` with:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
USE_MOCK_TOKEN=true
CHAIN_ID=31337
```

### 3. Deploy!
**Windows:**
```powershell
cd vlayer
.\deploy.ps1
```

**Linux/Mac:**
```bash
cd vlayer
chmod +x deploy.sh
./deploy.sh
```

## ✅ That's It!

You'll get contract addresses like:
```
CONTRACT_ADDRESS=0x...
VAULT_ADDRESS=0x...
PROVER_ADDRESS=0x...
PAYMENT_TOKEN=0x...
```

Copy these to your `xmtp/.env` and `sqd/.env` files!

---

## 🚀 Alternative: One-Command Deploy

**Windows PowerShell:**
```powershell
cd vlayer
.\deploy-simple.ps1 -PrivateKey "your_private_key" -Network "anvil"
```

---

## 📚 More Options

- **Anvil (Local)**: Easiest, no real tokens needed
- **Polygon Testnet**: Real testnet, need testnet MATIC
- See `DEPLOYMENT_GUIDE.md` for full details

---

## 🆘 Problems?

1. **"Anvil not running"** → Start `anvil` in another terminal
2. **"Private key error"** → Check `.env` file format
3. **"Build failed"** → Run `forge build` first

See `QUICK_DEPLOY.md` for troubleshooting!

