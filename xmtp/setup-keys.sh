#!/bin/bash

# Generate required keys for .env file

echo "🔑 Generating Keys for GhostBot XMTP Agent"
echo "==========================================="
echo ""

echo "1️⃣  Generating XMTP_DB_ENCRYPTION_KEY..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ Generated: $ENCRYPTION_KEY"
echo ""

echo "2️⃣  Generating a new wallet (optional)..."
WALLET_OUTPUT=$(node -e "const w = require('ethers').Wallet.createRandom(); console.log(JSON.stringify({privateKey: w.privateKey, address: w.address}))")
PRIVATE_KEY=$(echo $WALLET_OUTPUT | node -e "process.stdin.on('data', d => console.log(JSON.parse(d).privateKey))")
ADDRESS=$(echo $WALLET_OUTPUT | node -e "process.stdin.on('data', d => console.log(JSON.parse(d).address))")
echo "✅ Generated wallet:"
echo "   Address: $ADDRESS"
echo "   Private Key: $PRIVATE_KEY"
echo ""

echo "3️⃣  Creating .env file..."
cat > .env << EOF
# XMTP Agent Configuration
XMTP_WALLET_KEY=$PRIVATE_KEY
XMTP_DB_ENCRYPTION_KEY=$ENCRYPTION_KEY
XMTP_ENV=dev

# Fluence Integration (Placeholder)
FLUENCE_PEER_URL=http://localhost:9991
FLUENCE_SERVICE_ID=ghost-bounty-verifier

# Polygon Contract (Placeholder)
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
BOUNTY_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# vlayer Integration (Placeholder)
VLAYER_VERIFIER_URL=http://localhost:3000
EOF

echo "✅ .env file created!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Your agent details:"
echo "   Wallet Address: $ADDRESS"
echo "   Environment: dev"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Visit: https://xmtp.chat/dm/$ADDRESS"
echo "   3. Start chatting with your agent!"
echo ""
echo "💡 Tip: Save your private key securely!"
echo "   Private Key: $PRIVATE_KEY"
echo ""
