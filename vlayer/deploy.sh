#!/bin/bash

# Ghost Bounties Deployment Script
# This script deploys all contracts for the Ghost Bounties system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Ghost Bounties Deployment Script    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Please edit .env with your configuration and run again.${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check if private key is set
if [ "$PRIVATE_KEY" == "your_private_key_here" ] || [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}❌ Please set PRIVATE_KEY in .env file${NC}"
    exit 1
fi

# Create deployments directory if it doesn't exist
mkdir -p deployments

# Function to deploy to a network
deploy_to_network() {
    local network=$1
    local rpc_url=$2
    
    echo -e "\n${GREEN}📡 Deploying to $network...${NC}"
    echo "RPC URL: $rpc_url"
    
    # Run forge script
    forge script script/DeployGhostBounties.s.sol:DeployGhostBounties \
        --rpc-url "$rpc_url" \
        --broadcast \
        --verify \
        -vvvv
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment to $network successful!${NC}"
        
        # Copy deployment file with network name
        if [ -f deployments/latest.json ]; then
            cp deployments/latest.json "deployments/${network}.json"
            echo -e "${GREEN}📄 Deployment addresses saved to deployments/${network}.json${NC}"
        fi
    else
        echo -e "${RED}❌ Deployment to $network failed!${NC}"
        exit 1
    fi
}

# Parse command line arguments
case "$1" in
    polygon)
        deploy_to_network "polygon" "$POLYGON_RPC_URL"
        ;;
    mumbai)
        deploy_to_network "mumbai" "$POLYGON_MUMBAI_RPC_URL"
        ;;
    sepolia)
        deploy_to_network "sepolia" "$SEPOLIA_RPC_URL"
        ;;
    localhost)
        echo -e "${GREEN}🏠 Deploying to localhost (Anvil)...${NC}"
        echo -e "${YELLOW}⚠️  Make sure Anvil is running on http://localhost:8545${NC}"
        deploy_to_network "localhost" "http://localhost:8545"
        ;;
    devnet)
        echo -e "${GREEN}🧪 Deploying to vlayer devnet...${NC}"
        deploy_to_network "devnet" "$VLAYER_RPC_URL"
        ;;
    *)
        echo -e "${YELLOW}Usage: ./deploy.sh [network]${NC}"
        echo ""
        echo "Available networks:"
        echo "  polygon   - Polygon mainnet"
        echo "  mumbai    - Polygon Mumbai testnet"
        echo "  sepolia   - Ethereum Sepolia testnet"
        echo "  localhost - Local Anvil node"
        echo "  devnet    - vlayer devnet"
        echo ""
        echo "Example: ./deploy.sh mumbai"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Deployment Complete! 🎉            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
