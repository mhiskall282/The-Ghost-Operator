# 🚀 EASIEST Deployment - 3 Steps!

## Step 1: Start Anvil
Open a **new terminal** and run:
```bash
anvil
```
**Keep this terminal open!**

## Step 2: Create .env File

### Windows PowerShell:
```powershell
cd vlayer
.\setup-env.ps1
```

### OR manually create `.env`:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545
USE_MOCK_TOKEN=true
CHAIN_ID=31337
```

## Step 3: Deploy!

### If Forge is in WSL (auto-detected):
```powershell
.\deploy.ps1
```
The script will automatically use WSL!

### Or use WSL-only script:
```powershell
.\deploy-wsl.ps1
```

### Or run directly in WSL:
```bash
# In WSL terminal
cd /mnt/c/Users/user/Downloads/ghost-bot/vlayer
./deploy.sh
```

## ✅ Done!

You'll see:
```
✅ Deployment Successful!
CONTRACT_ADDRESS=0x...
VAULT_ADDRESS=0x...
```

Copy these addresses to `xmtp/.env` and `sqd/.env`!

---

## 🐛 If You Get Errors

### "Private key not set"
- Make sure `.env` file exists in `vlayer/` folder
- Check the file has no extra spaces

### "RPC connection failed"
- Make sure `anvil` is running in another terminal
- Check the RPC URL is `http://127.0.0.1:8545`

### "Build failed"
- Run `forge build` first to check for errors
- Make sure you're in the `vlayer` folder

---

## 🎯 One-Command Option

```powershell
.\deploy-simple.ps1 -PrivateKey "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" -Network "anvil"
```

This creates `.env` and deploys automatically!

