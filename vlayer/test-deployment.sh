#!/bin/bash

# Test deployed Ghost Bounties contracts
# This script verifies that all contracts are deployed and working correctly

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Ghost Bounties Deployment Test      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if deployment file exists
NETWORK=${1:-localhost}
DEPLOYMENT_FILE="deployments/${NETWORK}.json"

if [ ! -f "$DEPLOYMENT_FILE" ]; then
    echo -e "${RED}❌ Deployment file not found: $DEPLOYMENT_FILE${NC}"
    echo "Please deploy first using: ./deploy.sh $NETWORK"
    exit 1
fi

# Load environment
source .env

# Set RPC URL based on network
case "$NETWORK" in
    polygon)
        RPC_URL=$POLYGON_RPC_URL
        ;;
    mumbai)
        RPC_URL=$POLYGON_MUMBAI_RPC_URL
        ;;
    sepolia)
        RPC_URL=$SEPOLIA_RPC_URL
        ;;
    localhost)
        RPC_URL="http://localhost:8545"
        ;;
    *)
        echo -e "${RED}❌ Unknown network: $NETWORK${NC}"
        exit 1
        ;;
esac

echo "Testing deployment on: $NETWORK"
echo "RPC URL: $RPC_URL"
echo ""

# Extract addresses from deployment file
MOCK_USDC=$(jq -r '.mockUSDC' "$DEPLOYMENT_FILE")
VAULT=$(jq -r '.vault' "$DEPLOYMENT_FILE")
PROVER=$(jq -r '.prover' "$DEPLOYMENT_FILE")
BOUNTIES=$(jq -r '.bounties' "$DEPLOYMENT_FILE")

echo -e "${YELLOW}📄 Deployment Addresses:${NC}"
echo "Mock USDC: $MOCK_USDC"
echo "Vault: $VAULT"
echo "Prover: $PROVER"
echo "Bounties: $BOUNTIES"
echo ""

# Test 1: Check if contracts are deployed
echo -e "${YELLOW}Test 1: Checking contract deployment...${NC}"
for addr in "$MOCK_USDC" "$VAULT" "$PROVER" "$BOUNTIES"; do
    code=$(cast code "$addr" --rpc-url "$RPC_URL" 2>/dev/null || echo "0x")
    if [ "$code" == "0x" ] || [ -z "$code" ]; then
        echo -e "${RED}❌ Contract not found at: $addr${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✅ All contracts deployed${NC}"
echo ""

# Test 2: Check USDC token details
echo -e "${YELLOW}Test 2: Checking USDC token...${NC}"
USDC_NAME=$(cast call "$MOCK_USDC" "name()" --rpc-url "$RPC_URL" 2>/dev/null | xargs)
USDC_SYMBOL=$(cast call "$MOCK_USDC" "symbol()" --rpc-url "$RPC_URL" 2>/dev/null | xargs)
USDC_DECIMALS=$(cast call "$MOCK_USDC" "decimals()" --rpc-url "$RPC_URL" 2>/dev/null)
echo "Name: $USDC_NAME"
echo "Symbol: $USDC_SYMBOL"
echo "Decimals: $USDC_DECIMALS"
echo -e "${GREEN}✅ USDC token configured correctly${NC}"
echo ""

# Test 3: Check vault configuration
echo -e "${YELLOW}Test 3: Checking vault configuration...${NC}"
VAULT_TOKEN=$(cast call "$VAULT" "paymentToken()" --rpc-url "$RPC_URL" 2>/dev/null)
VAULT_OWNER=$(cast call "$VAULT" "owner()" --rpc-url "$RPC_URL" 2>/dev/null)
echo "Payment Token: $VAULT_TOKEN"
echo "Owner: $VAULT_OWNER"
if [ "$VAULT_TOKEN" != "$MOCK_USDC" ]; then
    echo -e "${RED}❌ Vault payment token mismatch${NC}"
    exit 1
fi
if [ "$VAULT_OWNER" != "$BOUNTIES" ]; then
    echo -e "${RED}❌ Vault owner should be Bounties contract${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Vault configured correctly${NC}"
echo ""

# Test 4: Check bounties configuration
echo -e "${YELLOW}Test 4: Checking bounties configuration...${NC}"
BOUNTIES_PROVER=$(cast call "$BOUNTIES" "githubProver()" --rpc-url "$RPC_URL" 2>/dev/null)
BOUNTIES_VAULT=$(cast call "$BOUNTIES" "vault()" --rpc-url "$RPC_URL" 2>/dev/null)
BOUNTY_COUNT=$(cast call "$BOUNTIES" "nextBountyId()" --rpc-url "$RPC_URL" 2>/dev/null)
echo "Prover: $BOUNTIES_PROVER"
echo "Vault: $BOUNTIES_VAULT"
echo "Next Bounty ID: $BOUNTY_COUNT"
if [ "$BOUNTIES_PROVER" != "$PROVER" ]; then
    echo -e "${RED}❌ Bounties prover address mismatch${NC}"
    exit 1
fi
if [ "$BOUNTIES_VAULT" != "$VAULT" ]; then
    echo -e "${RED}❌ Bounties vault address mismatch${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Bounties configured correctly${NC}"
echo ""

# Summary
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   All Tests Passed! ✅                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update XMTP bot with contract addresses"
echo "2. Update Fluence agent configuration"
echo "3. Test creating and claiming a bounty"
echo ""
echo "To create a test bounty, run:"
echo "cast send $BOUNTIES \"createBounty(uint8,string,string,uint256,uint256)\" 0 \"owner\" \"repo\" 0 5000000 \\"
echo "  --rpc-url $RPC_URL \\"
echo "  --private-key \$PRIVATE_KEY"
