/**
 * Bounty Types
 */
export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string; // e.g., "5 USDC"
  rewardAmount: number; // numeric value
  taskType: "star" | "pr" | "issue" | "follow" | "comment";
  githubUrl: string;
  vlayerProofUrl?: string; // URL to generate the proof
  status: "active" | "claimed" | "completed";
  claimedBy?: string; // wallet address
}

/**
 * Proof Submission
 */
export interface ProofSubmission {
  proofId: string;
  bountyId: string;
  userAddress: string;
  timestamp: number;
}

/**
 * Agent State
 */
export interface AgentState {
  activeBounties: Map<string, Bounty>;
  claimedBounties: Map<string, ProofSubmission>;
  userSessions: Map<string, UserSession>;
}

export interface UserSession {
  address: string;
  lastInteraction: number;
  pendingBounty?: string;
}

/**
 * Integration responses
 */
export interface VerificationResult {
  valid: boolean;
  taskType?: string;
  githubUrl?: string;
  error?: string;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}
