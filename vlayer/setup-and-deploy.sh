#!/bin/bash

# Complete setup and deployment script for Ghost Bounties
# This script will guide you through the entire deployment process

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}"
cat << "EOF"
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║              GHOST BOUNTIES SETUP                     ║
  ║                                                       ║
  ║  Autonomous Agent for Cryptographic Work Validation  ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"
echo ""

# Check forge
if ! command -v forge &> /dev/null; then
    echo -e "${RED}❌ Foundry not found. Installing...${NC}"
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
else
    echo -e "${GREEN}✅ Foundry installed${NC}"
fi

# Check cast
if ! command -v cast &> /dev/null; then
    echo -e "${RED}❌ Cast not found${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Cast installed${NC}"
fi

# Check jq
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not found. Installing...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install jq
    else
        sudo apt-get install -y jq
    fi
fi

echo ""

# Step 2: Environment setup
echo -e "${YELLOW}📋 Step 2: Setting up environment...${NC}"
echo ""

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${BLUE}ℹ️  .env file already exists${NC}"
fi

# Check if private key is set
source .env
if [ "$PRIVATE_KEY" == "your_private_key_here" ] || [ -z "$PRIVATE_KEY" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  No private key configured!${NC}"
    echo ""
    echo "Choose an option:"
    echo "  1. Use Anvil's default key (for local testing)"
    echo "  2. Enter your own private key"
    echo "  3. Configure later and exit"
    echo ""
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1)
            # Anvil's first default account private key
            sed -i.bak 's/PRIVATE_KEY=.*/PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80/' .env
            echo -e "${GREEN}✅ Configured with Anvil's default key${NC}"
            ;;
        2)
            echo ""
            read -sp "Enter your private key (without 0x): " user_key
            echo ""
            sed -i.bak "s/PRIVATE_KEY=.*/PRIVATE_KEY=$user_key/" .env
            echo -e "${GREEN}✅ Private key configured${NC}"
            ;;
        3)
            echo ""
            echo -e "${YELLOW}Please edit .env file and run this script again${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
fi

# Reload environment
source .env

echo ""

# Step 3: Build contracts
echo -e "${YELLOW}📋 Step 3: Building contracts...${NC}"
echo ""
forge build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contracts built successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""

# Step 4: Choose deployment target
echo -e "${YELLOW}📋 Step 4: Choose deployment target...${NC}"
echo ""
echo "Where do you want to deploy?"
echo "  1. Local (Anvil) - Recommended for first time"
echo "  2. Polygon Mumbai (Testnet)"
echo "  3. Polygon Mainnet"
echo "  4. Ethereum Sepolia (Testnet)"
echo ""
read -p "Enter choice [1-4]: " deploy_choice

case $deploy_choice in
    1)
        NETWORK="localhost"
        echo ""
        echo -e "${BLUE}Starting local Anvil node...${NC}"
        # Check if anvil is already running
        if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
            echo -e "${GREEN}✅ Anvil already running on port 8545${NC}"
        else
            echo -e "${YELLOW}Please start Anvil in a separate terminal:${NC}"
            echo "  anvil"
            echo ""
            read -p "Press Enter once Anvil is running..."
        fi
        ;;
    2)
        NETWORK="mumbai"
        echo ""
        echo -e "${YELLOW}⚠️  Make sure you have MATIC on Mumbai testnet${NC}"
        echo "Get from: https://faucet.polygon.technology"
        read -p "Press Enter to continue..."
        ;;
    3)
        NETWORK="polygon"
        echo ""
        echo -e "${RED}⚠️  WARNING: Deploying to MAINNET!${NC}"
        echo -e "${YELLOW}Make sure you have MATIC for gas fees${NC}"
        read -p "Type 'yes' to confirm: " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Aborted"
            exit 0
        fi
        ;;
    4)
        NETWORK="sepolia"
        echo ""
        echo -e "${YELLOW}⚠️  Make sure you have Sepolia ETH${NC}"
        echo "Get from: https://sepoliafaucet.com"
        read -p "Press Enter to continue..."
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""

# Step 5: Deploy
echo -e "${YELLOW}📋 Step 5: Deploying contracts to $NETWORK...${NC}"
echo ""
./deploy.sh $NETWORK

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo ""

# Step 6: Test deployment
echo -e "${YELLOW}📋 Step 6: Testing deployment...${NC}"
echo ""
./test-deployment.sh $NETWORK

echo ""

# Step 7: Next steps
echo -e "${BLUE}"
cat << "EOF"
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║              SETUP COMPLETE! 🎉                       ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""
echo -e "${GREEN}Your Ghost Bounties contracts are deployed!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. 📋 View your deployment:"
echo "   ${BLUE}cat deployments/${NETWORK}.json${NC}"
echo ""
echo "2. 🤖 Update XMTP bot configuration:"
echo "   ${BLUE}cd ../xmtp${NC}"
echo "   Update contract addresses in src/integrations.ts"
echo ""
echo "3. 🧠 Configure Fluence agent:"
echo "   ${BLUE}cd ../fluence${NC}"
echo "   Update contract addresses"
echo ""
echo "4. 💾 Set up SQD indexer:"
echo "   ${BLUE}cd ../sqd${NC}"
echo "   Update contract addresses in src/processor.ts"
echo ""
echo "5. 🧪 Test the full flow:"
echo "   Create a bounty → Submit proof → Verify → Get paid"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "   - Quick Start: ${BLUE}cat QUICKSTART.md${NC}"
echo "   - Deployment: ${BLUE}cat DEPLOYMENT.md${NC}"
echo "   - Architecture: ${BLUE}cat ARCHITECTURE.md${NC}"
echo ""
echo -e "${GREEN}Happy building! 🚀${NC}"
