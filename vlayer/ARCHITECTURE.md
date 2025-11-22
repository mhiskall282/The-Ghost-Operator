# 🏗️ vlayer Folder Architecture Explained

## 📁 What is the `vlayer` Folder?

The `vlayer` folder contains **all the smart contracts** for GhostBounties. It's built using **Foundry** (a Solidity development framework) and integrates with **vlayer** (a ZK-TLS proof system) to verify GitHub actions without exposing user credentials.

---

## 🎯 Core Purpose

**vlayer** = **Zero-Knowledge TLS Proof System**

Instead of asking users to share their GitHub API keys or cookies, vlayer creates cryptographic proofs that:
- ✅ Prove you did a GitHub action (star, fork, etc.)
- ✅ Without revealing your credentials
- ✅ Without exposing your identity
- ✅ Verifiable on-chain

Think of it like: "I can prove I'm over 21 without showing my ID"

---

## 📂 Folder Structure

```
vlayer/
├── src/
│   ├── ghostbounties/          # 🎯 YOUR MAIN CONTRACTS
│   │   ├── GhostBounties.sol   # Main contract (orchestrates everything)
│   │   ├── GhostVault.sol      # Escrow (holds money)
│   │   ├── GitHubProver.sol    # ZK proof verifier for GitHub
│   │   └── MockERC20.sol       # Test token (for local testing)
│   └── vlayer/                 # Example contracts (reference)
│
├── script/                     # 📜 Deployment Scripts
│   ├── DeployAll.s.sol         # Deploys all contracts in order
│   ├── DeployVault.s.sol      # Deploy vault only
│   ├── DeployProver.s.sol     # Deploy prover only
│   └── DeployBounties.s.sol    # Deploy main contract only
│
├── client/                     # 🌐 Browser Client
│   ├── index.html              # User interface for proof generation
│   ├── prover.js               # JavaScript to call vlayer API
│   └── vlayer-auth.js          # JWT authentication helper
│
├── dependencies/               # 📦 External Libraries
│   ├── vlayer-1.5.1/          # vlayer SDK (ZK-TLS proofs)
│   ├── @openzeppelin-contracts/ # Security libraries
│   └── risc0-ethereum/        # RISC Zero verifier
│
└── deploy.ps1 / deploy.sh      # 🚀 Automated deployment scripts
```

---

## 🏛️ Smart Contract Architecture

### 1. **GhostVault.sol** - The Bank 💰

**Purpose:** Holds funds in escrow until bounties are completed

```
┌─────────────────┐
│  GhostVault     │
├─────────────────┤
│ • deposit()     │ ← Bounty creator deposits funds
│ • release()     │ ← Pays worker when proof verified
│ • refund()      │ ← Returns money if bounty cancelled
└─────────────────┘
```

**Key Features:**
- Holds ERC20 tokens (USDC) in escrow
- Only `GhostBounties` contract can release funds
- Tracks how much is escrowed per bounty

**Example Flow:**
1. Creator wants to pay 5 USDC for a star
2. Creator calls `deposit(bountyId, 5 USDC)`
3. Vault locks the 5 USDC
4. When proof is verified → `release()` sends to worker

---

### 2. **GitHubProver.sol** - The Verifier 🔍

**Purpose:** Verifies ZK-TLS proofs that GitHub actions happened

```
┌─────────────────┐
│ GitHubProver    │
├─────────────────┤
│ • proveStar()   │ ← Verifies star proof
│ • proveFork()   │ ← Verifies fork proof
│ • proveMergePR()│ ← Verifies PR merge proof
│ • proveComment()│ ← Verifies comment proof
│ • proveOpenIssue()│ ← Verifies issue opened
└─────────────────┘
```

**How It Works:**
1. User generates a ZK-TLS proof (via browser client)
2. Proof contains: "I called GitHub API at this URL"
3. `GitHubProver` verifies:
   - ✅ Proof is valid (cryptographically sound)
   - ✅ URL matches expected GitHub API endpoint
   - ✅ Response indicates the action happened

