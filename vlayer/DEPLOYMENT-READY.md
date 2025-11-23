# 🚀 Ghost Bounties - Deployment Complete

## What You Have Now

All deployment infrastructure for the Ghost Bounties vlayer contracts is ready!

### 📁 Files Created

1. **`script/DeployGhostBounties.s.sol`** - Main deployment script
2. **`.env.example`** - Environment configuration template
3. **`deploy.sh`** - Multi-network deployment script
4. **`test-deployment.sh`** - Deployment verification script
5. **`setup-and-deploy.sh`** - Interactive setup wizard
6. **`deploy-local.sh`** - Quick local deployment
7. **`DEPLOYMENT.md`** - Comprehensive deployment guide
8. **`QUICKSTART.md`** - Quick reference guide

## 🎯 Three Ways to Deploy

### Option 1: Interactive Setup (Recommended for First Time)
```bash
cd vlayer
./setup-and-deploy.sh
```
This will guide you through:
- Prerequisites check
- Environment setup
- Contract building
- Network selection
- Deployment
- Testing

### Option 2: Quick Local Deploy (Fast Testing)
```bash
cd vlayer
./deploy-local.sh
```
Deploys to local Anvil node with defaults.

### Option 3: Direct Deploy (When Configured)
```bash
cd vlayer

# Setup first time only
cp .env.example .env
nano .env  # Add your PRIVATE_KEY

# Build
forge build

# Deploy to network of choice
./deploy.sh localhost   # Local Anvil
./deploy.sh mumbai      # Polygon Mumbai testnet
./deploy.sh polygon     # Polygon mainnet
./deploy.sh sepolia     # Ethereum Sepolia testnet

# Test
./test-deployment.sh localhost
```

## 📦 What Gets Deployed

The deployment script creates:

1. **MockERC20** (USDC) - Test token for payments
2. **GhostVault** - Escrow contract holding bounty funds
3. **GitHubProver** - ZK-TLS proof generator for GitHub actions
4. **GhostBounties** - Main bounty management contract

All contracts are linked together with proper permissions.

## 🔍 After Deployment

### Check Deployment
```bash
# View addresses
cat deployments/localhost.json  # or mumbai.json, polygon.json, etc.

# Test the deployment
./test-deployment.sh localhost
```

### Contract Addresses Format
```json
{
  "mockUSDC": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "vault": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "prover": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "bounties": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
}
```

## 🔗 Integration Steps

### 1. XMTP Bot Integration

Update `xmtp/src/integrations.ts`:

```typescript
// Load from deployments/polygon.json
const GHOST_BOUNTIES_ADDRESS = "0x...";
const GHOST_VAULT_ADDRESS = "0x...";
const USDC_ADDRESS = "0x...";

// Create contract instance
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
const bountyContract = new ethers.Contract(
  GHOST_BOUNTIES_ADDRESS,
  BOUNTY_ABI,
  provider
);

// Listen for events
bountyContract.on("BountyCreated", (bountyId, creator, reward) => {
  console.log(`New bounty ${bountyId}: ${reward} USDC`);
});
```

### 2. Fluence Agent Integration

Create configuration file with contract addresses:

```rust
// fluence/src/config.rs
pub const BOUNTIES_CONTRACT: &str = "0x...";
pub const VAULT_CONTRACT: &str = "0x...";
pub const PROVER_CONTRACT: &str = "0x...";
```

### 3. SQD Indexer Integration

Update `sqd/src/processor.ts`:

```typescript
const GHOST_BOUNTIES_ADDRESS = "0x...";

processor.addLog({
  address: [GHOST_BOUNTIES_ADDRESS],
  topic0: [
    bountyAbi.events.BountyCreated.topic,
    bountyAbi.events.BountyCompleted.topic,
  ],
});
```

## 🧪 Test the Full Flow

### 1. Create a Test Bounty

