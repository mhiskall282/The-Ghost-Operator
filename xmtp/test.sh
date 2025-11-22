#!/bin/bash

# XMTP Agent Test Runner

echo "🧪 GhostBot XMTP Agent Test Suite"
echo "=================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
    echo ""
fi

echo "Choose a test to run:"
echo ""
echo "1. Simple Test (in-memory, no .env needed)"
echo "   - Creates temporary user"
echo "   - Tests basic agent functionality"
echo "   - Runs for 30 seconds"
echo ""
echo "2. Full Test (requires .env configuration)"
echo "   - Uses your wallet from .env"
echo "   - Tests all features (commands, filters, etc.)"
echo "   - Runs for 60 seconds"
echo ""
echo "3. Production Agent (runs indefinitely)"
echo "   - Full GhostBounties agent"
echo "   - Requires .env configuration"
echo "   - Press Ctrl+C to stop"
echo ""

read -p "Enter choice (1-3): " choice
echo ""

case $choice in
  1)
    echo "🚀 Running Simple Test..."
    echo ""
    npx tsx test-simple.ts
    ;;
  2)
    if [ ! -f .env ]; then
      echo "⚠️  .env file not found!"
      echo "💡 Run: ./setup-keys.sh to create one"
      echo ""
      exit 1
    fi
    echo "🚀 Running Full Test..."
    echo ""
    npx tsx test-full.ts
    ;;
  3)
    if [ ! -f .env ]; then
      echo "⚠️  .env file not found!"
      echo "💡 Run: ./setup-keys.sh to create one"
      echo ""
      exit 1
    fi
    echo "🚀 Running Production Agent..."
    echo ""
    npm run dev
    ;;
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac
