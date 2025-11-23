#!/bin/bash

# Comprehensive test script for Ghost Bot SQD Indexer
# This validates the entire setup and tests functionality

set -e

echo "🧪 Ghost Bot SQD Indexer - Comprehensive Test Suite"
echo "===================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

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

run_warning() {
    local warning_name=$1
    echo -e "${YELLOW}⚠ WARNING: $warning_name${NC}"
    ((WARNINGS++))
}

# Change to sqd directory
cd "$(dirname "$0")"

echo "📁 Phase 1: File Structure Validation"
echo "--------------------------------------"
run_test "package.json exists" "[ -f package.json ]"
run_test "schema.graphql exists" "[ -f schema.graphql ]"
run_test "tsconfig.json exists" "[ -f tsconfig.json ]"
run_test "src/main.ts exists" "[ -f src/main.ts ]"
run_test "src/processor.ts exists" "[ -f src/processor.ts ]"
run_test "src/constants.ts exists" "[ -f src/constants.ts ]"
run_test "docker-compose.yml exists" "[ -f docker-compose.yml ]"
run_test "Dockerfile exists" "[ -f Dockerfile ]"
echo ""

echo "🔧 Phase 2: Dependencies Check"
echo "-------------------------------"
run_test "Node.js installed" "command -v node"
run_test "npm installed" "command -v npm"
run_test "Docker installed" "command -v docker"
run_test "Docker Compose installed" "command -v docker-compose"

if [ -d "node_modules" ]; then
    run_test "node_modules exists" "true"
    run_test "@subsquid packages installed" "[ -d node_modules/@subsquid ]"
    run_test "@types/node installed" "[ -d node_modules/@types/node ]"
else
    echo -e "${YELLOW}⚠ node_modules not found. Installing...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Dependencies installed${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        ((FAILED++))
    fi
fi
echo ""

echo "📝 Phase 3: Code Generation"
echo "---------------------------"
if [ -d "src/model" ]; then
    echo -e "${GREEN}✓ Model directory exists${NC}"
    ((PASSED++))
    
    # Check for expected model files
    if [ -f "src/model/index.ts" ]; then
        run_test "Model index file exists" "true"
    else
        run_warning "Model files may be outdated"
    fi
else
    echo -e "${YELLOW}⚠ Models not generated. Running codegen...${NC}"
    npm run codegen
    
    if [ -d "src/model" ]; then
        echo -e "${GREEN}✓ Models generated successfully${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Failed to generate models${NC}"
        ((FAILED++))
    fi
fi
echo ""

echo "🏗️  Phase 4: TypeScript Compilation"
echo "------------------------------------"
echo "Compiling TypeScript..."
npm run build 2>&1 | tee /tmp/sqd-build.log

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
    ((PASSED++))
    
    run_test "lib directory created" "[ -d lib ]"
    run_test "main.js generated" "[ -f lib/main.js ]"
    run_test "processor.js generated" "[ -f lib/processor.js ]"
else
    echo -e "${RED}✗ Build failed. Check errors above.${NC}"
    ((FAILED++))
    
    # Show compilation errors
    echo ""
    echo "Compilation errors:"
    grep -i "error" /tmp/sqd-build.log || echo "See /tmp/sqd-build.log for details"
fi
echo ""

echo "⚙️  Phase 5: Configuration Validation"
echo "--------------------------------------"
if [ -f ".env" ]; then
    run_test ".env file exists" "true"
    
    # Check for required env vars
    if grep -q "DB_NAME" .env; then
        run_test "DB_NAME configured" "true"
    else
        run_warning "DB_NAME not configured in .env"
    fi
else
    run_warning ".env file not found. Copy from .env.example"
fi

# Check contract configuration
if grep -q "0x0000000000000000000000000000000000000000" src/constants.ts; then
    run_warning "Contract address is still placeholder"
else
    run_test "Contract address configured" "true"
fi

# Check PostgreSQL version in squid.yaml
if grep -q 'version: "14"' squid.yaml; then
    run_test "PostgreSQL version correct in squid.yaml" "true"
else
    run_warning "PostgreSQL version may be incorrect in squid.yaml"
fi
echo ""

echo "🐘 Phase 6: Database Check"
echo "--------------------------"
if docker-compose ps postgres 2>/dev/null | grep -q "Up"; then
    run_test "PostgreSQL container running" "true"
    
    # Test connection
    sleep 2
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        run_test "PostgreSQL accepting connections" "true"
    else
        run_warning "PostgreSQL not accepting connections yet"
    fi
