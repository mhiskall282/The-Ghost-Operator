#!/bin/bash

# Quick validation script for Ghost Bot SQD Indexer
# Tests that all TypeScript errors are fixed

set -e

echo "🧪 Quick SQD Validation"
echo "======================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd "$(dirname "$0")"

echo "✓ Running validation checks..."
echo ""

# Test 1: Check files exist
echo -n "1. File structure... "
if [ -f "package.json" ] && [ -f "schema.graphql" ] && [ -f "src/main.ts" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Test 2: Check node_modules
echo -n "2. Dependencies... "
if [ -d "node_modules/@subsquid" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}Installing...${NC}"
    npm install > /dev/null 2>&1
    if [ -d "node_modules/@subsquid" ]; then
        echo -e "   ${GREEN}✓ Installed${NC}"
    else
        echo -e "   ${RED}✗ Failed${NC}"
        exit 1
    fi
fi

# Test 3: Check models generated
echo -n "3. TypeORM models... "
if [ -d "src/model" ] && [ -f "src/model/index.ts" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}Generating...${NC}"
    npm run codegen > /dev/null 2>&1
    if [ -d "src/model" ]; then
        echo -e "   ${GREEN}✓ Generated${NC}"
    else
        echo -e "   ${RED}✗ Failed${NC}"
        exit 1
    fi
fi

# Test 4: TypeScript compilation
echo -n "4. TypeScript build... "
npm run build > /tmp/sqd-build.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo ""
    echo "Build errors:"
    cat /tmp/sqd-build.log
    exit 1
fi

# Test 5: Check compiled files
echo -n "5. Compiled outputs... "
if [ -f "lib/main.js" ] && [ -f "lib/processor.js" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Test 6: Runtime validation
echo -n "6. Runtime test... "
SCRIPT_DIR="$(pwd)"
cat > /tmp/sqd-runtime-test.js << EOF
try {
  const { processor, db } = require('${SCRIPT_DIR}/lib/processor.js');
  if (!processor || !db) {
    console.error('Missing exports');
    process.exit(1);
  }
  process.exit(0);
} catch (error) {
  console.error('Runtime error:', error.message);
  process.exit(1);
}
EOF

if node /tmp/sqd-runtime-test.js 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Test 7: Schema validation
echo -n "7. GraphQL schema... "
if grep -q "enum PaymentStatus" schema.graphql && grep -q "enum TaskType" schema.graphql; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    exit 1
fi

# Test 8: Configuration check
echo -n "8. Configuration... "
WARNINGS=0
if grep -q "0x0000000000000000000000000000000000000000" src/constants.ts; then
    WARNINGS=$((WARNINGS + 1))
fi
if [ ! -f ".env" ]; then
    WARNINGS=$((WARNINGS + 1))
fi

if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ ($WARNINGS warnings)${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ All validation tests passed!${NC}"
echo "======================================"
echo ""

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Configuration reminders:${NC}"
    if grep -q "0x0000000000000000000000000000000000000000" src/constants.ts; then
        echo "  • Update contract address in src/constants.ts"
    fi
    if [ ! -f ".env" ]; then
        echo "  • Copy .env.example to .env"
    fi
    echo ""
fi

echo "Your SQD indexer is ready to run! 🚀"
echo ""
echo "Next steps:"
echo "  1. Configure contract address: vim src/constants.ts"
echo "  2. Run migrations: npm run db:migrate"
echo "  3. Start indexer: npm run process"
echo "  4. Start GraphQL: npm run serve"
echo ""
echo "Or use Docker:"
echo "  docker-compose up -d"
echo ""

exit 0
