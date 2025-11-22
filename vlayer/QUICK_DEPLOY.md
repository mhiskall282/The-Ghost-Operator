# 🚀 Quick Deployment Guide

## Easiest Way: Deploy to Anvil (Local)

### Step 1: Start Anvil (in a new terminal)
```bash
anvil
```
Keep this running! You'll see:
- 10 test accounts with 10,000 ETH each
- RPC: `http://127.0.0.1:8545`

### Step 2: Configure Environment

Create `vlayer/.env` file:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
USE_MOCK_TOKEN=true
CHAIN_ID=31337
```

**Note:** The private key above is the first Anvil test account (safe to use locally).

### Step 3: Deploy (Windows PowerShell)
```powershell
cd vlayer
.\deploy.ps1
```

### Step 3: Deploy (Linux/Mac)
```bash
cd vlayer
chmod +x deploy.sh
./deploy.sh
```

### Step 4: Done! ✅

You'll see output like:
```
✅ Deployment Successful!
PAYMENT_TOKEN=0x5FbDB2315678afecb367f032d93F642f64180aa3
VAULT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
PROVER_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
CONTRACT_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

Copy these addresses to your `xmtp/.env` and `sqd/.env` files!

---

## Deploy to Polygon Testnet

### Step 1: Get Testnet MATIC
Visit: https://faucet.polygon.technology/

### Step 2: Configure `.env`
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://rpc.ankr.com/polygon_mumbai
USE_MOCK_TOKEN=true
CHAIN_ID=80001
```

### Step 3: Deploy
```powershell
# Windows
.\deploy.ps1

# Linux/Mac
./deploy.sh
```

---

## Manual Deployment (If scripts don't work)

```bash
cd vlayer

# Set environment variables
export PRIVATE_KEY=your_key
export RPC_URL=http://127.0.0.1:8545
export USE_MOCK_TOKEN=true

# Build
forge build

# Deploy
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    -vvv
```

---

## Troubleshooting

**"Private key not set"**
- Make sure `.env` file exists in `vlayer/` directory
- Check the file has `PRIVATE_KEY=...` (no spaces around `=`)

**"RPC connection failed"**
- For Anvil: Make sure `anvil` is running in another terminal
- Check the RPC URL is correct

**"Insufficient funds"**
- For Anvil: Use the first account (key shown above)
- For Polygon: Get testnet MATIC from faucet

---

## What Gets Deployed?

1. **MockERC20** - Test token (if `USE_MOCK_TOKEN=true`)
2. **GhostVault** - Holds escrowed funds
3. **GitHubProver** - ZK proof verifier
4. **GhostBounties** - Main contract

All addresses are saved to `deployment.addresses` file!

