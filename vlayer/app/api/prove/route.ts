import { NextRequest, NextResponse } from "next/server";

// Extend timeout for proof generation
export const maxDuration = 160;

/**
 * POST /api/prove
 *
 * Generates a cryptographic proof for a GitHub API URL using vlayer Web Prover
 *
 * Request body:
 * - url: GitHub API URL to prove (e.g., https://api.github.com/repos/owner/repo/pulls/123)
 * - headers: Optional array of HTTP headers (e.g., authorization tokens)
 *
 * Returns: Presentation object containing the proof
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate GitHub API URL
    if (!body.url.startsWith("https://api.github.com/")) {
      return NextResponse.json(
        { error: "URL must be a GitHub API endpoint" },
        { status: 400 }
      );
    }

    // Default headers for GitHub API
    const defaultHeaders = [
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept: application/vnd.github+json",
      "X-GitHub-Api-Version: 2022-11-28",
    ];

    const requestBody = {
      url: body.url,
      headers: body.headers || defaultHeaders,
    };

    console.log("🔐 Generating proof for:", body.url);

    // Call vlayer Web Prover API
    const response = await fetch("https://web-prover.vlayer.xyz/api/v1/prove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
        Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ vlayer API error:", error);
      return NextResponse.json(
        { error: "Failed to generate proof", details: error },
        { status: response.status }
      );
    }

    const presentation = await response.json();
    console.log("✅ Proof generated successfully");

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("❌ Proof generation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
