#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js 20
echo "Installing Node.js 20..."
nvm install 20
nvm use 20

# Verify version
echo "Current Node.js version: $(node --version)"

# Reinstall dependencies
echo "Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "✅ Done! Now run: npm run dev"

