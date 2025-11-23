# Quick .env Setup Script
# This creates a .env file for Anvil deployment

Write-Host "Creating .env file for Anvil deployment..." -ForegroundColor Cyan

$envContent = @"
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
USE_MOCK_TOKEN=true
CHAIN_ID=31337
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8

Write-Host "✅ .env file created!" -ForegroundColor Green
Write-Host ""
Write-Host "To use your own private key, edit .env and change PRIVATE_KEY" -ForegroundColor Yellow
Write-Host ""

