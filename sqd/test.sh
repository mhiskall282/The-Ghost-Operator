#!/bin/bash

# Test script for SQD indexer
# This script runs basic validation checks

set -e

echo "🧪 Ghost Bot SQD Indexer - Test Suite"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

# Check if required files exist
echo "📁 Checking file structure..."
run_test "package.json exists" "[ -f package.json ]"
run_test "schema.graphql exists" "[ -f schema.graphql ]"
run_test "tsconfig.json exists" "[ -f tsconfig.json ]"
run_test "src/main.ts exists" "[ -f src/main.ts ]"
run_test "src/processor.ts exists" "[ -f src/processor.ts ]"
run_test "src/constants.ts exists" "[ -f src/constants.ts ]"
echo ""

# Check if Node.js is installed
echo "🔧 Checking dependencies..."
run_test "Node.js installed" "command -v node"
run_test "npm installed" "command -v npm"
run_test "Docker installed" "command -v docker"
run_test "Docker Compose installed" "command -v docker-compose"
echo ""

# Check if node_modules exists
echo "📦 Checking packages..."
if [ -d "node_modules" ]; then
    run_test "Dependencies installed" "[ -d node_modules/@subsquid ]"
else
    echo -e "${YELLOW}⚠ node_modules not found. Run 'npm install'${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Check environment
echo "⚙️  Checking environment..."
if [ -f ".env" ]; then
    run_test ".env file exists" "true"
    
    # Check for required variables
    if grep -q "DB_NAME=" .env; then
        run_test "DB_NAME configured" "true"
    else
        echo -e "${YELLOW}⚠ DB_NAME not set in .env${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}⚠ .env file not found. Copy from .env.example${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Check if PostgreSQL is running
echo "🐘 Checking PostgreSQL..."
if docker-compose ps postgres | grep -q "Up"; then
    run_test "PostgreSQL container running" "true"
    
    # Try to connect
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        run_test "PostgreSQL accepting connections" "true"
    else
        echo -e "${YELLOW}⚠ PostgreSQL not accepting connections${NC}"
        FAILED=$((FAILED + 1))
    fi
else
    echo -e "${YELLOW}⚠ PostgreSQL not running. Run 'docker-compose up -d postgres'${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Check if build is up to date
echo "🏗️  Checking build..."
if [ -d "lib" ]; then
    run_test "Project built (lib/ exists)" "true"
    
    # Check if source is newer than build
    if [ "src/main.ts" -nt "lib/main.js" ]; then
        echo -e "${YELLOW}⚠ Source files newer than build. Run 'npm run build'${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Project not built. Run 'npm run build'${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Try to validate GraphQL schema
echo "📊 Validating GraphQL schema..."
if [ -f "schema.graphql" ]; then
    # Check for required types
    run_test "Worker entity defined" "grep -q 'type Worker' schema.graphql"
    run_test "Payment entity defined" "grep -q 'type Payment' schema.graphql"
    run_test "DailyStats entity defined" "grep -q 'type DailyStats' schema.graphql"
else
    echo -e "${RED}✗ schema.graphql not found${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# Check contract configuration
echo "🔍 Checking configuration..."
if grep -q "0x0000000000000000000000000000000000000000" src/constants.ts; then
    echo -e "${YELLOW}⚠ Contract address not configured (still placeholder)${NC}"
    echo "  Update GHOST_BOUNTY_CONTRACT in src/constants.ts"
fi

if grep -q "40_000_000" src/processor.ts; then
    echo -e "${YELLOW}⚠ Deployment block not configured (still placeholder)${NC}"
    echo "  Update setBlockRange in src/processor.ts"
fi

if grep -q "'0x...'" src/processor.ts; then
    echo -e "${YELLOW}⚠ Event topics not configured (still placeholders)${NC}"
    echo "  Update topic0 hashes in src/processor.ts"
fi
echo ""

# Summary
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Update contract address in src/constants.ts"
    echo "  2. Update deployment block in src/processor.ts"
    echo "  3. Run: npm run process"
    echo "  4. In another terminal: npm run serve"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi
