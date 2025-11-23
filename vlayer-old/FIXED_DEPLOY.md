# ✅ Fixed Deployment Scripts

All deployment scripts have been fixed! Here's how to use them:

## 🪟 Windows PowerShell (Recommended)

### Option 1: Use the main script
```powershell
cd vlayer

# Create .env file first
# Copy env.template to .env and edit it

# Then run:
.\deploy.ps1
```

### Option 2: One-command deploy
```powershell
cd vlayer
.\deploy-simple.ps1 -PrivateKey "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" -Network "anvil"
```

## 🐧 Linux/Mac/WSL

```bash
cd vlayer

# Make script executable (first time only)
chmod +x deploy.sh

# Create .env file
cp env.template .env
# Edit .env with your values

# Run deployment
./deploy.sh
```

## 📝 Create .env File

Create `vlayer/.env` with:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
USE_MOCK_TOKEN=true
CHAIN_ID=31337
```

## ✅ What Was Fixed

1. **PowerShell script** - Removed special characters causing syntax errors
2. **Bash script** - Added Windows line ending handling (`tr -d '\r'`)
3. **Simplified** - Removed emoji characters that might cause issues
4. **Better error handling** - Improved environment variable parsing

## 🚀 Quick Test

1. Start Anvil: `anvil` (in separate terminal)
2. Create `.env` file in `vlayer/` folder
3. Run: `.\deploy.ps1` (Windows) or `./deploy.sh` (Linux/Mac)

That's it! 🎉

