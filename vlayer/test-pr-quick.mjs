#!/usr/bin/env node

/**
 * Quick test script for PR verification with a real merged PR
 *
 * This tests with a known merged PR from microsoft/vscode
 */

import {
  provePRCreationServer,
  provePRMergeServer,
} from "./lib/helpers/pr-verifier.js";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function quickTest() {
  console.log("\n" + "=".repeat(60));
  log("cyan", "🚀 Quick PR Verification Test");
  console.log("=".repeat(60) + "\n");

  // Check credentials
  const clientId = process.env.WEB_PROVER_API_CLIENT_ID;
  const apiSecret = process.env.WEB_PROVER_API_SECRET;

  if (!clientId || !apiSecret) {
    log("red", "❌ Missing vlayer API credentials in .env file");
    process.exit(1);
  }

  // Test with a real merged PR from microsoft/vscode
  const owner = "microsoft";
  const repo = "vscode";
  const prNumber = 200000; // A merged PR

  log("yellow", `Testing with: ${owner}/${repo}#${prNumber}`);
  console.log("");

  // Test PR Creation
  log("cyan", "📋 Testing PR Creation Verification...");
  console.log("⏳ Please wait 30-60 seconds...\n");

  try {
    const proof = await provePRCreationServer(owner, repo, prNumber);

    if (proof?.verified) {
      log("green", "✅ SUCCESS: PR Creation Verified!");
      console.log(`   Title: ${proof.title}`);
      console.log(`   Author: ${proof.author}`);
      console.log(`   Proof ID: ${proof.proofId}`);
    } else {
      log("red", "❌ FAILED: Could not verify PR creation");
    }
  } catch (error) {
    log("red", `❌ ERROR: ${error.message}`);
  }

  console.log("\n" + "-".repeat(60) + "\n");

  // Test PR Merge
  log("cyan", "📋 Testing PR Merge Verification...");
  console.log("⏳ Please wait 30-60 seconds...\n");

  try {
    const mergeProof = await provePRMergeServer(owner, repo, prNumber);

    if (mergeProof?.verified && mergeProof.merged) {
      log("green", "✅ SUCCESS: PR Merge Verified!");
      console.log(`   Merged by: ${mergeProof.mergedBy}`);
      console.log(`   Merged at: ${mergeProof.mergedAt}`);
      console.log(`   Proof ID: ${mergeProof.proofId}`);
    } else if (mergeProof?.verified && !mergeProof.merged) {
      log("yellow", "⚠️  PR is not merged (but verification works)");
    } else {
      log("red", "❌ FAILED: Could not verify PR merge");
    }
  } catch (error) {
    log("red", `❌ ERROR: ${error.message}`);
  }

  console.log("\n" + "=".repeat(60));
  log("cyan", "🎉 Test Complete!");
  console.log("=".repeat(60) + "\n");
}

quickTest().catch(console.error);
