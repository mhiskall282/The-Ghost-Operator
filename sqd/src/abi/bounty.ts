export const PaymentProcessedAbi = [
  {
    type: "event",
    name: "PaymentProcessed",
    inputs: [
      { name: "worker", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "token", type: "address", indexed: true },
      { name: "proofId", type: "string", indexed: false },
      { name: "taskType", type: "uint8", indexed: false },
      { name: "taskDescription", type: "string", indexed: false },
    ],
  },
];

export const BountyCreatedAbi = [
  {
    type: "event",
    name: "BountyCreated",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "token", type: "address", indexed: false },
      { name: "taskType", type: "uint8", indexed: false },
      { name: "description", type: "string", indexed: false },
    ],
  },
];

export const BountyClaimedAbi = [
  {
    type: "event",
    name: "BountyClaimed",
    inputs: [
      { name: "bountyId", type: "uint256", indexed: true },
      { name: "worker", type: "address", indexed: true },
      { name: "proofId", type: "string", indexed: false },
    ],
  },
];
