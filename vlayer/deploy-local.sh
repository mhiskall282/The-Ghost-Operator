#!/bin/bash

# Quick local deployment for development

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Quick Local Deployment${NC}"
echo ""

# Check if Anvil is running
if ! lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}Starting Anvil...${NC}"
    anvil > /dev/null 2>&1 &
    ANVIL_PID=$!
    sleep 2
    echo -e "${GREEN}✅ Anvil started (PID: $ANVIL_PID)${NC}"
else
    echo -e "${GREEN}✅ Anvil already running${NC}"
fi

# Set default private key (Anvil's first account)
export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Build
echo ""
echo -e "${YELLOW}Building contracts...${NC}"
forge build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Deploy
echo ""
echo -e "${YELLOW}Deploying contracts...${NC}"
forge script script/DeployGhostBounties.s.sol:DeployGhostBounties \
    --rpc-url http://localhost:8545 \
    --broadcast \
    -vvv

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    
    # Show addresses
    if [ -f deployments/latest.json ]; then
        echo -e "${YELLOW}📄 Contract Addresses:${NC}"
        cat deployments/latest.json | jq .
    fi
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
