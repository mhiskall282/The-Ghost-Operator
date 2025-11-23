# Ghost Bounties - vlayer Contracts

Smart contracts for the Ghost Bounties autonomous agent system using vlayer's ZK-TLS technology.

## 🚀 Quick Start

Deploy contracts in 5 minutes:

```bash
# Interactive setup (recommended)
./setup-and-deploy.sh

# Or quick local deployment
./deploy-local.sh

# Or manual deployment
cp .env.example .env
# Edit .env with your PRIVATE_KEY
forge build
./deploy.sh localhost
```

📖 **Full Guide**: See [DEPLOYMENT-READY.md](./DEPLOYMENT-READY.md)

## 📁 Project Structure

```
vlayer/
├── src/
│   └── ghostbounties/
│       ├── GhostBounties.sol     # Main bounty management
│       ├── GhostVault.sol        # Escrow for payments
│       ├── GitHubProver.sol      # ZK-TLS proof generation
│       └── MockERC20.sol         # Test token
├── script/
│   └── DeployGhostBounties.s.sol # Deployment script
├── deployments/                   # Contract addresses
├── deploy.sh                      # Multi-network deployment
├── test-deployment.sh            # Deployment verification
└── setup-and-deploy.sh           # Interactive setup
```

## 🎯 What This Does

Ghost Bounties enables **autonomous agents to hire humans** for tasks and pay them instantly after cryptographic verification:

1. **Agent creates bounty** - "Star this repo for 5 USDC"
2. **Human performs task** - Stars the GitHub repo
3. **User proves work** - Generates ZK proof via vlayer
4. **Agent verifies** - Checks proof cryptographically
5. **Instant payment** - Releases USDC from escrow

**No API keys. No trust. Pure cryptographic verification.**

## 🏗️ Architecture

### Contracts

1. **GhostBounties** - Main contract
   - Creates/manages bounties
   - Verifies ZK proofs
   - Triggers payouts

2. **GhostVault** - Escrow
   - Holds USDC/tokens
   - Releases funds on verification
   - Refunds if bounty cancelled

3. **GitHubProver** - Proof Generation
   - Uses vlayer ZK-TLS
   - Proves GitHub actions (star, fork, PR merge, etc.)
   - No API keys needed

4. **MockERC20** - Test Token
   - Simulates USDC for testing
   - Mintable for development

## 🛠️ Development

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Deploy

```shell
# Local (Anvil)
./deploy.sh localhost

# Testnet (Mumbai)
./deploy.sh mumbai

# Mainnet (Polygon)
./deploy.sh polygon
```

### Verify Deployment

```shell
./test-deployment.sh localhost
```

## 📚 Documentation

- **[DEPLOYMENT-READY.md](./DEPLOYMENT-READY.md)** - Complete deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment docs
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

## 🔗 Integration

### XMTP Bot

```typescript
import addresses from './deployments/polygon.json';
const bountyContract = new ethers.Contract(addresses.bounties, ABI, provider);
```

### Fluence Agent

```rust
const BOUNTIES_CONTRACT: &str = "0x..."; // From deployments/polygon.json
```

### SQD Indexer

```typescript
const GHOST_BOUNTIES_ADDRESS = addresses.bounties;
processor.addLog({ address: [GHOST_BOUNTIES_ADDRESS], ...});
```

## 🌐 Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Localhost (Anvil) | 31337 | ✅ Supported |
| Polygon Mumbai | 80001 | ✅ Supported |
| Polygon | 137 | ✅ Supported |
| Ethereum Sepolia | 11155111 | ✅ Supported |

## 🔐 Security

- ✅ Uses vlayer ZK-TLS for proof verification
- ✅ Escrow pattern for safe payments
- ✅ Owner-only admin functions
- ⚠️ Testnet use only until audited
- ⚠️ Never commit `.env` file

## 🧰 Tech Stack

- **vlayer** - ZK-TLS proofs
- **Foundry** - Smart contract framework
- **OpenZeppelin** - Security libraries
- **Polygon** - L2 for low-cost transactions

## 📖 Foundry Commands

### Build
```shell
forge build
```

### Test
```shell
forge test
```

### Format
```shell
forge fmt
```

### Gas Snapshots
```shell
forge snapshot
```

### Anvil (Local Node)
```shell
anvil
```

### Deploy
```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
