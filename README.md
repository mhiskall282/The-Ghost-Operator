# GhostBounties 👻

GhostBounties is a bounty automation platform that pays developers instantly for completing micro-tasks on GitHub—without needing to trust the platform or reveal private data.

Using ZK-TLS proofs (vlayer), decentralized compute (Fluence), XMTP messaging, Polygon settlement, and SQD indexing, GhostBounties creates a trust-minimized workflow for developers to earn crypto by doing verifiable actions online.

---

## The Problem We're Solving

Ever tried to get paid for a simple GitHub task? You know, like "star this repo" or "merge PR #42"? It's a pain, right?

Most platforms make you:
- Hand over your GitHub API keys (yikes! 🔑)
- Wait for some admin to manually check your work (slow... 🐌)
- Trust that they'll actually pay you (fingers crossed 🤞)

We think there's a better way. What if you could prove you did the work without showing anyone your credentials? What if payments were instant and automatic? That's what we're building.

---

## How It Works

GhostBounties uses **zero-knowledge proofs** to verify you actually did the thing—without you having to prove it the old-fashioned way.

Think of it like this: instead of showing your ID to get into a club, you prove you're over 21 without revealing your age, name, or address. Same concept, but for GitHub actions.

- ✅ Did you star the repo? We can prove it (without seeing your tokens)
- ✅ Did you merge the PR? We can verify it (without your cookies)
- ✅ Did you comment on the issue? We know (but you stay private)

Here's the magic: **vlayer ZK-TLS** proves "this GitHub action happened over HTTPS" without exposing anything sensitive. Our **Fluence** agent (think of it as a robot brain) checks the proof and tells the **Polygon** smart contract to pay you. All through **XMTP** chat—no dashboard, no forms, just talk to the bot.

---

## The "Ghost" Stack 🏗️

We call it the Ghost Stack because it's invisible, trustless, and kind of spooky how well it works.

### 🧠 The Brain: Fluence (Rust/Marine)
This is where the logic lives. It's basically saying: "If the proof checks out, release the money." No humans needed, no trust required—just code doing what code does best.

### 👁️ The Eyes: vlayer (ZK-TLS)
This is the privacy-preserving part. It generates proofs that you did something on GitHub without ever seeing your actual credentials. No API keys, no tokens, no cookies—just proof that it happened.

### 💬 The Mouth: XMTP
This is how you talk to the bot. Want to see what jobs are available? Just ask. Got a proof to submit? Send it over. Everything happens in chat, like texting a friend (who happens to pay you in crypto).

### 🤲 The Hands: Polygon
This is where the money lives. Smart contracts hold your payment in escrow and release it the moment your proof is verified. Instant. Trustless. No waiting.

### 🧠 The Memory: SQD
This tracks everything—what you've done, what you've earned, how reliable you are. It builds your reputation score so future bounties know you're legit.

---

## How to Use It (The Happy Path)

Here's what using GhostBounties looks like in real life:

### 1. **Ask what's available**
You message the bot on XMTP:
```
You: "What jobs are available?"
```

### 2. **Get assigned a task**
The bot tells you what to do:
```
Bot: "Star the repo ghost-op/core. Reward: 5 USDC."
```

### 3. **Do the thing**
You go to GitHub and star the repo. Easy.

### 4. **Generate your proof**
The bot sends you a link. You click it, and vlayer captures your GitHub session (privately!) and generates a zero-knowledge proof. Think of it as a cryptographic receipt that says "yes, they did it" without showing how.

### 5. **Submit your proof**
You send the proof ID back to the bot:
```
You: "Proof ID: abc123xyz"
```

### 6. **Bot verifies it**
The Fluence agent checks your proof. If it's valid, it moves to the next step. If not, it tells you what went wrong.

### 7. **Get paid**
The Polygon contract releases 5 USDC to your wallet. No waiting, no approval, no middleman.

### 8. **Celebrate**
The bot confirms:
```
Bot: "Payment sent! ✅ 5 USDC has been transferred to your wallet."
```

That's it. From task to payment in minutes, all without trusting anyone or revealing anything.

---

## What You Can Do

Right now, we support these GitHub actions:
- ⭐ Star a repository
- 🍴 Fork a repository
- ✅ Merge a pull request
- 💬 Post a comment
- 🐛 Open an issue