```bash
# Load addresses
BOUNTIES=$(jq -r '.bounties' deployments/localhost.json)
USDC=$(jq -r '.mockUSDC' deployments/localhost.json)

# Mint test USDC
cast send $USDC "mint(uint256)" 1000000000 \
  --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY

# Approve bounties contract
cast send $USDC "approve(address,uint256)" $BOUNTIES 1000000000 \
  --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY

# Create bounty (Star repo)
cast send $BOUNTIES "createBounty(uint8,string,string,uint256,uint256)" \
  0 "ghost-op" "core" 0 5000000 \
  --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY
```

### 2. View Bounty

```bash
# Get bounty details (ID = 0)
cast call $BOUNTIES "bounties(uint256)" 0 \
  --rpc-url http://localhost:8545
```

### 3. Complete Bounty (Simplified Test)

```bash
# In production, this would be called with a valid ZK proof
cast send $BOUNTIES "completeBountyWithProof(uint256,bytes)" \
  0 "0x..." \
  --rpc-url http://localhost:8545 \
  --private-key $PRIVATE_KEY
```

## 📊 Monitoring

### View Events

```bash
# Watch for BountyCreated events
cast logs --address $BOUNTIES \
  --from-block 0 \
  "BountyCreated(uint256,address,uint8,string,string,uint256,uint256)" \
  --rpc-url http://localhost:8545
```

### Check Balances

```bash
# Vault USDC balance
cast call $USDC "balanceOf(address)" $VAULT \
  --rpc-url http://localhost:8545

# User USDC balance
cast call $USDC "balanceOf(address)" <USER_ADDRESS> \
  --rpc-url http://localhost:8545
```

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] Never commit private keys
- [ ] Test thoroughly on testnet before mainnet
- [ ] Verify contracts on block explorer
- [ ] Set up monitoring alerts
- [ ] Document contract addresses securely
- [ ] Consider multi-sig for admin functions
- [ ] Get security audit for mainnet

## 🌐 Network Information

### Polygon Mumbai (Testnet)
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology
- **Gas Token**: MATIC

### Polygon (Mainnet)
- **Chain ID**: 137
- **RPC**: https://polygon-rpc.com
- **Explorer**: https://polygonscan.com
- **Gas Token**: MATIC
- **USDC**: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174

### Localhost (Anvil)
- **Chain ID**: 31337
- **RPC**: http://localhost:8545
- **Pre-funded Accounts**: 10 accounts with 10000 ETH each

## 🛠️ Troubleshooting

### Build Errors
```bash
# Clean and rebuild
forge clean
forge build
```

### Deployment Fails
```bash
# Check gas price
cast gas-price --rpc-url <RPC_URL>

# Check balance
cast balance <YOUR_ADDRESS> --rpc-url <RPC_URL>

# Increase verbosity
forge script ... -vvvv
```

### Verification Fails
```bash
# Manual verification
forge verify-contract <ADDRESS> \
  src/ghostbounties/GhostBounties.sol:GhostBounties \
  --chain-id 137 \
  --etherscan-api-key $POLYGONSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address,address,address)" <PROVER> <VAULT> <OWNER>)
```

## 📚 Additional Resources

- **vlayer Documentation**: https://book.vlayer.xyz
- **Foundry Book**: https://book.getfoundry.sh
- **Polygon Docs**: https://docs.polygon.technology
- **ZK-TLS Explainer**: https://blog.vlayer.xyz/zk-tls

## 🎯 Next Steps

Now that contracts are deployed:

1. ✅ **Deploy vlayer contracts** (You are here!)
2. 🔄 **Set up XMTP bot** - Chat interface for users
3. 🔄 **Configure Fluence agent** - Autonomous verification logic
4. 🔄 **Deploy SQD indexer** - Reputation and history tracking
5. 🔄 **Test end-to-end** - Full bounty lifecycle
6. 🔄 **Launch to users** - Start with test bounties

## 💡 Pro Tips

- **Always test locally first** with `./deploy-local.sh`
- **Use Mumbai testnet** before mainnet deployment
- **Keep deployment logs** for reference
- **Monitor gas prices** before mainnet deployment
- **Set up monitoring** from day one
- **Have emergency procedures** ready

---

**Ready to deploy?** Run `./setup-and-deploy.sh` to get started! 🚀
