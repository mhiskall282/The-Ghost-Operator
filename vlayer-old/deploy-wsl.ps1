# WSL-Only Deployment Script
# This script runs everything through WSL

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "GhostBounties Deployment (WSL)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Convert Windows path to WSL path
$wslPath = (wsl wslpath -a (Get-Location).Path).Trim()
Write-Host "WSL Path: $wslPath" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file first" -ForegroundColor Yellow
    Write-Host "Or run: .\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

# Copy .env to WSL (ensure proper line endings)
$envContent = Get-Content .env -Raw
$tempEnv = [System.IO.Path]::GetTempFileName()
$envContent -replace "`r`n", "`n" | Set-Content $tempEnv -NoNewline
$wslEnvPath = (wsl wslpath -a $tempEnv).Trim()

Write-Host "Running deployment in WSL..." -ForegroundColor Cyan
Write-Host ""

# Run the bash script through WSL
$bashScript = Join-Path $PSScriptRoot "deploy.sh"
$wslScriptPath = (wsl wslpath -a $bashScript).Trim()

wsl bash -c "cd '$wslPath' && chmod +x deploy.sh && bash deploy.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    
    # Try to read deployment.addresses from WSL
    $addressesPath = Join-Path $PSScriptRoot "deployment.addresses"
    if (Test-Path $addressesPath) {
        Write-Host "Contract Addresses:" -ForegroundColor Cyan
        Get-Content $addressesPath
    }
} else {
    Write-Host ""
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

