import type { VerificationResult, PaymentResult } from "./types";

/**
 * PR Verification Types
 */
interface PRCreationProof {
  prNumber: number;
  title: string;
  author: string;
  createdAt: string;
  state: string;
  htmlUrl: string;
  verified: boolean;
  proofId?: string;
}

interface PRMergeProof {
  prNumber: number;
  merged: boolean;
  mergedBy: string | null;
  mergedAt: string | null;
  verified: boolean;
  proofId?: string;
}

/**
 * vlayer Integration
 * Handles ZK-TLS proof verification for GitHub PRs
 */
export class VlayerService {
  private apiBaseUrl: string;
  private clientId: string;
  private apiSecret: string;

  constructor(apiBaseUrl: string, clientId?: string, apiSecret?: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.clientId = clientId || process.env.WEB_PROVER_API_CLIENT_ID || "";
    this.apiSecret = apiSecret || process.env.WEB_PROVER_API_SECRET || "";
  }

  /**
   * Verify that a PR was created by a user
   */
  async verifyPRCreation(
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

      console.log(`🔐 Verifying PR creation: ${owner}/${repo}#${prNumber}`);

      // Generate proof
      const proveResponse = await fetch(
        "https://web-prover.vlayer.xyz/api/v1/prove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": this.clientId,
            Authorization: "Bearer " + this.apiSecret,
          },
          body: JSON.stringify({ url, headers }),
        }
      );

      if (!proveResponse.ok) {
        console.error("❌ Failed to generate proof");
        return null;
      }

      const presentation = await proveResponse.json();

      // Verify proof
      const verifyResponse = await fetch(
        "https://web-prover.vlayer.xyz/api/v1/verify",
        {
          method: "POST",
          headers: {
            "x-client-id": this.clientId,
            Authorization: "Bearer " + this.apiSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(presentation),
        }
      );

      if (!verifyResponse.ok) {
        console.error("❌ Failed to verify proof");
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
      console.error("❌ Error verifying PR creation:", error);
      return null;
    }
  }

  /**
   * Verify that a PR was merged
   */
  async verifyPRMerge(
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

      console.log(`🔐 Verifying PR merge: ${owner}/${repo}#${prNumber}`);

      // Generate proof
      const proveResponse = await fetch(
        "https://web-prover.vlayer.xyz/api/v1/prove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": this.clientId,
            Authorization: "Bearer " + this.apiSecret,
          },
          body: JSON.stringify({ url, headers }),
        }
      );

      if (!proveResponse.ok) {
        console.error("❌ Failed to generate proof");
        return null;
      }

      const presentation = await proveResponse.json();

      // Verify proof
      const verifyResponse = await fetch(
        "https://web-prover.vlayer.xyz/api/v1/verify",
        {
          method: "POST",
          headers: {
            "x-client-id": this.clientId,
            Authorization: "Bearer " + this.apiSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(presentation),
        }
      );

      if (!verifyResponse.ok) {
        console.error("❌ Failed to verify proof");
        return null;
      }

      const verificationResult = await verifyResponse.json();
      const prData = JSON.parse(verificationResult.response.body);

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
      console.error("❌ Error verifying PR merge:", error);
      return null;
    }
  }

  /**
   * Get the proof generation URL for a specific task
   */
  getProofUrl(taskType: string, params: Record<string, string>): string {
    const queryParams = new URLSearchParams(params).toString();
    return `${this.apiBaseUrl}/prove/${taskType}?${queryParams}`;
  }

  /**
   * Verify a proof directly with vlayer
   */
  async verifyProofDirect(proofId: string): Promise<boolean> {
    console.log(`[vlayer] Verifying proof ${proofId}`);

    try {
      const response = await fetch(
        "https://web-prover.vlayer.xyz/api/v1/verify",
        {
          method: "POST",
          headers: {
            "x-client-id": this.clientId,
            Authorization: "Bearer " + this.apiSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: proofId }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("❌ Error verifying proof:", error);
      return false;
    }
  }
}

/**
 * Fluence Integration
 * Placeholder for decentralized compute verification
 */
export class FluenceService {
  private peerUrl: string;
  private serviceId: string;

  constructor(peerUrl: string, serviceId: string) {
    this.peerUrl = peerUrl;
    this.serviceId = serviceId;
  }

  /**
   * Verify a ZK proof via Fluence compute network
   * TODO: Implement actual Fluence Marine service call
   */
  async verifyProof(
    proofId: string,
    bountyId: string
  ): Promise<VerificationResult> {
    console.log(`[Fluence] Verifying proof ${proofId} for bounty ${bountyId}`);

    // Placeholder: Simulate verification
    // In production, this would call a Fluence Marine service
    // that interacts with vlayer's verifier contract

    try {
      // Simulated delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock verification (90% success rate for demo)
      const isValid = Math.random() > 0.1;

      if (isValid) {
        return {
          valid: true,
          taskType: "star",
          githubUrl: "https://github.com/ghost-op/core",
        };
      } else {
        return {
          valid: false,
          error: "Invalid proof or task not completed",
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${error}`,
      };
    }
  }
}

/**
 * Polygon Payment Service
 * Handles smart contract interactions for payments
 */
export class PolygonService {
  private rpcUrl: string;
  private contractAddress: string;

  constructor(rpcUrl: string, contractAddress: string) {
    this.rpcUrl = rpcUrl;
    this.contractAddress = contractAddress;
  }

  /**
   * Release payment to a user
   * TODO: Implement actual smart contract call
   */
  async releasePayment(
    userAddress: string,
    amount: number,
    bountyId: string
  ): Promise<PaymentResult> {
    console.log(
      `[Polygon] Releasing ${amount} USDC to ${userAddress} for bounty ${bountyId}`
    );

    try {
      // Placeholder: Simulate transaction
      // In production, this would:
      // 1. Connect to Polygon network
      // 2. Call smart contract's releaseBounty() function
      // 3. Return transaction hash

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;

      return {
        success: true,
        txHash: mockTxHash,
      };
    } catch (error) {
      return {
        success: false,
        error: `Payment failed: ${error}`,
      };
    }
  }

  /**
   * Get payment history for a user
   * TODO: Integrate with SQD indexer
   */
  async getPaymentHistory(userAddress: string): Promise<any[]> {
    console.log(`[Polygon] Fetching payment history for ${userAddress}`);

    // Placeholder: Would query SQD indexer
    return [];
  }
}
