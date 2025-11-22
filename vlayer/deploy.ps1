# GhostBounties Deployment Script (PowerShell)
# This script automates the deployment process
# Works with WSL if Forge is installed there

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "GhostBounties Deployment Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if forge is available, if not use WSL
$useWsl = $false
try {
    $null = Get-Command forge -ErrorAction Stop
    Write-Host "Found Forge in PATH" -ForegroundColor Green
} catch {
    Write-Host "Forge not found in PATH, using WSL..." -ForegroundColor Yellow
    $useWsl = $true
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy env.template to .env and fill in your values" -ForegroundColor Yellow
    Write-Host "Or run: .\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env
$envVars = @{}
Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

# Check required variables
if (-not $envVars["PRIVATE_KEY"]) {
    Write-Host "Error: PRIVATE_KEY not set in .env" -ForegroundColor Red
    exit 1
}

if (-not $envVars["RPC_URL"]) {
    Write-Host "Error: RPC_URL not set in .env" -ForegroundColor Red
    exit 1
}

Write-Host "Configuration:" -ForegroundColor Green
Write-Host "   RPC URL: $($envVars['RPC_URL'])" -ForegroundColor White
Write-Host "   Chain ID: $($envVars['CHAIN_ID'])" -ForegroundColor White
Write-Host "   Use Mock Token: $($envVars['USE_MOCK_TOKEN'])" -ForegroundColor White
Write-Host ""

# Check if we're deploying to Anvil
$rpcUrl = $envVars["RPC_URL"]
if ($rpcUrl -match "127.0.0.1:8545" -or $rpcUrl -match "localhost:8545") {
    Write-Host "Detected Anvil (local) deployment" -ForegroundColor Yellow
    Write-Host "   Make sure Anvil is running: anvil" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue or Ctrl+C to cancel"
}

# Function to run forge commands
function Invoke-Forge {
    param([string]$Command)
    
    if ($useWsl) {
        # Convert Windows path to WSL path
        $wslPath = (wsl wslpath -a (Get-Location).Path).Trim()
        $wslCommand = "cd '$wslPath' && $Command"
        Write-Host "Running in WSL: $Command" -ForegroundColor Cyan
        wsl bash -c $wslCommand
        return $LASTEXITCODE
    } else {
        Invoke-Expression $Command
        return $LASTEXITCODE
    }
}

# Build contracts first
Write-Host "Building contracts..." -ForegroundColor Cyan
$buildResult = Invoke-Forge "forge build"

if ($buildResult -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Deploy contracts
Write-Host "Deploying contracts..." -ForegroundColor Cyan
Write-Host ""

$rpcUrl = $envVars["RPC_URL"]
$privateKey = $envVars["PRIVATE_KEY"]
$useMockToken = $envVars["USE_MOCK_TOKEN"]

if ($useWsl) {
    # For WSL, we need to pass env vars differently
    $wslPath = (wsl wslpath -a (Get-Location).Path).Trim()
    $deployCommand = "cd '$wslPath' && PRIVATE_KEY='$privateKey' RPC_URL='$rpcUrl' USE_MOCK_TOKEN='$useMockToken' forge script script/DeployAll.s.sol:DeployAll --rpc-url `"$rpcUrl`" --broadcast -vvv"
    Write-Host "Running deployment in WSL..." -ForegroundColor Cyan
    wsl bash -c $deployCommand
    $deployResult = $LASTEXITCODE
} else {
    $deployCommand = "forge script script/DeployAll.s.sol:DeployAll --rpc-url `"$rpcUrl`" --broadcast -vvv"
    Invoke-Expression $deployCommand
    $deployResult = $LASTEXITCODE
}

if ($deployResult -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contract addresses saved to: deployment.addresses" -ForegroundColor Cyan
    Write-Host ""
    if (Test-Path "deployment.addresses") {
        Get-Content deployment.addresses
    }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Update your .env files with the contract addresses" -ForegroundColor White
    Write-Host "   2. Update xmtp/.env with CONTRACT_ADDRESS and VAULT_ADDRESS" -ForegroundColor White
    Write-Host "   3. Update sqd/.env with CONTRACT_ADDRESS and VAULT_ADDRESS" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
