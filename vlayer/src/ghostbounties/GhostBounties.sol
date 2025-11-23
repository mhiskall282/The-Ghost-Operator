// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {GitHubProver} from "./GitHubProver.sol";
import {GhostVault} from "./GhostVault.sol";

/**
 * @title GhostBounties
 * @notice Main contract for managing bounties and payouts
 * @dev Verifies ZK proofs and triggers payouts from the vault
 */
contract GhostBounties is Verifier, Ownable {
    GitHubProver public immutable githubProver;
    GhostVault public immutable vault;

    enum BountyStatus {
        Active,
        Completed,
        Cancelled
    }

    enum GitHubAction {
        Star,
        Fork,
        MergePR,
        Comment,
        OpenIssue
    }

    struct Bounty {
        uint256 id;
        address creator;
        GitHubAction action;
        string repoOwner;
        string repoName;
        uint256 prOrIssueNumber; // 0 if not applicable
        uint256 reward;
        BountyStatus status;
        address completedBy;
        uint256 createdAt;
        uint256 completedAt;
    }

    // Mapping from bountyId => Bounty
    mapping(uint256 => Bounty) public bounties;
    
    // Mapping from user => completed bounties count
    mapping(address => uint256) public completedBounties;
    
    // Mapping from user => total earnings
    mapping(address => uint256) public totalEarnings;
    
    // Mapping from (bountyId, user) => has claimed
    mapping(uint256 => mapping(address => bool)) public claimed;

    uint256 public nextBountyId = 1;

    event BountyCreated(
        uint256 indexed bountyId,
        address indexed creator,
        GitHubAction action,
        string repoOwner,
        string repoName,
        uint256 reward
    );
    
    event BountyCompleted(
        uint256 indexed bountyId,
        address indexed worker,
        uint256 reward
    );
    
    event BountyCancelled(uint256 indexed bountyId);

    constructor(
        address _githubProver,
        address _vault,
        address _owner
    ) Verifier() Ownable(_owner) {
        githubProver = GitHubProver(_githubProver);
        vault = GhostVault(_vault);
    }

    /**
     * @notice Create a new bounty
     * @param action The GitHub action required
     * @param repoOwner The repository owner
     * @param repoName The repository name
     * @param prOrIssueNumber The PR or issue number (0 if not applicable)
     * @param reward The reward amount in payment token
     */
    function createBounty(
        GitHubAction action,
        string calldata repoOwner,
        string calldata repoName,
        uint256 prOrIssueNumber,
        uint256 reward
    ) external returns (uint256 bountyId) {
        require(reward > 0, "Reward must be greater than 0");
        require(bytes(repoOwner).length > 0, "Repo owner required");
        require(bytes(repoName).length > 0, "Repo name required");

        bountyId = nextBountyId++;
        
        bounties[bountyId] = Bounty({
            id: bountyId,
            creator: msg.sender,
            action: action,
            repoOwner: repoOwner,
            repoName: repoName,
            prOrIssueNumber: prOrIssueNumber,
            reward: reward,
            status: BountyStatus.Active,
            completedBy: address(0),
            createdAt: block.timestamp,
            completedAt: 0
        });

        // Deposit funds into vault
        vault.deposit(bountyId, reward);

        emit BountyCreated(bountyId, msg.sender, action, repoOwner, repoName, reward);
    }

    /**
     * @notice Complete a bounty by submitting a ZK proof
     * @param bountyId The ID of the bounty
     * @param proof The ZK-TLS proof
     */
    function completeBounty(
        uint256 bountyId,
        Proof calldata proof
    ) external onlyVerified(address(githubProver), _getSelectorForAction(bountyId)) {
        Bounty storage bounty = bounties[bountyId];
        
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        require(!claimed[bountyId][msg.sender], "Already claimed");
        require(bounty.reward > 0, "Invalid bounty");

        // Mark as completed
        bounty.status = BountyStatus.Completed;
        bounty.completedBy = msg.sender;
        bounty.completedAt = block.timestamp;
        claimed[bountyId][msg.sender] = true;

        // Update worker stats
        completedBounties[msg.sender]++;
        totalEarnings[msg.sender] += bounty.reward;

        // Release funds from vault
        vault.release(bountyId, msg.sender, bounty.reward);

        emit BountyCompleted(bountyId, msg.sender, bounty.reward);
    }

    /**
     * @notice Cancel a bounty and refund the creator
     * @param bountyId The ID of the bounty
     */
    function cancelBounty(uint256 bountyId) external {
        Bounty storage bounty = bounties[bountyId];
        
        require(bounty.creator == msg.sender || msg.sender == owner(), "Not authorized");
        require(bounty.status == BountyStatus.Active, "Bounty not active");

        bounty.status = BountyStatus.Cancelled;

        // Refund to creator
        vault.refund(bountyId, bounty.creator, bounty.reward);

        emit BountyCancelled(bountyId);
    }

    /**
     * @notice Get bounty details
     * @param bountyId The ID of the bounty
     * @return The bounty struct
     */
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }

    /**
     * @notice Get worker stats
     * @param worker The worker address
     * @return completed The number of completed bounties
     * @return earnings The total earnings
     */
    function getWorkerStats(address worker) external view returns (uint256 completed, uint256 earnings) {
        return (completedBounties[worker], totalEarnings[worker]);
    }

    /**
     * @notice Get the function selector for the bounty action
     * @param bountyId The ID of the bounty
     * @return The function selector
     */
    function _getSelectorForAction(uint256 bountyId) private view returns (bytes4) {
        GitHubAction action = bounties[bountyId].action;
        
        if (action == GitHubAction.Star) {
            return GitHubProver.proveStar.selector;
        } else if (action == GitHubAction.Fork) {
            return GitHubProver.proveFork.selector;
        } else if (action == GitHubAction.MergePR) {
            return GitHubProver.proveMergePR.selector;
        } else if (action == GitHubAction.Comment) {
            return GitHubProver.proveComment.selector;
        } else if (action == GitHubAction.OpenIssue) {
            return GitHubProver.proveOpenIssue.selector;
        }
        
        revert("Invalid action");
    }
}

