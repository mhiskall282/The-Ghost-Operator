import { Agent } from "@xmtp/agent-sdk";
import { getTestUrl, logDetails } from "@xmtp/agent-sdk/debug";
import { createUser, createSigner } from "@xmtp/agent-sdk/user";

/**
 * Simple Test Script
 * Tests basic XMTP agent functionality without .env file
 */

async function runSimpleTest() {
  console.log("🧪 XMTP Agent SDK Test\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // 1. Create a local user + signer
    console.log("1️⃣  Creating test user and signer...");
    const user = createUser();
    const signer = createSigner(user);
    console.log("   ✅ User created");
    console.log(`   📍 Address: ${user.account.address}\n`);

    // 2. Create agent with in-memory database
    console.log("2️⃣  Creating agent (in-memory)...");
    const agent = await Agent.create(signer, {
      env: "dev",
      dbPath: null, // in-memory for testing
    });
    console.log("   ✅ Agent created\n");

    // 3. Set up event handlers
    console.log("3️⃣  Setting up event handlers...");

    agent.on("text", async (ctx) => {
      const sender = await ctx.getSenderAddress();
      console.log(`\n   📨 Text message received from ${sender}:`);
      console.log(`      "${ctx.message.content}"`);
      await ctx.sendText("Hello from test agent! 👋");
    });

    agent.on("start", async (ctx) => {
      console.log("   ✅ Agent started!\n");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📊 Agent Details:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`Address: ${agent.address}`);
      console.log(`Environment: dev`);
      console.log(`Test URL: ${getTestUrl(ctx.client)}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      // Log comprehensive details
      console.log("📋 Comprehensive Details:");
      await logDetails(ctx.client);
      console.log("");
    });

    agent.on("dm", async (ctx) => {
      console.log("\n   💬 New DM conversation started!");
      await ctx.conversation.send("Welcome to our DM!");
    });

    agent.on("group", async (ctx) => {
      console.log("\n   👥 New group conversation started!");
      await ctx.conversation.send("Hello group!");
    });

    agent.on("unhandledError", (error: Error) => {
      console.error("\n   ❌ Unhandled error:", error.message);
    });

    console.log("   ✅ Event handlers configured\n");

    // 4. Start the agent
    console.log("4️⃣  Starting agent...\n");
    await agent.start();

    // Keep running for 30 seconds to allow testing
    console.log("💡 Agent is running for 30 seconds...");
    console.log("💡 Visit the test URL above to chat with it!\n");

    await new Promise((resolve) => setTimeout(resolve, 30000));

    // 5. Stop the agent
    console.log("\n5️⃣  Stopping agent...");
    await agent.stop();
    console.log("   ✅ Agent stopped\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Test completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
runSimpleTest();