**Example:**
```solidity
// User wants to prove they starred "ghost-op/core"
function proveStar(WebProof proof, "ghost-op", "core") {
    // Verify proof matches: https://api.github.com/repos/ghost-op/core
    webProof.verify("https://api.github.com/repos/ghost-op/core");
    // Returns: verified = true
}
```

---

### 3. **GhostBounties.sol** - The Brain 🧠

**Purpose:** Main contract that orchestrates everything

```
┌─────────────────────────────────┐
│      GhostBounties              │
├─────────────────────────────────┤
│ • createBounty()                │ ← Creator posts a bounty
│ • completeBounty(proof)         │ ← Worker submits proof
│ • cancelBounty()                │ ← Creator cancels
│                                 │
│ Uses:                           │
│ • GitHubProver (verifies proof) │
│ • GhostVault (releases payment) │
└─────────────────────────────────┘
```

**Key Data Structures:**
```solidity
struct Bounty {
    uint256 id;              // Unique ID
    address creator;         // Who posted it
    GitHubAction action;     // Star, Fork, etc.
    string repoOwner;        // "ghost-op"
    string repoName;         // "core"
    uint256 reward;          // 5 USDC
    BountyStatus status;     // Active/Completed/Cancelled
    address completedBy;     // Worker who completed it
}
```

**Complete Flow:**
```
1. Creator → createBounty()
   ├─ Creates bounty record
   └─ Calls vault.deposit() → Locks funds

2. Worker → completeBounty(proof)
   ├─ Verifies proof using GitHubProver
   ├─ Updates bounty status
   └─ Calls vault.release() → Pays worker
```

---

## 🔄 Complete System Flow

### Step-by-Step: How a Bounty Works

```
┌─────────────┐
│  1. Creator │
└──────┬──────┘
       │
       │ createBounty("Star ghost-op/core", 5 USDC)
       ▼
┌─────────────────┐
│ GhostBounties   │
│  • Stores bounty│
│  • Calls vault  │
└──────┬──────────┘
       │
       │ vault.deposit(5 USDC)
       ▼
┌─────────────┐
│ GhostVault  │
│ Locks 5 USDC│
└─────────────┘

       ═══════════════════════════════════

┌─────────────┐
│  2. Worker  │
└──────┬──────┘
       │
       │ 1. Stars repo on GitHub
       │ 2. Generates ZK proof (browser)
       │ 3. Gets proof ID
       │
       │ completeBounty(proof)
       ▼
┌─────────────────┐
│ GhostBounties   │
│  • Verifies     │
└──────┬──────────┘
       │
       │ onlyVerified(githubProver, proveStar)
       ▼
┌─────────────────┐
│ GitHubProver    │
│  • Checks proof │
│  • Validates URL│
│  • Returns: ✅  │
└──────┬──────────┘
       │
       │ Proof valid!
       ▼
┌─────────────────┐
│ GhostBounties   │
│  • Marks done   │
│  • Calls vault  │
└──────┬──────────┘
       │
       │ vault.release(5 USDC → worker)
       ▼
┌─────────────┐
│ GhostVault  │
│ Pays worker │
└─────────────┘
```

---

## 🔐 How ZK-TLS Proofs Work

### What is ZK-TLS?

**ZK-TLS** = Zero-Knowledge Transport Layer Security

Instead of:
```
❌ Old way: "Here's my GitHub API key, check if I starred it"
```

We do:
```
✅ New way: "Here's a cryptographic proof that I called GitHub API 
            at this URL, but you can't see my credentials"
```

### The Magic:

1. **User's Browser** → Connects to GitHub API (HTTPS)
2. **vlayer Notary** → Observes the TLS connection (without seeing secrets)
3. **Proof Generated** → Cryptographic proof that the connection happened
4. **Smart Contract** → Verifies proof without seeing credentials

### Example Proof Structure:

