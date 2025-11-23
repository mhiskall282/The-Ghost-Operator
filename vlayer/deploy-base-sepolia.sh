#!/bin/bash

# Deploy Ghost Bounties contracts to Base Sepolia
# Base Sepolia Chain ID: 84532
# Base Sepolia RPC: https://sepolia.base.org

set -e

echo "🚀 Deploying Ghost Bounties to Base Sepolia..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Create .env with:"
    echo "  PRIVATE_KEY=your_private_key"
    echo "  BASE_SEPOLIA_RPC_URL=https://sepolia.base.org"
    echo "  BASESCAN_API_KEY=your_basescan_api_key (optional for verification)"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo "⚠️  BASE_SEPOLIA_RPC_URL not set, using default: https://sepolia.base.org"
    BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
fi

echo "📦 Building contracts..."
forge build

echo ""
echo "🌐 Deploying to Base Sepolia (Chain ID: 84532)..."
echo "   RPC: $BASE_SEPOLIA_RPC_URL"
echo ""

# Deploy using Foundry script
forge script script/DeployGhostBounties.s.sol:DeployGhostBounties \
    --rpc-url "$BASE_SEPOLIA_RPC_URL" \
    --private-key "$PRIVATE_KEY" \
    --broadcast \
    --verify \
    --etherscan-api-key "$BASESCAN_API_KEY" \
    -vvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Contract addresses saved to broadcast/ directory"
echo "   View at: broadcast/DeployGhostBounties.s.sol/84532/run-latest.json"
echo ""
echo "🔍 Verify contracts on BaseScan:"
echo "   https://sepolia.basescan.org/"
echo ""
