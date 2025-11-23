#!/usr/bin/env node

/**
 * Comprehensive Test Suite for vlayer Web Prover Integration
 * Tests both PR creation and merge verification with detailed output
 */

import {
  provePRCreationServer,
  provePRMergeServer,
} from "./lib/helpers/pr-verifier.js";

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  const line = "=".repeat(60);
  log(`\n${line}`, "cyan");
  log(message, "bright");
  log(line, "cyan");
}

function section(message) {
  log(`\n${"─".repeat(60)}`, "blue");
  log(message, "blue");
  log("─".repeat(60), "blue");
}

async function testPRCreation(owner, repo, prNumber) {
  section(`TEST 1: PR Creation Verification`);
  log(`📋 Repository: ${owner}/${repo}`, "yellow");
  log(`📌 PR Number: #${prNumber}`, "yellow");
  log(`⏳ Generating proof... (30-60 seconds)\n`, "yellow");

  const startTime = Date.now();

  try {
    const result = await provePRCreationServer(owner, repo, prNumber);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (result && result.prNumber) {
      log("✅ SUCCESS: PR Creation Verified!", "green");
      log(`   Duration: ${duration}s`, "green");
      log(`   PR #${result.prNumber}`, "bright");
      log(`   Title: ${result.title}`, "bright");
      log(`   Author: ${result.author}`, "bright");
      log(`   Created: ${result.createdAt}`, "bright");
      log(`   State: ${result.state}`, "bright");
      log(`   URL: ${result.htmlUrl}`, "bright");
      log(`   Proof ID: ${result.proofId || "N/A"}`, "bright");
      return true;
    } else {
      throw new Error("Invalid result structure");
    }
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`❌ FAILED: PR Creation Verification (${duration}s)`, "red");
    log(`   Error: ${error.message}`, "red");
    if (error.stack) {
      log(`\n${error.stack}`, "red");
    }
    return false;
  }
}

async function testPRMerge(owner, repo, prNumber) {
  section(`TEST 2: PR Merge Verification`);
  log(`📋 Repository: ${owner}/${repo}`, "yellow");
  log(`📌 PR Number: #${prNumber}`, "yellow");
  log(`⏳ Generating proof... (30-60 seconds)\n`, "yellow");

  const startTime = Date.now();

  try {
    const result = await provePRMergeServer(owner, repo, prNumber);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (result && result.prNumber) {
      log("✅ SUCCESS: PR Merge Verified!", "green");
      log(`   Duration: ${duration}s`, "green");
      log(`   PR #${result.prNumber}`, "bright");
      log(`   Merged: ${result.merged ? "Yes" : "No"}`, "bright");
      log(`   Merged By: ${result.mergedBy}`, "bright");
      log(`   Merged At: ${result.mergedAt}`, "bright");
      log(`   Proof ID: ${result.proofId || "N/A"}`, "bright");
      return true;
    } else {
      throw new Error("Invalid result structure");
    }
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`❌ FAILED: PR Merge Verification (${duration}s)`, "red");
    log(`   Error: ${error.message}`, "red");
    if (error.stack) {
      log(`\n${error.stack}`, "red");
    }
    return false;
  }
}

async function checkEnvironment() {
  section("Environment Check");

  const checks = [
    {
      name: "WEB_PROVER_API_CLIENT_ID",
      value: process.env.WEB_PROVER_API_CLIENT_ID,
    },
    { name: "WEB_PROVER_API_SECRET", value: process.env.WEB_PROVER_API_SECRET },
  ];

  let allPassed = true;
  for (const check of checks) {
    if (check.value) {
      log(`✅ ${check.name}: Set`, "green");
    } else {
      log(`❌ ${check.name}: Missing`, "red");
      allPassed = false;
    }
  }

  if (!allPassed) {
    log("\n⚠️  Missing environment variables!", "red");
    log("   Make sure .env file exists with:", "yellow");
    log("   - WEB_PROVER_API_CLIENT_ID", "yellow");
    log("   - WEB_PROVER_API_SECRET", "yellow");
    return false;
  }

  return true;
}

async function main() {
  header("🧪 vlayer Web Prover - Comprehensive Test Suite");

  log("Testing PR verification with cryptographic proofs", "cyan");
  log("Using: microsoft/vscode#200000 (known merged PR)\n", "cyan");

  // Check environment first
  const envOk = await checkEnvironment();
  if (!envOk) {
    process.exit(1);
  }

  // Test data
  const owner = "microsoft";
  const repo = "vscode";
  const prNumber = 200000;

  // Run tests
  const test1Passed = await testPRCreation(owner, repo, prNumber);
  const test2Passed = await testPRMerge(owner, repo, prNumber);

  // Summary
  header("📊 Test Summary");

  const results = [
    { name: "PR Creation Verification", passed: test1Passed },
    { name: "PR Merge Verification", passed: test2Passed },
  ];

  let totalPassed = 0;
  let totalTests = results.length;

  results.forEach((result, index) => {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    const color = result.passed ? "green" : "red";
    log(`${index + 1}. ${result.name}: ${status}`, color);
    if (result.passed) totalPassed++;
  });

  const percentage = Math.round((totalPassed / totalTests) * 100);
  log(
    `\nTests Passed: ${totalPassed}/${totalTests} (${percentage}%)`,
    percentage === 100 ? "green" : "yellow"
  );

  if (percentage === 100) {
    log("\n🎉 All tests passed! System is ready for deployment.", "green");
  } else {
    log("\n⚠️  Some tests failed. Please check the errors above.", "yellow");
  }

  log("\n");
  process.exit(percentage === 100 ? 0 : 1);
}

// Run tests
main().catch((error) => {
  log("\n💥 FATAL ERROR:", "red");
  log(error.message, "red");
  if (error.stack) {
    log(error.stack, "red");
  }
  process.exit(1);
});
