// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {GhostBounties} from "../src/ghostbounties/GhostBounties.sol";
import {GhostVault} from "../src/ghostbounties/GhostVault.sol";
import {GitHubProver} from "../src/ghostbounties/GitHubProver.sol";
import {MockERC20} from "../src/ghostbounties/MockERC20.sol";

/**
 * @title DeployGhostBounties
 * @notice Deployment script for Ghost Bounties system
 * @dev Deploys all contracts needed for the bounty system
 */
contract DeployGhostBounties is Script {
    // Deployment addresses (will be populated after deployment)
    address public mockUSDC;
    address public vault;
    address public prover;
    address public bounties;

    function run() external {
        // Get deployment key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying from address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Mock USDC (for testing)
        // On mainnet/polygon, you would use the actual USDC address
        console.log("\n1. Deploying Mock USDC...");
        MockERC20 usdcToken = new MockERC20("USD Coin", "USDC", 6);
        mockUSDC = address(usdcToken);
        console.log("Mock USDC deployed at:", mockUSDC);

        // Mint some test tokens to deployer
        usdcToken.mint(deployer, 1000000 * 10 ** 6); // 1M USDC
        console.log("Minted 1,000,000 USDC to deployer");

        // 2. Deploy GhostVault
        console.log("\n2. Deploying GhostVault...");
        GhostVault vaultContract = new GhostVault(mockUSDC, deployer);
        vault = address(vaultContract);
        console.log("GhostVault deployed at:", vault);

        // 3. Deploy GitHubProver
        console.log("\n3. Deploying GitHubProver...");
        GitHubProver proverContract = new GitHubProver();
        prover = address(proverContract);
        console.log("GitHubProver deployed at:", prover);

        // 4. Deploy GhostBounties
        console.log("\n4. Deploying GhostBounties...");
        GhostBounties bountiesContract = new GhostBounties(
            prover,
            vault,
            deployer
        );
        bounties = address(bountiesContract);
        console.log("GhostBounties deployed at:", bounties);

        // 5. Transfer ownership of vault to bounties contract
        console.log("\n5. Configuring contracts...");
        vaultContract.transferOwnership(bounties);
        console.log("Vault ownership transferred to GhostBounties");

        vm.stopBroadcast();

        // Print deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Mock USDC:", mockUSDC);
        console.log("GhostVault:", vault);
        console.log("GitHubProver:", prover);
        console.log("GhostBounties:", bounties);
        console.log("=========================\n");

        // Save deployment addresses to file
        _saveDeploymentAddresses();
    }

    function _saveDeploymentAddresses() internal {
        string memory json = string.concat(
            "{\n",
            '  "mockUSDC": "',
            vm.toString(mockUSDC),
            '",\n',
            '  "vault": "',
            vm.toString(vault),
            '",\n',
            '  "prover": "',
            vm.toString(prover),
            '",\n',
            '  "bounties": "',
            vm.toString(bounties),
            '"\n',
            "}"
        );

        vm.writeFile("deployments/latest.json", json);
        console.log("Deployment addresses saved to deployments/latest.json");
    }
}
