#!/bin/bash

# Ghost Bounties - Deployment Checklist
# Run this to verify everything is ready

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Ghost Bounties - Deployment Check   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

PASS=0
FAIL=0

# Function to check something
check() {
    local desc="$1"
    local cmd="$2"
    
    printf "%-50s" "$desc"
    
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC}"
        ((FAIL++))
        return 1
    fi
}

# Check prerequisites
echo -e "${YELLOW}Prerequisites:${NC}"
check "Foundry (forge) installed" "command -v forge"
check "Cast installed" "command -v cast"
check "Anvil installed" "command -v anvil"
check "Git installed" "command -v git"
check "jq installed" "command -v jq"
echo ""

# Check files
echo -e "${YELLOW}Deployment Files:${NC}"
check "Deployment script exists" "[ -f script/DeployGhostBounties.s.sol ]"
check "deploy.sh exists" "[ -f deploy.sh ]"
check "deploy-local.sh exists" "[ -f deploy-local.sh ]"
check "test-deployment.sh exists" "[ -f test-deployment.sh ]"
check "setup-and-deploy.sh exists" "[ -f setup-and-deploy.sh ]"
check "All scripts are executable" "[ -x deploy.sh ] && [ -x deploy-local.sh ] && [ -x test-deployment.sh ] && [ -x setup-and-deploy.sh ]"
echo ""

# Check configuration
echo -e "${YELLOW}Configuration:${NC}"
check ".env.example exists" "[ -f .env.example ]"
check ".gitignore exists" "[ -f .gitignore ]"
check "foundry.toml exists" "[ -f foundry.toml ]"
check "deployments directory exists" "[ -d deployments ]"
echo ""

# Check contracts
echo -e "${YELLOW}Smart Contracts:${NC}"
check "GhostBounties.sol exists" "[ -f src/ghostbounties/GhostBounties.sol ]"
check "GhostVault.sol exists" "[ -f src/ghostbounties/GhostVault.sol ]"
check "GitHubProver.sol exists" "[ -f src/ghostbounties/GitHubProver.sol ]"
check "MockERC20.sol exists" "[ -f src/ghostbounties/MockERC20.sol ]"
echo ""

# Check documentation
echo -e "${YELLOW}Documentation:${NC}"
check "DEPLOYMENT-READY.md exists" "[ -f DEPLOYMENT-READY.md ]"
check "QUICKSTART.md exists" "[ -f QUICKSTART.md ]"
check "DEPLOYMENT.md exists" "[ -f DEPLOYMENT.md ]"
check "SETUP-COMPLETE.md exists" "[ -f SETUP-COMPLETE.md ]"
echo ""

# Build test
echo -e "${YELLOW}Build Test:${NC}"
printf "%-50s" "Contracts build successfully"
if forge build > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    ((PASS++))
else
    echo -e "${RED}❌${NC}"
    ((FAIL++))
fi
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              SUMMARY                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Passed: ${GREEN}$PASS${NC}"
echo -e "Failed: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! You're ready to deploy!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ${BLUE}./setup-and-deploy.sh${NC}"
    echo "  2. Or: ${BLUE}./deploy-local.sh${NC} for quick local test"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Install missing tools: ${BLUE}brew install jq${NC}"
    echo "  - Make scripts executable: ${BLUE}chmod +x *.sh${NC}"
    echo "  - Rebuild contracts: ${BLUE}forge build${NC}"
    echo ""
    exit 1
fi
