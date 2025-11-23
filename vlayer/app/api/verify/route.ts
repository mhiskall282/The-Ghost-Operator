import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/verify
 *
 * Verifies a cryptographic proof (presentation) from vlayer Web Prover
 *
 * Request body: The entire presentation object from /api/prove
 *
 * Returns: Verification result with the proven data
 */
export async function POST(request: NextRequest) {
  try {
    const presentation = await request.json();

    if (!presentation) {
      return NextResponse.json(
        { error: "Presentation is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Verifying proof...");

    // Call vlayer Web Prover API to verify
    const response = await fetch(
      "https://web-prover.vlayer.xyz/api/v1/verify",
      {
        method: "POST",
        headers: {
          "x-client-id": process.env.WEB_PROVER_API_CLIENT_ID || "",
          Authorization: "Bearer " + process.env.WEB_PROVER_API_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presentation),
        signal: AbortSignal.timeout(85000), // Abort before Vercel timeout
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ vlayer verify API error:", error);
      return NextResponse.json(
        { error: "Failed to verify proof", details: error },
        { status: response.status }
      );
    }

    const verificationResult = await response.json();
    console.log("✅ Proof verified successfully");

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error("❌ Verification error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
