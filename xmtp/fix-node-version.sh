#!/bin/bash

echo "🔧 Node.js Version Fix for XMTP"
echo "================================"
echo ""

CURRENT_VERSION=$(node --version)
echo "Current Node.js version: $CURRENT_VERSION"
echo ""

# Check if nvm is installed
if command -v nvm &> /dev/null; then
    echo "✅ nvm is installed"
    echo ""
    echo "Installing Node.js v20 (LTS)..."
    nvm install 20
    nvm use 20
    echo ""
    echo "✅ Switched to Node.js $(node --version)"
    echo ""
    echo "🔄 Reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
    echo ""
    echo "✅ Ready! Now run: npm run dev"
elif command -v n &> /dev/null; then
    echo "✅ 'n' version manager is installed"
    echo ""
    echo "Installing Node.js v20 (LTS)..."
    sudo n 20
    echo ""
    echo "✅ Switched to Node.js $(node --version)"
    echo ""
    echo "🔄 Reinstalling dependencies..."
    rm -rf node_modules package-lock.json
    npm install
    echo ""
    echo "✅ Ready! Now run: npm run dev"
else
    echo "⚠️  No Node.js version manager found"
    echo ""
    echo "📝 Please install nvm or n:"
    echo ""
    echo "Option 1 - Install nvm:"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  source ~/.zshrc"
    echo "  nvm install 20"
    echo "  nvm use 20"
    echo ""
    echo "Option 2 - Install n:"
    echo "  npm install -g n"
    echo "  sudo n 20"
    echo ""
    echo "Then run this script again or:"
    echo "  cd /Users/dreytech/Projects/ghost-bot/xmtp"
    echo "  rm -rf node_modules package-lock.json"
    echo "  npm install"
    echo "  npm run dev"
fi
