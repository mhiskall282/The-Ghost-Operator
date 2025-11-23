/**
 * GitHub Pull Request Verification Helpers (JavaScript)
 *
 * Server-side functions to verify PR creation and merge using vlayer Web Prover API
 */

/**
 * Proves that a pull request was created by a specific user
 */
export async function provePRCreationServer(
  owner,
  repo,
  prNumber,
  githubToken
) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    const headers = [
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Accept: application/vnd.github+json",
      "X-GitHub-Api-Version: 2022-11-28",
    ];

    if (githubToken) {
      headers.push(`Authorization: Bearer ${githubToken}`);
    }

    console.log(`🔐 Proving PR creation: ${owner}/${repo}#${prNumber}`);

    // Direct API call to vlayer (server-side)
    const proveResponse = await fetch(
      "https://web-prover.vlayer.xyz/api/v1/prove",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
          Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
        },
        body: JSON.stringify({ url, headers }),
      }
    );

    if (!proveResponse.ok) {
      const errorText = await proveResponse.text();
      console.error("❌ Proof generation failed:", errorText);
      return null;
    }

    const presentation = await proveResponse.json();
    console.log("✅ Proof generated, now verifying...");

    // Verify the proof
    const verifyResponse = await fetch(
      "https://web-prover.vlayer.xyz/api/v1/verify",
      {
        method: "POST",
        headers: {
          "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
          Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presentation),
      }
    );

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("❌ Proof verification failed:", errorText);
      return null;
    }

    const verificationResult = await verifyResponse.json();
    const prData = JSON.parse(verificationResult.response.body);

    console.log(
      `✅ Verified PR creation: #${prData.number} by ${prData.user.login}`
    );

    return {
      prNumber: prData.number,
      title: prData.title,
      author: prData.user.login,
      createdAt: prData.created_at,
      state: prData.state,
      htmlUrl: prData.html_url,
      verified: true,
      proofId: presentation.id || "unknown",
    };
  } catch (error) {
    console.error("❌ Error in server-side PR creation proof:", error);
    return null;
  }
}

/**
 * Proves that a pull request was merged
 */
export async function provePRMergeServer(owner, repo, prNumber, githubToken) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    const headers = [
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Accept: application/vnd.github+json",
      "X-GitHub-Api-Version: 2022-11-28",
    ];

    if (githubToken) {
      headers.push(`Authorization: Bearer ${githubToken}`);
    }

    console.log(`🔐 Proving PR merge: ${owner}/${repo}#${prNumber}`);

    // Direct API call to vlayer (server-side)
    const proveResponse = await fetch(
      "https://web-prover.vlayer.xyz/api/v1/prove",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
          Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
        },
        body: JSON.stringify({ url, headers }),
      }
    );

    if (!proveResponse.ok) {
      const errorText = await proveResponse.text();
      console.error("❌ Proof generation failed:", errorText);
      return null;
    }

    const presentation = await proveResponse.json();
    console.log("✅ Proof generated, now verifying...");

    // Verify the proof
    const verifyResponse = await fetch(
      "https://web-prover.vlayer.xyz/api/v1/verify",
      {
        method: "POST",
        headers: {
          "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
          Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presentation),
      }
    );

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("❌ Proof verification failed:", errorText);
      return null;
    }

    const verificationResult = await verifyResponse.json();
    const prData = JSON.parse(verificationResult.response.body);

    if (!prData.merged) {
      console.log(`⚠️ PR #${prNumber} is not merged yet`);
    } else {
      console.log(
        `✅ Verified PR merge: #${prData.number} merged by ${
          prData.merged_by?.login || "unknown"
        }`
      );
    }

    return {
      prNumber: prData.number,
      merged: prData.merged || false,
      mergedBy: prData.merged_by?.login || null,
      mergedAt: prData.merged_at || null,
      verified: true,
      proofId: presentation.id || "unknown",
    };
  } catch (error) {
    console.error("❌ Error in server-side PR merge proof:", error);
    return null;
  }
}
