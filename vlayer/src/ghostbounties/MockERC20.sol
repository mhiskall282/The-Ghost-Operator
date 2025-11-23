// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";

/**
 * @title MockERC20
 * @notice Mock ERC20 token for testing purposes
 * @dev This is a simple ERC20 token that can be minted for testing
 */
contract MockERC20 is ERC20 {
    uint8 private _decimals;
    
    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @notice Mint tokens to an address (for testing)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
    /**
     * @notice Mint tokens to the caller
     * @param amount Amount of tokens to mint
     */
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}

