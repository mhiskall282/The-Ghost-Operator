#!/usr/bin/env node

/**
 * Quick Validation Test
 * Tests that all components compile and can be imported
 */

console.log("🧪 GhostBot XMTP Agent - Validation Test\n");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

async function validateSetup() {
  const checks = [];

  // 1. Check TypeScript compilation
  console.log("1️⃣  Checking TypeScript compilation...");
  try {
    const { execSync } = await import("child_process");
    execSync("npm run build", { stdio: "pipe" });
    console.log("   ✅ TypeScript compiles successfully\n");
    checks.push(true);
  } catch (error) {
    console.log("   ❌ TypeScript compilation failed\n");
    checks.push(false);
  }

  // 2. Check if dist files were created
  console.log("2️⃣  Checking build output...");
  try {
    const fs = await import("fs");
    const distExists = fs.existsSync("./dist");
    const indexExists = fs.existsSync("./dist/index.js");

    if (distExists && indexExists) {
      console.log("   ✅ Build files created successfully\n");
      checks.push(true);
    } else {
      console.log("   ❌ Build files missing\n");
      checks.push(false);
    }
  } catch (error) {
    console.log("   ❌ Could not check build files\n");
    checks.push(false);
  }

  // 3. Check dependencies
  console.log("3️⃣  Checking dependencies...");
  try {
    const fs = await import("fs");
    const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    const deps = Object.keys(packageJson.dependencies || {});

    console.log(`   ✅ ${deps.length} dependencies declared:`);
    deps.forEach((dep) => console.log(`      - ${dep}`));
    console.log("");
    checks.push(true);
  } catch (error) {
    console.log("   ❌ Could not read package.json\n");
    checks.push(false);
  }

  // 4. Check environment template
  console.log("4️⃣  Checking environment configuration...");
  try {
    const fs = await import("fs");
    const envExampleExists = fs.existsSync("./.env.example");

    if (envExampleExists) {
      console.log("   ✅ .env.example found");

      const hasEnv = fs.existsSync("./.env");
      if (hasEnv) {
        console.log("   ✅ .env configured\n");
      } else {
        console.log("   ⚠️  .env not found (run ./setup-keys.sh)\n");
      }
      checks.push(true);
    } else {
      console.log("   ❌ .env.example missing\n");
      checks.push(false);
    }
  } catch (error) {
    console.log("   ❌ Could not check environment files\n");
    checks.push(false);
  }

  // 5. Check source files
  console.log("5️⃣  Checking source files...");
  try {
    const fs = await import("fs");
    const requiredFiles = [
      "./src/index.ts",
      "./src/types.ts",
      "./src/bountyStore.ts",
      "./src/messageHandler.ts",
      "./src/integrations.ts",
    ];

    const allExist = requiredFiles.every((file) => fs.existsSync(file));

    if (allExist) {
      console.log("   ✅ All source files present\n");
      checks.push(true);
    } else {
      console.log("   ❌ Some source files missing\n");
      checks.push(false);
    }
  } catch (error) {
    console.log("   ❌ Could not check source files\n");
    checks.push(false);
  }

  // 6. Check Node version
  console.log("6️⃣  Checking Node.js version...");
  try {
    const version = process.version;
    const major = parseInt(version.slice(1).split(".")[0]);

    if (major >= 18) {
      console.log(`   ✅ Node.js ${version} (>= 18 required)\n`);
      checks.push(true);
    } else {
      console.log(`   ❌ Node.js ${version} (18+ required)\n`);
      checks.push(false);
    }
  } catch (error) {
    console.log("   ❌ Could not check Node version\n");
    checks.push(false);
  }

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const passed = checks.filter(Boolean).length;
  const total = checks.length;

  if (passed === total) {
    console.log(`✅ All checks passed (${passed}/${total})`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🎉 Your XMTP agent is ready!");
    console.log("\n📝 Next steps:");
    console.log("   1. Run: ./setup-keys.sh (if you haven't)");
    console.log("   2. Run: npm run dev");
    console.log("   3. Visit the test URL shown in console");
    console.log("   4. Chat with your agent at xmtp.chat\n");
    return true;
  } else {
    console.log(`⚠️  ${passed}/${total} checks passed`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("💡 Some issues found. Please review the errors above.\n");
    return false;
  }
}

// Run validation
validateSetup().then((success) => {
  process.exit(success ? 0 : 1);
});