```javascript
{
  "proof": "0xabc123...",      // Cryptographic proof
  "url": "https://api.github.com/repos/ghost-op/core",
  "timestamp": 1234567890,
  "verified": true
}
```

The contract can verify this proof is valid, but **never sees**:
- ❌ User's GitHub token
- ❌ User's cookies
- ❌ User's password
- ❌ Any private data

---

## 🧩 Contract Relationships

```
┌─────────────────────────────────────────────┐
│           GhostBounties (Main)              │
│  ┌──────────────────────────────────────┐  │
│  │ • Manages bounties                    │  │
│  │ • Tracks workers                      │  │
│  │ • Orchestrates verification           │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Uses:                                      │
│  ┌──────────────┐    ┌──────────────┐     │
│  │ GitHubProver │    │ GhostVault   │     │
│  │              │    │              │     │
│  │ Verifies ZK  │    │ Holds funds  │     │
│  │ proofs       │    │ in escrow    │     │
│  └──────────────┘    └──────────────┘     │
│         │                    │             │
│         │                    │             │
│         └────────────────────┘             │
│              (Both immutable)              │
└─────────────────────────────────────────────┘
```

**Key Points:**
- `GhostBounties` is the **only** contract that can call `vault.release()`
- `GitHubProver` is **immutable** (can't be changed after deployment)
- All contracts use **OpenZeppelin** for security

---

## 📊 Data Flow Example

### Creating a Bounty:

```solidity
// 1. Creator calls
ghostBounties.createBounty(
    GitHubAction.Star,  // Action type
    "ghost-op",          // Repo owner
    "core",              // Repo name
    0,                   // PR number (not needed)
    5e6                  // 5 USDC (6 decimals)
);

// 2. Inside createBounty():
bounties[bountyId] = Bounty({...});  // Store bounty
vault.deposit(bountyId, 5e6);         // Lock 5 USDC
```

### Completing a Bounty:

```solidity
// 1. Worker calls with ZK proof
ghostBounties.completeBounty(
    bountyId,
    proof  // ZK-TLS proof from vlayer
);

// 2. Inside completeBounty():
// Modifier: onlyVerified(githubProver, proveStar.selector)
//   ↓
// Verifies proof matches GitHubProver.proveStar()
//   ↓
// If valid:
bounty.status = Completed;
vault.release(bountyId, worker, 5e6);  // Pay worker
```

---

## 🔧 Key Technologies

### 1. **vlayer SDK** (`dependencies/vlayer-1.5.1/`)
- Provides `Proof`, `Verifier`, `Prover` contracts
- Handles ZK-TLS proof verification
- Uses RISC Zero for cryptographic verification

### 2. **OpenZeppelin** (`dependencies/@openzeppelin-contracts/`)
- `Ownable` - Access control
- `SafeERC20` - Safe token transfers
- `IERC20` - Token interface

### 3. **Foundry** (Development Framework)
- `forge` - Compile and test
- `anvil` - Local blockchain
- `cast` - Interact with contracts

---

## 🎯 Summary

**The `vlayer` folder is the "smart contract layer" of GhostBounties:**

1. **GhostVault** = Bank (holds money)
2. **GitHubProver** = Verifier (checks proofs)
3. **GhostBounties** = Brain (orchestrates everything)
4. **Client** = Browser UI (generates proofs)

**The Magic:**
- Users prove they did GitHub actions
- Without sharing credentials
- Payments are automatic and trustless
- Everything is verifiable on-chain

**Deployment:**
- All contracts deploy in order: Vault → Prover → Bounties
- Scripts automate the process
- Works on Anvil (local) or Polygon (testnet/mainnet)

---

## 📚 Next Steps

- **Deploy contracts**: See `DEPLOYMENT_GUIDE.md`
- **Understand proofs**: Read `vlayer/dependencies/vlayer-1.5.1/README.md`
- **Test locally**: Use Anvil and MockERC20
- **Interact**: Use `cast` or write tests

This architecture enables **trustless, privacy-preserving bounty payments**! 🚀

