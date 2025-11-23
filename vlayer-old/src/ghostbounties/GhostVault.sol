// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/**
 * @title GhostVault
 * @notice Escrow contract that holds funds for bounties
 * @dev Funds are locked until a bounty is completed and verified
 */
contract GhostVault is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable paymentToken; // USDC or other ERC20 token

    // Mapping from bountyId => amount escrowed
    mapping(uint256 => uint256) public escrowedAmounts;

    // Total amount in vault
    uint256 public totalEscrowed;

    event FundsDeposited(uint256 indexed bountyId, address indexed depositor, uint256 amount);
    event FundsReleased(uint256 indexed bountyId, address indexed recipient, uint256 amount);
    event FundsRefunded(uint256 indexed bountyId, address indexed depositor, uint256 amount);

    constructor(address _paymentToken, address _owner) Ownable(_owner) {
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @notice Deposit funds for a bounty
     * @param bountyId The ID of the bounty
     * @param amount The amount to escrow
     */
    function deposit(uint256 bountyId, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        escrowedAmounts[bountyId] += amount;
        totalEscrowed += amount;
        
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);
        
        emit FundsDeposited(bountyId, msg.sender, amount);
    }

    /**
     * @notice Release funds to a recipient (called by GhostBounties contract)
     * @param bountyId The ID of the bounty
     * @param recipient The address to receive the funds
     * @param amount The amount to release
     */
    function release(uint256 bountyId, address recipient, uint256 amount) external onlyOwner {
        require(escrowedAmounts[bountyId] >= amount, "Insufficient escrowed funds");
        require(recipient != address(0), "Invalid recipient");
        
        escrowedAmounts[bountyId] -= amount;
        totalEscrowed -= amount;
        
        paymentToken.safeTransfer(recipient, amount);
        
        emit FundsReleased(bountyId, recipient, amount);
    }

    /**
     * @notice Refund escrowed funds to the depositor
     * @param bountyId The ID of the bounty
     * @param depositor The original depositor
     * @param amount The amount to refund
     */
    function refund(uint256 bountyId, address depositor, uint256 amount) external onlyOwner {
        require(escrowedAmounts[bountyId] >= amount, "Insufficient escrowed funds");
        require(depositor != address(0), "Invalid depositor");
        
        escrowedAmounts[bountyId] -= amount;
        totalEscrowed -= amount;
        
        paymentToken.safeTransfer(depositor, amount);
        
        emit FundsRefunded(bountyId, depositor, amount);
    }

    /**
     * @notice Get the escrowed amount for a bounty
     * @param bountyId The ID of the bounty
     * @return The escrowed amount
     */
    function getEscrowedAmount(uint256 bountyId) external view returns (uint256) {
        return escrowedAmounts[bountyId];
    }
}