More coming soon! Have ideas? [Let us know](https://github.com/your-org/ghost-bot/issues).

---

## Why This Matters

### 🔐 Privacy First
You never share your GitHub tokens, cookies, or credentials. Zero-knowledge proofs mean we can verify your work without seeing your secrets.

### 💰 Trustless Payments
No admin approval. No waiting periods. If your proof is valid, you get paid. Period. The smart contract handles everything.

### 📊 Build Your Reputation
Every task you complete builds your reputation score. Good workers get better bounties. It's like a decentralized LinkedIn, but for GitHub tasks.

### 💬 Chat-Native
No clunky dashboards. No forms to fill out. Just chat with the bot like you would with a friend. Simple, fast, human.

---

## Project Structure

Here's how we've organized things:

```
ghost-bot/
│
├── contracts/                    # Smart contracts that hold your money
│   ├── GhostVault.sol           # The escrow vault
│   ├── GhostBounties.sol        # Task registry + payout logic
│   └── ...
│
├── agent/                       # The Fluence agent (the brain)
│   ├── src/
│   │   ├── main.rs              # Main logic: verify proof, call contract
│   │   └── vlayer.rs            # Proof validation
│   └── ...
│
├── xmtp/                        # The chat interface
│   ├── src/
│   │   ├── index.ts             # Listens for messages
│   │   ├── commands.ts          # Handles "jobs", "submit", etc.
│   │   └── fluenceClient.ts     # Talks to the Fluence agent
│   └── ...
│
├── vlayer/                      # The ZK-TLS prover
│   ├── index.html               # Browser app to capture sessions
│   └── ...
│
├── sqd/                         # The indexer (the memory)
│   ├── schema.graphql
│   └── src/
│       ├── reputation.ts        # Calculates reputation scores
│       └── ...
│
└── docs/                        # Documentation
```

---

## Getting Started

Ready to dive in? Here's what you'll need:

### Prerequisites
- **Rust** (for the Fluence agent)
- **Node.js** (for the XMTP agent)
- A **Polygon wallet** with some testnet USDC (for testing)
- An **XMTP client** (to chat with the bot)
- Access to **Fluence network**
- The **vlayer SDK**

### Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/ghost-bot.git
   cd ghost-bot
   ```

2. **Set up the Fluence agent**
   ```bash
   cd agent
   cargo build
   ```

3. **Set up the XMTP agent**
   ```bash
   cd xmtp
   npm install
   ```

4. **Deploy the contracts**
   ```bash
   cd contracts
   # Check contracts/README.md for deployment steps
   ```

5. **Configure your environment**
   You'll need to set up:
   - XMTP credentials
   - Polygon RPC endpoint
   - Fluence network connection
   - vlayer prover endpoint

6. **Run everything**
   ```bash
   # Terminal 1: Fluence agent
   cd agent && cargo run
   
   # Terminal 2: XMTP agent
   cd xmtp && npm start
   
   # Terminal 3: SQD indexer
   cd sqd && # follow setup instructions
   ```

That's it! Once everything is running, you can start chatting with the bot and claiming bounties.

---

## Security & Trust

We take security seriously. Here's how we keep things safe:

- **Zero-knowledge proofs** mean your data stays private. We verify without seeing.
- **Smart contract escrow** means your payment is locked in code, not held by us.
- **Decentralized compute** (Fluence) means no single point of failure.
- **No API keys required** means you never have to share your GitHub credentials.

We're building this to be trustless. You shouldn't have to trust us—you should be able to verify everything yourself.

---

## Documentation

Want to go deeper? Check out:
- [Architecture Overview](docs/architecture.md) - How everything fits together
- [Bounty Format](docs/bounty-format.md) - How bounties are structured
- [Contracts](contracts/README.md) - Smart contract details
- [XMTP Agent](xmtp/README.md) - Chat interface setup
- [vlayer Integration](vlayer/README.md) - ZK-TLS proof generation
- [SQD Indexer](sqd/README.md) - Reputation system setup

---

## Contributing

We'd love your help! Found a bug? Have an idea? Want to add a feature?

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-thing`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing thing'`)
5. Push (`git push origin feature/amazing-thing`)
6. Open a PR

We're friendly, promise! 😊

---

## License

[Specify your license here]

---

## Built With

This project wouldn't exist without these amazing tools:
- [Fluence](https://fluence.network) - Decentralized compute
- [vlayer](https://vlayer.io) - ZK-TLS proofs
- [XMTP](https://xmtp.org) - Messaging
- [Polygon](https://polygon.technology) - Settlement layer
- [SQD](https://sqd.io) - Indexing

---

**GhostBounties** — Get paid for GitHub tasks, trustlessly. 👻

Questions? Issues? Just want to say hi? [Open an issue](https://github.com/your-org/ghost-bot/issues) or reach out!
