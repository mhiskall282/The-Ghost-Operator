import type { Bounty } from "./types";

/**
 * In-memory bounty store
 * TODO: Replace with SQD indexer integration
 */
export class BountyStore {
  private bounties: Map<string, Bounty> = new Map();

  constructor() {
    this.initializeSampleBounties();
  }

  private initializeSampleBounties() {
    const sampleBounties: Bounty[] = [
      {
        id: "bounty-001",
        title: "Star the GhostBot Repository",
        description: "Star the ghost-op/core repository on GitHub",
        reward: "5 USDC",
        rewardAmount: 5,
        taskType: "star",
        githubUrl: "https://github.com/ghost-op/core",
        vlayerProofUrl:
          "https://prover.vlayer.xyz/prove/star?repo=ghost-op/core",
        status: "active",
      },
      {
        id: "bounty-002",
        title: "Merge PR #42",
        description: "Review and merge pull request #42 in the main repository",
        reward: "25 USDC",
        rewardAmount: 25,
        taskType: "pr",
        githubUrl: "https://github.com/ghost-op/core/pull/42",
        vlayerProofUrl: "https://prover.vlayer.xyz/prove/pr-merged?pr=42",
        status: "active",
      },
      {
        id: "bounty-003",
        title: "Comment on Issue #17",
        description: "Provide a helpful comment on issue #17",
        reward: "3 USDC",
        rewardAmount: 3,
        taskType: "comment",
        githubUrl: "https://github.com/ghost-op/core/issues/17",
        vlayerProofUrl: "https://prover.vlayer.xyz/prove/comment?issue=17",
        status: "active",
      },
    ];

    sampleBounties.forEach((bounty) => {
      this.bounties.set(bounty.id, bounty);
    });
  }

  getActiveBounties(): Bounty[] {
    return Array.from(this.bounties.values()).filter(
      (b) => b.status === "active"
    );
  }

  getBountyById(id: string): Bounty | undefined {
    return this.bounties.get(id);
  }

  claimBounty(id: string, userAddress: string): boolean {
    const bounty = this.bounties.get(id);
    if (bounty && bounty.status === "active") {
      bounty.status = "claimed";
      bounty.claimedBy = userAddress;
      return true;
    }
    return false;
  }

  completeBounty(id: string): boolean {
    const bounty = this.bounties.get(id);
    if (bounty && bounty.status === "claimed") {
      bounty.status = "completed";
      return true;
    }
    return false;
  }

  addBounty(bounty: Bounty): void {
    this.bounties.set(bounty.id, bounty);
  }
}
