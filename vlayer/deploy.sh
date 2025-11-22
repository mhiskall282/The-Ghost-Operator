#!/bin/bash

# GhostBounties Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "=========================================="
echo "GhostBounties Deployment Script"
echo "=========================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please copy env.template to .env and fill in your values"
    exit 1
fi

# Load environment variables (handle Windows line endings)
export $(grep -v '^#' .env | grep -v '^$' | tr -d '\r' | xargs)

# Check required variables
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not set in .env"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo "Error: RPC_URL not set in .env"
    exit 1
fi

echo ""
echo "Configuration:"
echo "   RPC URL: $RPC_URL"
echo "   Chain ID: ${CHAIN_ID:-31337}"
echo "   Use Mock Token: ${USE_MOCK_TOKEN:-true}"
echo ""

# Check if we're deploying to Anvil
if [[ "$RPC_URL" == *"127.0.0.1:8545"* ]] || [[ "$RPC_URL" == *"localhost:8545"* ]]; then
    echo "Detected Anvil (local) deployment"
    echo "   Make sure Anvil is running: anvil"
    echo ""
    read -p "Press Enter to continue or Ctrl+C to cancel..."
fi

# Build contracts first
echo "Building contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Build successful!"
echo ""

# Deploy contracts
echo "Deploying contracts..."
echo ""

forge script script/DeployAll.s.sol:DeployAll \
    --rpc-url "$RPC_URL" \
    --broadcast \
    -vvv

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "Deployment Successful!"
    echo "=========================================="
    echo ""
    echo "Contract addresses saved to: deployment.addresses"
    echo ""
    if [ -f deployment.addresses ]; then
        cat deployment.addresses
    fi
    echo ""
    echo "Next steps:"
    echo "   1. Update your .env files with the contract addresses"
    echo "   2. Update xmtp/.env with CONTRACT_ADDRESS and VAULT_ADDRESS"
    echo "   3. Update sqd/.env with CONTRACT_ADDRESS and VAULT_ADDRESS"
    echo ""
else
    echo ""
    echo "Deployment failed!"
    exit 1
fi
