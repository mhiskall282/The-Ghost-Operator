export const GHOST_BOUNTY_CONTRACT =
  "0x0000000000000000000000000000000000000000"; // TODO: Replace with actual contract address

// Event signatures for the bounty contract
export const ABI = [
  // Payment event emitted when a bounty is paid
  "event PaymentProcessed(address indexed worker, uint256 amount, address indexed token, string proofId, uint8 taskType, string taskDescription)",

  // Bounty created event
  "event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 amount, address token, uint8 taskType, string description)",

  // Bounty claimed event
  "event BountyClaimed(uint256 indexed bountyId, address indexed worker, string proofId)",

  // Contract deployment
  "event ContractDeployed(address indexed owner, uint256 timestamp)",
];

// Task types enum matching the smart contract
export enum TaskType {
  STAR_REPO = 0,
  MERGE_PR = 1,
  OPEN_ISSUE = 2,
  COMMENT = 3,
  CUSTOM = 4,
}

// Payment status enum
export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Common token addresses on Polygon
export const TOKENS = {
  USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
};
