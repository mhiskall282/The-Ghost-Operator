# Ghost Bounties Deployment Guide

This guide walks you through deploying the Ghost Bounties contracts to various networks.

## Prerequisites

1. **Install Foundry** (if not already installed):
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Install vlayer** (if not already installed):
   ```bash
   curl -SL https://install.vlayer.xyz | bash
   vlayerup
   ```

3. **Get a wallet with funds**:
   - For testnet: Get test tokens from faucets
   - For mainnet: Ensure you have sufficient native tokens (MATIC for Polygon, ETH for Ethereum)

## Configuration

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your configuration:
   ```bash
   # Required
   PRIVATE_KEY=your_private_key_here_without_0x_prefix
   
   # RPC URLs (update if needed)
   POLYGON_RPC_URL=https://polygon-rpc.com
   POLYGON_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   
   # For contract verification (optional)
   POLYGONSCAN_API_KEY=your_api_key_here
   ```

   ⚠️ **Security Note**: Never commit your `.env` file or share your private key!

## Build Contracts

Before deploying, compile the contracts:

```bash
forge build
```

## Deployment Options

### Option 1: Quick Deployment (Recommended)

Use the deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Deploy to Polygon Mumbai testnet
./deploy.sh mumbai

# Deploy to Polygon mainnet
./deploy.sh polygon

# Deploy to local Anvil node
./deploy.sh localhost

# Deploy to vlayer devnet
./deploy.sh devnet
```

### Option 2: Manual Deployment

Deploy using forge directly:

```bash
# Deploy to Mumbai testnet
forge script script/DeployGhostBounties.s.sol:DeployGhostBounties \
    --rpc-url $POLYGON_MUMBAI_RPC_URL \
    --broadcast \
    --verify \
    -vvvv

# Deploy to Polygon mainnet
forge script script/DeployGhostBounties.s.sol:DeployGhostBounties \
    --rpc-url $POLYGON_RPC_URL \
    --broadcast \
    --verify \
    -vvvv
```

## Local Testing

### 1. Start a Local Node

Start Anvil (local Ethereum node):

```bash
anvil
```

This will start a local node at `http://localhost:8545` with pre-funded accounts.

### 2. Deploy to Local Node

In a new terminal:

```bash
# Use one of Anvil's pre-funded private keys
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Deploy
./deploy.sh localhost
```

### 3. Test the Deployment

```bash
# Create a test bounty
cast send <BOUNTIES_ADDRESS> "createBounty(uint8,string,string,uint256,uint256)" 0 "ghost-op" "core" 0 5000000 \
    --rpc-url http://localhost:8545 \
    --private-key $PRIVATE_KEY
```

## Post-Deployment

After successful deployment, you'll find:

1. **Deployment addresses** in `deployments/<network>.json`:
   ```json
   {
     "mockUSDC": "0x...",
     "vault": "0x...",
     "prover": "0x...",
     "bounties": "0x..."
   }
   ```

2. **Transaction details** in the terminal output

3. **Verified contracts** on the block explorer (if verification was enabled)

## Contract Addresses

### Deployed Contracts

After deployment, note these addresses for integration:

- **GhostBounties** (main contract): `<bounties_address>`
- **GhostVault** (escrow): `<vault_address>`
- **GitHubProver** (proof generator): `<prover_address>`
- **Mock USDC** (testnet only): `<mockUSDC_address>`

### Production Tokens

For mainnet deployments, use actual token addresses:

- **Polygon USDC**: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
- **Polygon USDT**: `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`

## Integration with XMTP

Update your XMTP bot configuration with the deployed contract addresses:

```typescript
// xmtp/src/integrations.ts
const GHOST_BOUNTIES_ADDRESS = "0x..."; // From deployments/<network>.json
const GHOST_PROVER_ADDRESS = "0x...";
```

## Integration with Fluence

Update your Fluence agent configuration:

```rust
// fluence/src/config.rs
const BOUNTIES_CONTRACT: &str = "0x...";
const VAULT_CONTRACT: &str = "0x...";
```

## Troubleshooting

### Deployment Fails

1. **Insufficient funds**: Ensure your wallet has enough native tokens for gas
2. **RPC issues**: Try a different RPC endpoint
3. **Nonce issues**: Reset your account nonce or wait for pending transactions

### Verification Fails

1. **Get API key**: Obtain from [PolygonScan](https://polygonscan.com/apis)
2. **Re-verify manually**:
   ```bash
   forge verify-contract <CONTRACT_ADDRESS> src/ghostbounties/GhostBounties.sol:GhostBounties \
       --chain-id 137 \
       --etherscan-api-key $POLYGONSCAN_API_KEY
   ```

### Contract Interaction Issues

1. **Check deployment**: Verify contracts on block explorer
2. **Test with cast**: Use Foundry's cast tool to test function calls
3. **Check logs**: Review deployment logs for any errors

## Next Steps

1. ✅ Deploy contracts
2. ✅ Verify on block explorer
3. 🔄 Update XMTP bot with contract addresses
4. 🔄 Update Fluence agent configuration
5. 🔄 Test end-to-end bounty flow
6. 🔄 Set up monitoring and alerts

## Network Information

### Polygon Mumbai (Testnet)
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Polygon (Mainnet)
- **Chain ID**: 137
- **RPC**: https://polygon-rpc.com
- **Explorer**: https://polygonscan.com

## Security Considerations

1. **Private Keys**: Never commit or share private keys
2. **Testnet First**: Always test on testnet before mainnet
3. **Audit**: Consider a security audit for production
4. **Access Control**: Verify ownership and permissions after deployment
5. **Upgradability**: Current contracts are not upgradeable

## Support

- **vlayer Docs**: https://book.vlayer.xyz
- **Foundry Docs**: https://book.getfoundry.sh
- **Polygon Docs**: https://docs.polygon.technology
