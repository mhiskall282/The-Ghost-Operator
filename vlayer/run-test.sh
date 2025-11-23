#!/bin/bash

# Quick setup and test script for PR verification

set -e

echo "🔧 Setting up PR Verification Tests..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo ""
    echo "Create a .env file with your vlayer credentials:"
    echo ""
    echo "WEB_PROVER_API_CLIENT_ID=your_client_id"
    echo "WEB_PROVER_API_SECRET=your_api_secret"
    echo ""
    exit 1
fi

# Load environment variables
source .env

# Check credentials
if [ -z "$WEB_PROVER_API_CLIENT_ID" ] || [ -z "$WEB_PROVER_API_SECRET" ]; then
    echo "❌ Missing vlayer credentials in .env file"
    exit 1
fi

echo "✅ Credentials loaded"
echo ""

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"
echo ""

# Run the quick test
echo "🚀 Running quick PR verification test..."
echo "   This will test with microsoft/vscode#200000 (a merged PR)"
echo ""
echo "⏳ Please wait - proof generation takes 30-60 seconds per test..."
echo ""

node test-pr-quick.mjs
