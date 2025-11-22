# 🐧 WSL Deployment Guide

Since you have Forge installed in WSL, here are the easiest ways to deploy:

## 🚀 Option 1: Automatic WSL Detection

The main `deploy.ps1` script now automatically detects if Forge is in WSL and uses it:

```powershell
cd vlayer
.\deploy.ps1
```

**This will:**
- Detect that Forge is in WSL
- Automatically use WSL for all forge commands
- Work seamlessly!

## 🚀 Option 2: Use WSL-Only Script

```powershell
cd vlayer
.\deploy-wsl.ps1
```

This runs everything through WSL.

## 🚀 Option 3: Direct WSL Command

If you prefer to run directly in WSL:

```bash
# In WSL terminal
cd /mnt/c/Users/user/Downloads/ghost-bot/vlayer
chmod +x deploy.sh
./deploy.sh
```

## 📝 Setup Steps

### 1. Create .env File (Windows PowerShell)
```powershell
cd vlayer
.\setup-env.ps1
```

### 2. Start Anvil (WSL Terminal)
```bash
anvil
```

### 3. Deploy (Windows PowerShell)
```powershell
cd vlayer
.\deploy.ps1
```

The script will automatically use WSL for forge commands!

## ✅ What Happens

1. Script detects Forge is in WSL
2. Converts Windows paths to WSL paths
3. Runs forge commands through WSL
4. Returns results to PowerShell

## 🐛 Troubleshooting

### "WSL not found"
- Make sure WSL is installed: `wsl --list`
- Try: `wsl --version`

### "Path conversion failed"
- Make sure you're in the `vlayer` folder
- Try running from WSL directly

### "Permission denied"
- In WSL, run: `chmod +x deploy.sh`

## 🎯 Recommended Workflow

1. **Windows PowerShell**: Create `.env` with `.\setup-env.ps1`
2. **WSL Terminal**: Start `anvil`
3. **Windows PowerShell**: Run `.\deploy.ps1` (auto-detects WSL)

This gives you the best of both worlds! 🚀

