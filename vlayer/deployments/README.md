# Deployment Addresses

This directory contains deployment addresses for different networks.

## Files

- `latest.json` - Most recent deployment (auto-generated)
- `localhost.json` - Local Anvil deployment
- `mumbai.json` - Polygon Mumbai testnet
- `polygon.json` - Polygon mainnet
- `sepolia.json` - Ethereum Sepolia testnet

## Format

Each file contains:
```json
{
  "mockUSDC": "0x...",
  "vault": "0x...",
  "prover": "0x...",
  "bounties": "0x..."
}
```

## Usage

Load addresses in your code:

**JavaScript/TypeScript:**
```javascript
const addresses = require('./deployments/polygon.json');
const BOUNTIES_ADDRESS = addresses.bounties;
```

**Bash:**
```bash
BOUNTIES=$(jq -r '.bounties' deployments/polygon.json)
```

**Rust:**
```rust
use serde_json::Value;
let data = std::fs::read_to_string("deployments/polygon.json")?;
let addresses: Value = serde_json::from_str(&data)?;
```

## Security

⚠️ These files contain public contract addresses and can be committed to git.
