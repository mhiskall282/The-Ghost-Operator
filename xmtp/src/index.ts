import { Agent } from "@xmtp/agent-sdk";
import { getTestUrl } from "@xmtp/agent-sdk/debug";
import dotenv from "dotenv";
import { BountyStore } from "./bountyStore";
import { MessageHandler } from "./messageHandler";
import { FluenceService, PolygonService, VlayerService } from "./integrations";
import type { ProofSubmission } from "./types";

// Load environment variables
dotenv.config();

/**
 * GhostBot Agent
 * Autonomous bounty verification and payment system
 */
class GhostBotAgent {
  private agent!: Agent;
  private bountyStore: BountyStore;
  private messageHandler: MessageHandler;
  private fluenceService: FluenceService;
  private polygonService: PolygonService;
  private vlayerService: VlayerService;
  private pendingVerifications: Map<string, ProofSubmission> = new Map();

  constructor() {
    this.bountyStore = new BountyStore();
    this.messageHandler = new MessageHandler(this.bountyStore);

    // Initialize integration services
    this.fluenceService = new FluenceService(
      process.env.FLUENCE_PEER_URL || "http://localhost:9991",
      process.env.FLUENCE_SERVICE_ID || "ghost-bounty-verifier"
    );

    this.polygonService = new PolygonService(
      process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
      process.env.BOUNTY_CONTRACT_ADDRESS ||
        "0x0000000000000000000000000000000000000000"
    );

    this.vlayerService = new VlayerService(
      process.env.VLAYER_VERIFIER_URL || "http://localhost:3000"
    );
  }

  /**
   * Initialize and start the agent
   */
  async start() {
    console.log("🚀 Starting GhostBot Agent...\n");

    // Validate environment variables
    this.validateEnv();

    // Create agent from environment
    this.agent = await Agent.createFromEnv({
      env: (process.env.XMTP_ENV as "dev" | "production" | "local") || "dev",
    });

    // Set up message handlers
    this.setupHandlers();

    // Start listening
    await this.agent.start();
  }

  /**
   * Validate required environment variables
   */
  private validateEnv() {
    const required = ["XMTP_WALLET_KEY", "XMTP_DB_ENCRYPTION_KEY"];
    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      console.error("❌ Missing required environment variables:");
      missing.forEach((key) => console.error(`   - ${key}`));
      console.error("\n💡 Copy .env.example to .env and fill in the values.\n");
      process.exit(1);
    }
  }

  /**
   * Set up XMTP event handlers
   */
  private setupHandlers() {
    // Handle incoming text messages
    this.agent.on("text", async (ctx) => {
      const userMessage = ctx.message.content;
      const senderAddress = await ctx.getSenderAddress();

      console.log(`\n📨 Message from ${senderAddress}:`);
      console.log(`   "${userMessage}"\n`);

      try {
        // Check if this is a proof submission that needs verification
        if (userMessage.toLowerCase().includes("submit")) {
          const response = await this.messageHandler.handleMessage(
            userMessage,
            senderAddress || "unknown"
          );
          await ctx.sendText(response);

          // Extract proof ID and start verification
          const proofMatch = userMessage.match(
            /0x[a-fA-F0-9]{64}|proof-[a-zA-Z0-9-]+/
          );
          if (proofMatch && senderAddress) {
            const proofId = proofMatch[0];
            // Start verification in background
            this.verifyAndPayInBackground(proofId, senderAddress, ctx);
          }
        } else {
          // Handle regular messages
          const response = await this.messageHandler.handleMessage(
            userMessage,
            senderAddress || "unknown"
          );
          await ctx.sendText(response);
        }
      } catch (error) {
        console.error("❌ Error handling message:", error);
        await ctx.sendText(
          "❌ Oops! Something went wrong. Please try again or type `help` for assistance."
        );
      }
    });

    // Handle when agent starts
    this.agent.on("start", () => {
      console.log("✅ GhostBot Agent is online!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👻 GhostBounties Agent");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📍 Address: ${this.agent.address}`);
      console.log(`🌐 Environment: ${process.env.XMTP_ENV || "dev"}`);
      console.log(`🔗 Test URL: ${getTestUrl(this.agent.client)}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log("💬 Waiting for messages...\n");
      console.log("💡 Test the agent at: https://xmtp.chat\n");
    });

    // Handle unhandled errors
    this.agent.on("unhandledError", (error: Error) => {
      console.error("❌ Agent error:", error);
    });
  }

  /**
   * Verify proof and process payment in background
   */
  private async verifyAndPayInBackground(
    proofId: string,
    userAddress: string,
    ctx: any
  ) {
    try {
      console.log(`🔍 Starting verification for proof ${proofId}...`);

      // Step 1: Verify proof with Fluence
      await ctx.sendText("⚙️ Step 1/3: Verifying proof with Fluence...");
      const verificationResult = await this.fluenceService.verifyProof(
        proofId,
        "bounty-001" // TODO: Track which bounty this is for
      );

      if (!verificationResult.valid) {
        await ctx.sendText(
          `❌ **Verification Failed**\n\n${verificationResult.error}\n\nPlease make sure you completed the task and try again.`
        );
        return;
      }

      await ctx.sendText("✅ Step 1/3: Proof verified!");

      // Step 2: Cross-verify with vlayer
      await ctx.sendText("⚙️ Step 2/3: Cross-verifying with vlayer...");
      const vlayerValid = await this.vlayerService.verifyProofDirect(proofId);

      if (!vlayerValid) {
        await ctx.sendText(
          "❌ **Cross-verification failed**\n\nThe proof could not be verified on-chain."
        );
        return;
      }

      await ctx.sendText("✅ Step 2/3: Cross-verification passed!");

      // Step 3: Release payment
      await ctx.sendText("⚙️ Step 3/3: Processing payment on Polygon...");
      const paymentResult = await this.polygonService.releasePayment(
        userAddress,
        5, // TODO: Get actual bounty amount
        "bounty-001"
      );

      if (!paymentResult.success) {
        await ctx.sendText(
          `❌ **Payment Failed**\n\n${paymentResult.error}\n\nPlease contact support.`
        );
        return;
      }

      // Success! Send celebration message
      await ctx.sendText(
        `🎉 **PAYMENT SENT!**

✅ Verification: Passed
✅ Amount: 5 USDC
✅ Transaction: \`${paymentResult.txHash}\`

💰 Payment sent to: \`${userAddress}\`

🔍 View on Polygonscan:
https://amoy.polygonscan.com/tx/${paymentResult.txHash}

Thanks for completing the bounty! Type \`jobs\` to find more. 🚀`
      );

      console.log(`✅ Payment completed for ${userAddress}`);
      console.log(`   TX: ${paymentResult.txHash}\n`);
    } catch (error) {
      console.error("❌ Verification/payment error:", error);
      await ctx.sendText(
        "❌ An error occurred during verification. Please try again or contact support."
      );
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  try {
    const ghostBot = new GhostBotAgent();
    await ghostBot.start();
  } catch (error) {
    console.error("❌ Failed to start agent:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down GhostBot Agent...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down GhostBot Agent...");
  process.exit(0);
});

// Start the agent
main();
