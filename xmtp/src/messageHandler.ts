import type { Bounty } from "./types";
import type { BountyStore } from "./bountyStore";

/**
 * Message Handler
 * Processes user messages and generates appropriate responses
 */
export class MessageHandler {
  constructor(private bountyStore: BountyStore) {}

  /**
   * Route incoming messages to appropriate handlers
   */
  async handleMessage(message: string, userAddress: string): Promise<string> {
    const normalizedMsg = message.toLowerCase().trim();

    // Help command
    if (
      normalizedMsg.includes("help") ||
      normalizedMsg === "hi" ||
      normalizedMsg === "hello"
    ) {
      return this.getHelpMessage();
    }

    // List bounties
    if (
      normalizedMsg.includes("jobs") ||
      normalizedMsg.includes("bounties") ||
      normalizedMsg.includes("available") ||
      normalizedMsg.includes("list")
    ) {
      return this.listBounties();
    }

    // Claim bounty
    if (normalizedMsg.includes("claim") || normalizedMsg.includes("take")) {
      return this.handleClaimRequest(normalizedMsg, userAddress);
    }

    // Submit proof
    if (normalizedMsg.includes("proof") || normalizedMsg.includes("submit")) {
      return this.handleProofSubmission(normalizedMsg, userAddress);
    }

    // Check status
    if (
      normalizedMsg.includes("status") ||
      normalizedMsg.includes("my bounties")
    ) {
      return this.getUserStatus(userAddress);
    }

    // Default response
    return this.getHelpMessage();
  }

  private getHelpMessage(): string {
    return `👻 **Welcome to GhostBounties!**

I'm an autonomous agent that pays you instantly for completing verified GitHub tasks.

**Commands:**
• \`jobs\` or \`bounties\` - See available bounties
• \`claim [bounty-id]\` - Claim a bounty
• \`submit [proof-id]\` - Submit your ZK proof
• \`status\` - Check your claimed bounties
• \`help\` - Show this message

Type \`jobs\` to get started! 🚀`;
  }

  private listBounties(): string {
    const bounties = this.bountyStore.getActiveBounties();

    if (bounties.length === 0) {
      return "❌ No active bounties available right now. Check back soon!";
    }

    let response = "💰 **Available Bounties:**\n\n";

    bounties.forEach((bounty, index) => {
      response += `**${index + 1}. ${bounty.title}** (ID: \`${bounty.id}\`)\n`;
      response += `   📝 ${bounty.description}\n`;
      response += `   💵 Reward: **${bounty.reward}**\n`;
      response += `   🔗 ${bounty.githubUrl}\n\n`;
    });

    response += "\n💡 To claim a bounty, type: `claim bounty-001`";

    return response;
  }

  private handleClaimRequest(message: string, userAddress: string): string {
    // Extract bounty ID from message
    const match = message.match(/bounty-\d+/);

    if (!match) {
      return "❌ Please specify a bounty ID. Example: `claim bounty-001`";
    }

    const bountyId = match[0];
    const bounty = this.bountyStore.getBountyById(bountyId);

    if (!bounty) {
      return `❌ Bounty \`${bountyId}\` not found. Type \`jobs\` to see available bounties.`;
    }

    if (bounty.status !== "active") {
      return `❌ Bounty \`${bountyId}\` is no longer available.`;
    }

    // Claim the bounty
    const claimed = this.bountyStore.claimBounty(bountyId, userAddress);

    if (!claimed) {
      return `❌ Failed to claim bounty \`${bountyId}\`. It may have been claimed by someone else.`;
    }

    return `✅ **Bounty Claimed!**

📋 **Task:** ${bounty.title}
💵 **Reward:** ${bounty.reward}
🔗 **GitHub:** ${bounty.githubUrl}

**Next Steps:**
1. Complete the task on GitHub
2. Generate your ZK proof: ${bounty.vlayerProofUrl || "URL coming soon"}
3. Copy the Proof ID you receive
4. Send me: \`submit [your-proof-id]\`

⏰ You have 24 hours to complete this task. Good luck! 🚀`;
  }

  private handleProofSubmission(message: string, userAddress: string): string {
    // Extract proof ID (could be various formats)
    const proofMatch = message.match(/0x[a-fA-F0-9]{64}|proof-[a-zA-Z0-9-]+/);

    if (!proofMatch) {
      return `❌ Invalid proof format. 

Please submit your proof like this:
\`submit 0x1234...abcd\`
or
\`submit proof-abc-123\``;
    }

    const proofId = proofMatch[0];

    return `🔍 **Proof Received!**

Proof ID: \`${proofId}\`

⏳ Verifying your proof with Fluence...
This usually takes 30-60 seconds.

I'll send you a message when verification is complete! ⚡`;
  }

  private getUserStatus(userAddress: string): string {
    // TODO: Implement actual user status tracking
    return `📊 **Your Status**

Wallet: \`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}\`

🏆 Completed Bounties: 0
💰 Total Earned: 0 USDC
⏳ Pending Verifications: 0

Type \`jobs\` to find new bounties! 🚀`;
  }

  /**
   * Format bounty details
   */
  formatBounty(bounty: Bounty): string {
    return `**${bounty.title}**
ID: ${bounty.id}
Reward: ${bounty.reward}
Task: ${bounty.description}
GitHub: ${bounty.githubUrl}
Status: ${bounty.status}`;
  }
}
