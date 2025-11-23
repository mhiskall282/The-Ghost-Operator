# Ghost Bounties - Quick Start Guide

## 🚀 Deploy in 5 Minutes

### 1. Setup Environment

```bash
# Navigate to vlayer directory
cd vlayer

# Copy environment template
cp .env.example .env

# Edit .env with your private key (get from MetaMask/wallet)
# For testing, you can use Anvil's default key
nano .env
```

### 2. Build Contracts

```bash
forge build
```

### 3. Deploy

**Option A: Local Testing (Recommended First)**

```bash
# Terminal 1: Start local blockchain
anvil

# Terminal 2: Deploy to local chain
./deploy.sh localhost
```

**Option B: Testnet (Polygon Mumbai)**

```bash
# Get test MATIC from: https://faucet.polygon.technology
./deploy.sh mumbai
```

**Option C: Mainnet (Polygon)**

```bash
./deploy.sh polygon
```

### 4. Verify Deployment

```bash
./test-deployment.sh localhost  # or mumbai/polygon
```

## 📋 Contract Addresses

After deployment, find addresses in: `deployments/<network>.json`

```json
{
  "mockUSDC": "0x...",
  "vault": "0x...",
  "prover": "0x...",
  "bounties": "0x..."
}
```

## 🧪 Test the System

### Create a Bounty

```bash
# Load addresses from deployment
BOUNTIES=$(jq -r '.bounties' deployments/localhost.json)
USDC=$(jq -r '.mockUSDC' deployments/localhost.json)

# Mint some USDC to yourself (testnet only)
cast send $USDC "mint(uint256)" 1000000000 \
    --rpc-url http://localhost:8545 \
    --private-key $PRIVATE_KEY

# Approve bounties contract to spend USDC
cast send $USDC "approve(address,uint256)" $BOUNTIES 1000000000 \
    --rpc-url http://localhost:8545 \
    --private-key $PRIVATE_KEY

# Create a bounty (Star GitHub repo)
# Parameters: action(0=Star), owner, repo, prNumber(0), reward
cast send $BOUNTIES "createBounty(uint8,string,string,uint256,uint256)" \
    0 "ghost-op" "core" 0 5000000 \
    --rpc-url http://localhost:8545 \
    --private-key $PRIVATE_KEY
```

### View Bounty

```bash
# Get bounty details (bountyId = 0 for first bounty)
cast call $BOUNTIES "bounties(uint256)" 0 \
    --rpc-url http://localhost:8545
```

## 🔗 Integration with Other Components

### XMTP Bot

Update `xmtp/src/integrations.ts`:

```typescript
const GHOST_BOUNTIES_ADDRESS = "0x..."; // From deployments/<network>.json
const GHOST_VAULT_ADDRESS = "0x...";
const USDC_ADDRESS = "0x...";

// Add provider
const provider = new ethers.JsonRpcProvider(RPC_URL);
const bountyContract = new ethers.Contract(
    GHOST_BOUNTIES_ADDRESS,
    BOUNTY_ABI,
    provider
);
```

### Fluence Agent

Update Fluence configuration with contract addresses.

### SQD Indexer

Update `sqd/src/processor.ts` with bounty contract address to index events.

## 📊 Monitor Bounties

### Get Active Bounties

```bash
# Get total bounties
cast call $BOUNTIES "nextBountyId()" --rpc-url http://localhost:8545

# Get user's completed count
cast call $BOUNTIES "userBountyCount(address)" <USER_ADDRESS> \
    --rpc-url http://localhost:8545
```

### Check Vault Balance

```bash
VAULT=$(jq -r '.vault' deployments/localhost.json)

# Get total escrowed
cast call $VAULT "totalEscrowed()" --rpc-url http://localhost:8545

# Get bounty escrow
cast call $VAULT "getEscrowedAmount(uint256)" 0 \
    --rpc-url http://localhost:8545
```

## 🛠️ Useful Commands

### Check Balance

```bash
cast balance <ADDRESS> --rpc-url http://localhost:8545
```

### Check USDC Balance

```bash
cast call $USDC "balanceOf(address)" <ADDRESS> \
    --rpc-url http://localhost:8545
```

### Send Transaction

```bash
cast send <CONTRACT> "functionName(args)" <ARGS> \
    --rpc-url <RPC_URL> \
    --private-key $PRIVATE_KEY
```

### Call View Function

```bash
cast call <CONTRACT> "functionName(args)" <ARGS> \
    --rpc-url <RPC_URL>
```

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- **Solution**: Fund your wallet with native tokens (ETH/MATIC)

### "Execution reverted"
- **Solution**: Check function parameters and permissions
- Use `-vvvv` flag for detailed error messages

### "Nonce too low"
- **Solution**: Wait for pending transactions or reset nonce

### Contract not verified
- **Solution**: Manually verify on block explorer:
  ```bash
  forge verify-contract <ADDRESS> <CONTRACT_PATH> \
      --chain-id <CHAIN_ID> \
      --etherscan-api-key $API_KEY
  ```

## 📚 Resources

- **vlayer Docs**: https://book.vlayer.xyz
- **Foundry Book**: https://book.getfoundry.sh
- **Polygon Docs**: https://docs.polygon.technology
- **Cast Reference**: https://book.getfoundry.sh/reference/cast/

## 🎯 Next Steps

1. ✅ Deploy contracts
2. ✅ Test locally with Anvil
3. 🔄 Deploy to testnet
4. 🔄 Integrate with XMTP bot
5. 🔄 Set up Fluence agent
6. 🔄 Configure SQD indexer
7. 🔄 Test end-to-end flow
8. 🔄 Deploy to mainnet

## 🔐 Security Reminders

- ⚠️ Never commit `.env` file
- ⚠️ Never share private keys
- ⚠️ Test on testnet first
- ⚠️ Verify contracts on explorer
- ⚠️ Consider security audit before mainnet
