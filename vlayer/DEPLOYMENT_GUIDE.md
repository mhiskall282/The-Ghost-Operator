# GhostBounties Deployment Guide

This guide will help you deploy all contracts easily, either to Anvil (local testing) or Polygon testnet.

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

#### For Windows (PowerShell):
```powershell
cd vlayer
# 1. Copy and configure .env
Copy-Item .env.example .env
# Edit .env with your private key

# 2. Run deployment script
.\deploy.ps1
```

#### For Linux/Mac (Bash):
```bash
cd vlayer
# 1. Copy and configure .env
cp .env.example .env
# Edit .env with your private key

# 2. Make script executable
chmod +x deploy.sh

# 3. Run deployment script
./deploy.sh
```

### Option 2: Manual Deployment

```bash
cd vlayer

# 1. Set environment variables
export PRIVATE_KEY=your_private_key_here
export RPC_URL=https://rpc.ankr.com/polygon_mumbai  # or http://127.0.0.1:8545 for Anvil
export USE_MOCK_TOKEN=true  # true for testing, false for production

# 2. Build contracts
forge build

# 3. Deploy all contracts
forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url $RPC_URL \
    --broadcast \
    -vvv
```

## 📋 Step-by-Step Instructions

### Step 1: Set Up Environment

1. **Copy the environment template:**
   ```bash
   cd vlayer
   cp .env.example .env
   ```

2. **Edit `.env` file with your values:**
   ```env
   PRIVATE_KEY=your_private_key_without_0x_prefix
   RPC_URL=http://127.0.0.1:8545  # For Anvil
   # OR
   RPC_URL=https://rpc.ankr.com/polygon_mumbai  # For Polygon Testnet
   
   USE_MOCK_TOKEN=true  # Use mock token for testing
   CHAIN_ID=31337  # 31337 for Anvil, 80001 for Polygon Testnet
   ```

### Step 2: Choose Your Deployment Target

#### Option A: Anvil (Local Testing) - EASIEST

1. **Start Anvil in a separate terminal:**
   ```bash
   anvil
   ```
   This will give you:
   - 10 test accounts with 10,000 ETH each
   - RPC at `http://127.0.0.1:8545`
   - Chain ID: 31337

2. **Update `.env`:**
   ```env
   RPC_URL=http://127.0.0.1:8545
   CHAIN_ID=31337
   USE_MOCK_TOKEN=true
   PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  # First Anvil account
   ```

3. **Deploy:**
   ```bash
   # Windows
   .\deploy.ps1
   
   # Linux/Mac
   ./deploy.sh
   ```

#### Option B: Polygon Testnet

1. **Get testnet MATIC:**
   - Visit: https://faucet.polygon.technology/
   - Request testnet tokens

2. **Update `.env`:**
   ```env
   RPC_URL=https://rpc.ankr.com/polygon_mumbai
   CHAIN_ID=80001
   USE_MOCK_TOKEN=true  # Or false to use real USDC
   PRIVATE_KEY=your_private_key
   ```

3. **Deploy:**
   ```bash
   # Windows
   .\deploy.ps1
   
   # Linux/Mac
   ./deploy.sh
   ```

### Step 3: Verify Deployment

After deployment, you'll see output like:

```
==========================================
Deployment Summary
==========================================
Payment Token: 0x5FbDB2315678afecb367f032d93F642f64180aa3
GhostVault: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
GitHubProver: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
GhostBounties: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
==========================================
```

### Step 4: Update Configuration Files

1. **Update `xmtp/.env`:**
   ```env
   CONTRACT_ADDRESS=0x...  # GhostBounties address
   VAULT_ADDRESS=0x...     # GhostVault address
   ```

2. **Update `sqd/.env`:**
   ```env
   CONTRACT_ADDRESS=0x...  # GhostBounties address
   VAULT_ADDRESS=0x...     # GhostVault address
   ```

## 🔧 Troubleshooting

### "Private key not set"
- Make sure `.env` file exists
- Check that `PRIVATE_KEY` is set (without `0x` prefix)

### "RPC connection failed"
- For Anvil: Make sure `anvil` is running
- For Polygon: Check your internet connection and RPC URL

### "Insufficient funds"
- For Anvil: Use one of the provided test accounts
- For Polygon: Get testnet MATIC from faucet

### "Contract verification failed"
- This is optional - you can skip verification for testing
- Remove `--verify` flag from deployment command

## 📝 Contract Addresses

After deployment, addresses are saved to `deployment.addresses`:

```
PAYMENT_TOKEN=0x...
VAULT_ADDRESS=0x...
PROVER_ADDRESS=0x...
CONTRACT_ADDRESS=0x...
```

## 🎯 Testing Your Deployment

1. **Check contract on block explorer:**
   - Anvil: Not available (local)
   - Polygon Testnet: https://mumbai.polygonscan.com/

2. **Interact with contracts:**
   ```bash
   # Create a test bounty
   cast send $CONTRACT_ADDRESS "createBounty(uint8,string,string,uint256,uint256)" \
     0 "ghost-op" "core" 0 5000000 \
     --rpc-url $RPC_URL \
     --private-key $PRIVATE_KEY
   ```

## 🚨 Security Notes

- ⚠️ **Never commit `.env` file** - It contains your private key!
- ⚠️ **Use testnet for testing** - Don't use mainnet private keys
- ⚠️ **Keep private keys secure** - Use environment variables or secure key management

## 📚 Next Steps

After deployment:
1. ✅ Update XMTP agent configuration
2. ✅ Update SQD indexer configuration
3. ✅ Test contract interactions
4. ✅ Deploy to mainnet (when ready)

## 🆘 Need Help?

- Check deployment logs for errors
- Verify all environment variables are set
- Ensure you have enough funds for gas
- Review contract compilation errors

Happy deploying! 🚀

