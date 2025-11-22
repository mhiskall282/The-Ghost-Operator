import { Agent } from "@xmtp/agent-sdk";
import { getTestUrl } from "@xmtp/agent-sdk/debug";
import { filter } from "@xmtp/agent-sdk";
import { CommandRouter } from "@xmtp/agent-sdk/middleware";
import dotenv from "dotenv";

/**
 * Full Test Script
 * Tests agent with .env configuration and all features
 */

// Load environment variables
dotenv.config();

async function runFullTest() {
  console.log("🧪 XMTP Agent SDK - Full Feature Test\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // Check environment variables
    console.log("1️⃣  Checking environment variables...");
    const hasWalletKey = !!process.env.XMTP_WALLET_KEY;
    const hasEncryptionKey = !!process.env.XMTP_DB_ENCRYPTION_KEY;
    const hasEnv = !!process.env.XMTP_ENV;

    console.log(`   XMTP_WALLET_KEY: ${hasWalletKey ? "✅" : "❌"}`);
    console.log(`   XMTP_DB_ENCRYPTION_KEY: ${hasEncryptionKey ? "✅" : "❌"}`);
    console.log(`   XMTP_ENV: ${hasEnv ? "✅" : "❌"}\n`);

    if (!hasWalletKey || !hasEncryptionKey) {
      console.log("⚠️  Missing required environment variables!");
      console.log("💡 Run: ./setup-keys.sh to generate them\n");
      process.exit(1);
    }

    // 2. Create agent from environment
    console.log("2️⃣  Creating agent from environment...");
    const agent = await Agent.createFromEnv();
    console.log("   ✅ Agent created\n");

    // 3. Test middleware - Command Router
    console.log("3️⃣  Setting up Command Router middleware...");
    const router = new CommandRouter()
      .command("/hello", async (ctx) => {
        await ctx.conversation.send("Hi there! 👋");
      })
      .command("/help", async (ctx) => {
        await ctx.conversation.send(
          "Available commands:\n/hello - Say hi\n/help - This message\n/ping - Test response"
        );
      })
      .command("/ping", async (ctx) => {
        await ctx.conversation.send("🏓 Pong!");
      })
      .default(async (ctx) => {
        await ctx.conversation.send(
          `Unknown command: ${ctx.message.content}\nType /help for available commands`
        );
      });

    agent.use(router.middleware());
    console.log("   ✅ Command router configured\n");

    // 4. Test filters
    console.log("4️⃣  Setting up filter middleware...");
    const onlyUserMessages = async (ctx: any, next: any) => {
      // Skip messages from self
      if (
        !filter.fromSelf(ctx.message, ctx.client) &&
        filter.isText(ctx.message)
      ) {
        await next();
      }
    };
    agent.use(onlyUserMessages);
    console.log("   ✅ Filter middleware configured\n");

    // 5. Set up event handlers
    console.log("5️⃣  Setting up event handlers...");

    agent.on("text", async (ctx) => {
      const sender = await ctx.getSenderAddress();
      console.log(
        `\n📨 Message from ${sender?.slice(0, 6)}...${sender?.slice(-4)}:`
      );
      console.log(`   "${ctx.message.content}"`);
    });

    agent.on("reaction", async (ctx) => {
      console.log(`\n😊 Reaction received: ${ctx.message.content}`);
    });

    agent.on("reply", async (ctx) => {
      console.log(`\n💬 Reply received: ${ctx.message.content}`);
    });

    agent.on("dm", async (ctx) => {
      console.log("\n💬 New DM conversation!");
      await ctx.conversation.send(
        "👻 Welcome! I'm the GhostBounties test agent.\n\nCommands:\n/hello\n/help\n/ping"
      );
    });

    agent.on("group", async (ctx) => {
      console.log("\n👥 Added to a group!");
      await ctx.conversation.send("Hello everyone! 👋");
    });

    agent.on("unhandledError", (error: Error) => {
      console.error("\n❌ Unhandled error:", error.message);
    });

    agent.on("unknownMessage", (ctx) => {
      console.log("\n❓ Unknown message type received");
    });

    console.log("   ✅ Event handlers configured\n");

    // 6. Start the agent
    console.log("6️⃣  Starting agent...\n");

    agent.on("start", (ctx) => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ Agent Online!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📍 Address: ${agent.address}`);
      console.log(`🌐 Environment: ${process.env.XMTP_ENV || "dev"}`);
      console.log(`🔗 Test URL: ${getTestUrl(ctx.client)}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
      console.log("💬 Waiting for messages...");
      console.log("💡 Features enabled:");
      console.log("   ✅ Command Router (/hello, /help, /ping)");
      console.log("   ✅ Message Filtering");
      console.log("   ✅ DM & Group Conversations");
      console.log("   ✅ Reactions & Replies");
      console.log("\n🧪 Send a message to test!\n");
    });

    await agent.start();

    // Keep running for 60 seconds
    console.log("⏱️  Agent will run for 60 seconds...\n");

    await new Promise((resolve) => setTimeout(resolve, 60000));

    // 7. Stop the agent
    console.log("\n7️⃣  Stopping agent...");
    await agent.stop();
    console.log("   ✅ Agent stopped\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Full test completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down test...");
  process.exit(0);
});

// Run the test
runFullTest();
