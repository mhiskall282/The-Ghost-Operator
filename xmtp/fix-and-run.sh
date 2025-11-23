#!/bin/bash

# Quick Fix for Database Corruption

echo "🔧 Fixing XMTP Database Corruption"
echo "==================================="
echo ""

# Navigate to xmtp directory
cd "$(dirname "$0")"

# Remove corrupted database files
echo "1️⃣  Removing corrupted database files..."
rm -f *.db3* 2>/dev/null
rm -rf xmtp_db/*.db3* 2>/dev/null
echo "   ✅ Database files removed"
echo ""

# Ensure using Node v20
echo "2️⃣  Checking Node version..."
if command -v nvm &> /dev/null; then
    nvm use 20 > /dev/null 2>&1
fi
NODE_VERSION=$(node --version)
echo "   Node version: $NODE_VERSION"
echo ""

# Check .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "   Run: ./setup-keys.sh"
    exit 1
fi

echo "3️⃣  Starting agent with fresh database..."
echo ""

# Run the agent
npm run dev
