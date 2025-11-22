#!/bin/bash

echo "🚀 Starting GhostBot with Node v20..."
echo ""

# Ensure Node v20 is being used
nvm use 20 > /dev/null 2>&1

# Check Node version
NODE_VERSION=$(node --version)
echo "Node version: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v20\. ]]; then
    echo "⚠️  Warning: Not using Node v20!"
    echo "   Run: nvm use 20"
    echo ""
    exit 1
fi

# Change to the correct directory
cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "   Run: ./setup-keys.sh"
    echo ""
    exit 1
fi

echo "✅ Environment configured"
echo ""
echo "Starting agent..."
echo ""

# Run the agent
npm run dev
