# One-Command Deployment Script
# Usage: .\deploy-simple.ps1 -PrivateKey "your_key" -Network "anvil" or "polygon"

param(
    [Parameter(Mandatory=$true)]
    [string]$PrivateKey,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("anvil", "polygon")]
    [string]$Network = "anvil"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "GhostBounties Quick Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Set network configuration
if ($Network -eq "anvil") {
    $rpcUrl = "http://127.0.0.1:8545"
    $chainId = "31337"
    Write-Host "Network: Anvil (Local)" -ForegroundColor Yellow
    Write-Host "   Make sure Anvil is running!" -ForegroundColor Yellow
} else {
    $rpcUrl = "https://rpc.ankr.com/polygon_mumbai"
    $chainId = "80001"
    Write-Host "Network: Polygon Testnet" -ForegroundColor Yellow
}

Write-Host "Using provided private key" -ForegroundColor Green
Write-Host ""

# Create temporary .env
$envContent = "PRIVATE_KEY=$PrivateKey`nRPC_URL=$rpcUrl`nUSE_MOCK_TOKEN=true`nCHAIN_ID=$chainId`n"

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host "Created .env file" -ForegroundColor Green
Write-Host ""

# Build
Write-Host "Building contracts..." -ForegroundColor Cyan
forge build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy
Write-Host "Deploying contracts..." -ForegroundColor Cyan
Write-Host ""

forge script script/DeployAll.s.sol:DeployAll --rpc-url "$rpcUrl" --broadcast -vvv

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    if (Test-Path "deployment.addresses") {
        Write-Host "Contract Addresses:" -ForegroundColor Cyan
        Get-Content deployment.addresses
    }
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
