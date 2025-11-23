/**
 * GitHub Pull Request Verification Helpers
 *
 * These functions help verify GitHub PR creation and merge events
 * using vlayer's Web Prover API for cryptographic proofs.
 */

export interface PRCreationProof {
  prNumber: number;
  title: string;
  author: string;
  createdAt: string;
  state: string;
  htmlUrl: string;
  verified: boolean;
  proofId?: string;
}

export interface PRMergeProof {
  prNumber: number;
  merged: boolean;
  mergedBy: string | null;
  mergedAt: string | null;
  verified: boolean;
  proofId?: string;
}

/**
 * Proves that a pull request was created by a specific user
 *
 * @param owner - Repository owner (e.g., "microsoft")
 * @param repo - Repository name (e.g., "vscode")
 * @param prNumber - Pull request number
 * @param githubToken - Optional GitHub Personal Access Token for private repos
 * @returns Proof of PR creation with verification status
 */
export async function provePRCreation(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<PRCreationProof | null> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    // Build headers
    const headers = [
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept: application/vnd.github+json",
      "X-GitHub-Api-Version: 2022-11-28",
    ];

    if (githubToken) {
      headers.push(`Authorization: Bearer ${githubToken}`);
    }

    console.log(`🔐 Proving PR creation: ${owner}/${repo}#${prNumber}`);

    // Step 1: Generate proof
    const proveResponse = await fetch("/api/prove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, headers }),
    });

    if (!proveResponse.ok) {
      console.error("❌ Failed to generate proof");
      return null;
    }

    const presentation = await proveResponse.json();

    // Step 2: Verify proof
    const verifyResponse = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(presentation),
    });

    if (!verifyResponse.ok) {
      console.error("❌ Failed to verify proof");
      return null;
    }

    const verificationResult = await verifyResponse.json();

    // Step 3: Parse PR data from verified response
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
    console.error("❌ Error proving PR creation:", error);
    return null;
  }
}

/**
 * Proves that a pull request was merged
 *
 * @param owner - Repository owner (e.g., "microsoft")
 * @param repo - Repository name (e.g., "vscode")
 * @param prNumber - Pull request number
 * @param githubToken - Optional GitHub Personal Access Token for private repos
 * @returns Proof of PR merge with verification status
 */
export async function provePRMerge(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<PRMergeProof | null> {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    // Build headers
    const headers = [
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept: application/vnd.github+json",
      "X-GitHub-Api-Version: 2022-11-28",
    ];

    if (githubToken) {
      headers.push(`Authorization: Bearer ${githubToken}`);
    }

    console.log(`🔐 Proving PR merge: ${owner}/${repo}#${prNumber}`);

    // Step 1: Generate proof
    const proveResponse = await fetch("/api/prove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, headers }),
    });

    if (!proveResponse.ok) {
      console.error("❌ Failed to generate proof");
      return null;
    }

    const presentation = await proveResponse.json();

    // Step 2: Verify proof
    const verifyResponse = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(presentation),
    });

    if (!verifyResponse.ok) {
      console.error("❌ Failed to verify proof");
      return null;
    }

    const verificationResult = await verifyResponse.json();

    // Step 3: Parse PR data from verified response
    const prData = JSON.parse(verificationResult.response.body);

    // Check if PR is actually merged
    if (!prData.merged) {
      console.log(`⚠️ PR #${prNumber} is not merged yet`);
      return {
        prNumber: prData.number,
        merged: false,
        mergedBy: null,
        mergedAt: null,
        verified: true,
        proofId: presentation.id || "unknown",
      };
    }

    console.log(
      `✅ Verified PR merge: #${prData.number} merged by ${
        prData.merged_by?.login || "unknown"
      }`
    );

    return {
      prNumber: prData.number,
      merged: true,
      mergedBy: prData.merged_by?.login || null,
      mergedAt: prData.merged_at,
      verified: true,
      proofId: presentation.id || "unknown",
    };
  } catch (error) {
    console.error("❌ Error proving PR merge:", error);
    return null;
  }
}

/**
 * Server-side version of provePRCreation for use in API routes
 * Uses environment variables for API credentials
 */
export async function provePRCreationServer(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<PRCreationProof | null> {
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
      return null;
    }

    const presentation = await proveResponse.json();

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
      return null;
    }

    const verificationResult = await verifyResponse.json();
    const prData = JSON.parse(verificationResult.response.body);

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
 * Server-side version of provePRMerge for use in API routes
 */
export async function provePRMergeServer(
  owner: string,
  repo: string,
  prNumber: number,
  githubToken?: string
): Promise<PRMergeProof | null> {
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
      return null;
    }

    const presentation = await proveResponse.json();

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
      return null;
    }

    const verificationResult = await verifyResponse.json();
    const prData = JSON.parse(verificationResult.response.body);

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
