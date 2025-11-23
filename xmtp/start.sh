#!/bin/bash

# GhostBot Agent Launcher
# Automatically switches to Node v20 and starts the agent

cd "$(dirname "$0")"

# Fix npm_config_prefix issue with nvm
unset npm_config_prefix

# Source nvm and switch to Node 20
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    \. "$NVM_DIR/nvm.sh"
    
    CURRENT=$(node --version 2>/dev/null || echo "none")
    if [[ $CURRENT != v20.* ]]; then
        echo "📦 Switching to Node v20..."
        nvm use 20 2>/dev/null || { nvm install 20 && nvm use 20; }
        echo ""
    fi
fi

# Verify Node 20
CURRENT=$(node --version)
if [[ $CURRENT != v20.* ]]; then
    echo "❌ Node v20 required. Current: $CURRENT"
    echo "Please run: nvm use 20"
    exit 1
fi

# Clean database files
DB_COUNT=$(ls *.db3* 2>/dev/null | wc -l | tr -d ' ')
if [ "$DB_COUNT" -gt 0 ]; then
    rm -f *.db3*
    echo "✅ Database cleaned • Node $(node --version)"
else
    echo "✅ Node $(node --version) • Ready"
fi

echo ""

# Start the agent
exec tsx watch src/index.ts
