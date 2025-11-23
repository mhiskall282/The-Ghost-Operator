# Base Sepolia Deployment Summary

## ✅ Deployment Successful!

All GhostBounties smart contracts have been successfully deployed to Base Sepolia testnet.

### 📋 Contract Addresses

| Contract | Address | BaseScan |
|----------|---------|----------|
| MockERC20 (Payment Token) | 0xF996C610619C0376840d4634af8477e9CBFF1AE2 | [View](https://sepolia.basescan.org/address/0xF996C610619C0376840d4634af8477e9CBFF1AE2) |
| GhostVault | 0xBF57262ef4980a68A13988024BdD22b0231d7a82 | [View](https://sepolia.basescan.org/address/0xBF57262ef4980a68A13988024BdD22b0231d7a82) |
| GitHubProver | 0xFf33CA1f4014F4F6964867E245C41850Ef67785C | [View](https://sepolia.basescan.org/address/0xFf33CA1f4014F4F6964867E245C41850Ef67785C) |
| GhostBounties (Main Contract) | 0x97A8037d47E7f338C42ECaC40F3Fd0C6eEbD26d7 | [View](https://sepolia.basescan.org/address/0x97A8037d47E7f338C42ECaC40F3Fd0C6eEbD26d7) |

### 🔑 Deployment Details

- Network: Base Sepolia (Chain ID: 84532)
- Deployer: 0x21C275Ff0DB6100cE7c99D2E96F4179943E21937
- RPC URL: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org

### 📦 What Was Deployed

1. MockERC20 Token (`0xF996C610619C0376840d4634af8477e9CBFF1AE2`)
   - Name: Mock USDC
   - Symbol: USDC
   - Decimals: 6
   - Initial Supply: 1,000,000 USDC minted to deployer

2. GhostVault (`0xBF57262ef4980a68A13988024BdD22b0231d7a82`)
   - Escrow contract for holding bounty funds
   - Owned by deployer
   - Uses MockERC20 as payment token

3. GitHubProver (`0xFf33CA1f4014F4F6964867E245C41850Ef67785C`)
   - ZK proof verifier for GitHub actions
   - Verifies stars, forks, PRs, issues, etc.

4. GhostBounties (`0x97A8037d47E7f338C42ECaC40F3Fd0C6eEbD26d7`)
   - Main bounty management contract
   - Links GitHubProver and GhostVault
   - Owned by deployer

### 🔗 Integration

Update your environment variables:


# Base Sepolia
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BOUNTY_CONTRACT_ADDRESS=0x97A8037d47E7f338C42ECaC40F3Fd0C6eEbD26d7
VAULT_ADDRESS=0xBF57262ef4980a68A13988024BdD22b0231d7a82
PROVER_ADDRESS=0xFf33CA1f4014F4F6964867E245C41850Ef67785C
PAYMENT_TOKEN=0xF996C610619C0376840d4634af8477e9CBFF1AE2


### 🧪 Testing

You can now:
1. Fund the vault with MockERC20 tokens
2. Create bounties via the GhostBounties contract
3. Submit ZK proofs via GitHubProver
4. Release payments from the vault

### 📝 Next Steps

1. Verify Contracts (optional):
   
   forge verify-contract \
     --chain-id 84532 \
     --num-of-optimizations 200 \
     --watch \
     --constructor-args $(cast abi-encode "constructor(address,address)" $PROVER_ADDRESS $VAULT_ADDRESS) \
     --etherscan-api-key $BASESCAN_API_KEY \
     --compiler-version v0.8.30 \
     0x97A8037d47E7f338C42ECaC40F3Fd0C6eEbD26d7 \
     src/ghostbounties/GhostBounties.sol:GhostBounties
   

2. Update XMTP Bot:
   - Set BOUNTY_CONTRACT_ADDRESS in xmtp/.env
   - Set POLYGON_RPC_URL to Base Sepolia RPC

3. Test the Contracts:
   - Create a test bounty
   - Submit a proof
   - Verify payment flow

---

Deployment completed successfully! 🎉
