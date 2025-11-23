# ⚡ Quick Architecture Overview

## 🎯 What Does `vlayer` Folder Do?

The `vlayer` folder contains **all smart contracts** for GhostBounties. It's the "on-chain" part that:
- ✅ Stores bounties
- ✅ Holds payments in escrow
- ✅ Verifies ZK proofs
- ✅ Pays workers automatically

---

## 🏗️ Three Main Contracts

### 1. **GhostVault** 💰
**The Bank** - Holds money until proof is verified

```
Creator deposits 5 USDC → Vault locks it
Proof verified → Vault pays worker
```

### 2. **GitHubProver** 🔍
**The Verifier** - Checks if ZK proof is valid

```
Worker submits proof → Prover checks:
  ✅ Proof is cryptographically valid
  ✅ URL matches GitHub API
  ✅ Action actually happened
```

### 3. **GhostBounties** 🧠
**The Brain** - Orchestrates everything

```
Creates bounties → Verifies proofs → Releases payments
```

---

## 🔄 Simple Flow

```
1. Creator: "I'll pay 5 USDC to star my repo"
   → GhostBounties.createBounty()
   → GhostVault.deposit(5 USDC)

2. Worker: Stars repo + generates ZK proof
   → GhostBounties.completeBounty(proof)
   → GitHubProver.verify(proof) ✅
   → GhostVault.release(5 USDC → worker)

3. Worker gets paid! 💰
```

---

## 🔐 ZK-TLS Magic

**What it does:**
- Proves you did a GitHub action
- Without showing your API keys
- Without revealing your identity
- Verifiable on-chain

**How:**
- Browser captures HTTPS connection to GitHub
- vlayer creates cryptographic proof
- Smart contract verifies proof
- No credentials exposed!

---

## 📁 Folder Structure

```
vlayer/
├── src/ghostbounties/    ← Your contracts
├── script/               ← Deployment scripts
├── client/               ← Browser proof generator
└── dependencies/         ← Libraries (vlayer SDK, OpenZeppelin)
```

---

## 🚀 Deploy Order

1. **MockERC20** (test token)
2. **GhostVault** (escrow)
3. **GitHubProver** (verifier)
4. **GhostBounties** (main)

All automated in `DeployAll.s.sol`!

---

**That's it!** The contracts work together to enable trustless, private bounty payments. 🎉