else
    echo -e "${YELLOW}⚠ PostgreSQL not running. Starting...${NC}"
    docker-compose up -d postgres
    
    if [ $? -eq 0 ]; then
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
        
        if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PostgreSQL started and ready${NC}"
            ((PASSED++))
        else
            run_warning "PostgreSQL started but not ready yet"
        fi
    else
        echo -e "${RED}✗ Failed to start PostgreSQL${NC}"
        ((FAILED++))
    fi
fi
echo ""

echo "📊 Phase 7: Schema Validation"
echo "------------------------------"
# Validate GraphQL schema syntax
if [ -f "schema.graphql" ]; then
    run_test "Worker entity defined" "grep -q 'type Worker' schema.graphql"
    run_test "Payment entity defined" "grep -q 'type Payment' schema.graphql"
    run_test "DailyStats entity defined" "grep -q 'type DailyStats' schema.graphql"
    run_test "BountyContract entity defined" "grep -q 'type BountyContract' schema.graphql"
    
    # Check for @entity decorator
    run_test "Entities have @entity decorator" "grep -q '@entity' schema.graphql"
fi
echo ""

echo "🔍 Phase 8: Import Validation"
echo "------------------------------"
# Check for common import issues
if [ -f "lib/main.js" ]; then
    run_test "main.js imports processor correctly" "grep -q 'processor' lib/main.js"
    run_test "main.js imports db correctly" "grep -q 'db' lib/main.js"
fi

if [ -f "lib/processor.js" ]; then
    run_test "processor.js exports db" "grep -q 'exports.db' lib/processor.js"
fi
echo ""

echo "🧬 Phase 9: Runtime Validation"
echo "-------------------------------"
if [ -f "lib/main.js" ]; then
    echo "Testing processor instantiation..."
    
    # Try to load the processor (will fail if there are runtime errors)
    cat > /tmp/test-processor.js << 'EOF'
try {
  const { processor, db } = require('./lib/processor.js');
  console.log('✓ Processor loaded successfully');
  console.log('✓ Database instance available');
  process.exit(0);
} catch (error) {
  console.error('✗ Error loading processor:', error.message);
  process.exit(1);
}
EOF
    
    if node /tmp/test-processor.js 2>&1; then
        echo -e "${GREEN}✓ Processor module loads without errors${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Processor has runtime errors${NC}"
        ((FAILED++))
    fi
else
    run_warning "lib/main.js not found, skipping runtime validation"
fi
echo ""

echo "🔗 Phase 10: Integration Test"
echo "------------------------------"
# Test if we can start the processor (dry run)
echo "Testing processor startup..."

# Create a test script that tries to initialize the processor
cat > /tmp/test-startup.js << 'EOF'
const { processor, db } = require('./lib/processor.js');
console.log('Processor configuration:');
console.log('- Gateway:', processor.getGateway ? 'configured' : 'not configured');
console.log('- Database:', db ? 'initialized' : 'not initialized');
console.log('✓ All components loaded successfully');
process.exit(0);
EOF

if node /tmp/test-startup.js 2>&1; then
    echo -e "${GREEN}✓ Integration test passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Integration test failed${NC}"
    ((FAILED++))
fi
echo ""

# Summary
echo "===================================================="
echo "📊 Test Summary"
echo "===================================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    echo ""
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  There are $WARNINGS warnings to address${NC}"
        echo ""
    fi
    
    echo "🚀 Your SQD indexer is ready!"
    echo ""
    echo "Next steps:"
    echo "  1. Update contract address in src/constants.ts"
    echo "  2. Update deployment block in src/processor.ts"
    echo "  3. Run migrations: npm run db:migrate"
    echo "  4. Start the processor: npm run process"
    echo "  5. In another terminal: npm run serve"
    echo ""
    echo "Or start everything with Docker:"
    echo "  docker-compose up -d"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Tests failed. Please fix the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  - Run: npm install"
    echo "  - Run: npm run codegen"
    echo "  - Run: npm run build"
    echo "  - Check src/constants.ts for correct contract address"
    echo "  - Ensure PostgreSQL is running: docker-compose up -d postgres"
    echo ""
    exit 1
fi
