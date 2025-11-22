#!/bin/bash

# GhostBot XMTP Agent Setup Script

echo "👻 GhostBot XMTP Agent Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file found"
else
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your keys:"
    echo "   - XMTP_WALLET_KEY (your private key)"
    echo "   - XMTP_DB_ENCRYPTION_KEY (run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\")"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting GhostBot Agent in development mode..."
echo ""
npm run dev
