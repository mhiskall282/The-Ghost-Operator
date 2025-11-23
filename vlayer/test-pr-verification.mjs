#!/usr/bin/env node

/**
 * Test script for PR Creation and Merge verification
 *
 * Tests the two main functions:
 * 1. provePRCreationServer() - Verifies PR was created
 * 2. provePRMergeServer() - Verifies PR was merged
 *
 * Usage:
 *   node test-pr-verification.mjs <owner> <repo> <pr-number> [github-token]
 *
 * Example:
 *   node test-pr-verification.mjs microsoft vscode 200000
 */

import {
  provePRCreationServer,
  provePRMergeServer,
} from "./lib/helpers/pr-verifier.js";

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testPRVerification(owner, repo, prNumber, githubToken) {
  console.log("\n" + "=".repeat(60));
  log("cyan", "🔐 Testing PR Verification Functions");
  console.log("=".repeat(60) + "\n");

  log("blue", `Repository: ${owner}/${repo}`);
  log("blue", `PR Number: #${prNumber}`);
  console.log("");

  // Test 1: PR Creation Verification
  log("yellow", "📋 Test 1: Verifying PR Creation...");
  console.log("⏳ This may take 30-60 seconds...\n");

  try {
    const startTime = Date.now();
    const creationProof = await provePRCreationServer(
      owner,
      repo,
      prNumber,
      githubToken
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    if (creationProof && creationProof.verified) {
      log("green", "✅ PR Creation Verified!");
      console.log(`   PR #${creationProof.prNumber}: ${creationProof.title}`);
      console.log(`   Created by: ${creationProof.author}`);
      console.log(
        `   Created at: ${new Date(creationProof.createdAt).toLocaleString()}`
      );
      console.log(`   State: ${creationProof.state}`);
      console.log(`   URL: ${creationProof.htmlUrl}`);
      console.log(`   Proof ID: ${creationProof.proofId}`);
      console.log(`   Duration: ${duration}s`);
    } else {
      log("red", "❌ PR Creation Verification Failed");
      console.log("   Proof was not generated or verified");
    }
  } catch (error) {
    log("red", "❌ Error during PR creation verification:");
    console.error(`   ${error.message}`);
  }

  console.log("\n" + "-".repeat(60) + "\n");

  // Test 2: PR Merge Verification
  log("yellow", "📋 Test 2: Verifying PR Merge...");
  console.log("⏳ This may take 30-60 seconds...\n");

  try {
    const startTime = Date.now();
    const mergeProof = await provePRMergeServer(
      owner,
      repo,
      prNumber,
      githubToken
    );
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    if (mergeProof && mergeProof.verified) {
      if (mergeProof.merged) {
        log("green", "✅ PR Merge Verified!");
        console.log(`   PR #${mergeProof.prNumber} is MERGED`);
        console.log(`   Merged by: ${mergeProof.mergedBy}`);
        console.log(
          `   Merged at: ${new Date(mergeProof.mergedAt).toLocaleString()}`
        );
        console.log(`   Proof ID: ${mergeProof.proofId}`);
        console.log(`   Duration: ${duration}s`);
      } else {
        log("yellow", "⚠️  PR is NOT merged yet");
        console.log(
          `   PR #${mergeProof.prNumber} is still open or closed (not merged)`
        );
        console.log(`   Proof ID: ${mergeProof.proofId}`);
        console.log(`   Duration: ${duration}s`);
      }
    } else {
      log("red", "❌ PR Merge Verification Failed");
      console.log("   Proof was not generated or verified");
    }
  } catch (error) {
    log("red", "❌ Error during PR merge verification:");
    console.error(`   ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));
  log("cyan", "🎉 Test Complete!");
  console.log("=".repeat(60) + "\n");
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error(
      "\n❌ Usage: node test-pr-verification.mjs <owner> <repo> <pr-number> [github-token]\n"
    );
    console.error("Example:");
    console.error("  node test-pr-verification.mjs microsoft vscode 200000\n");
    console.error("For private repos:");
    console.error(
      "  node test-pr-verification.mjs owner repo 123 ghp_yourtoken\n"
    );
    process.exit(1);
  }

  const [owner, repo, prNumberStr, githubToken] = args;
  const prNumber = parseInt(prNumberStr, 10);

  if (isNaN(prNumber) || prNumber <= 0) {
    console.error("\n❌ Error: PR number must be a positive integer\n");
    process.exit(1);
  }

  // Check environment variables
  const clientId = process.env.WEB_PROVER_API_CLIENT_ID;
  const apiSecret = process.env.WEB_PROVER_API_SECRET;

  if (!clientId || !apiSecret) {
    log("red", "\n❌ Missing vlayer API credentials!");
    console.error("Set environment variables:");
    console.error("  WEB_PROVER_API_CLIENT_ID");
    console.error("  WEB_PROVER_API_SECRET\n");
    process.exit(1);
  }

  log("green", "✅ vlayer credentials found");

  await testPRVerification(owner, repo, prNumber, githubToken);
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
