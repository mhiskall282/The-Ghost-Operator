// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {GhostVault} from "../src/ghostbounties/GhostVault.sol";
import {GitHubProver} from "../src/ghostbounties/GitHubProver.sol";
import {GhostBounties} from "../src/ghostbounties/GhostBounties.sol";
import {MockERC20} from "../src/ghostbounties/MockERC20.sol";

/**
 * @title DeployAll
 * @notice Deploys all GhostBounties contracts in the correct order
 * @dev This script deploys: MockToken (if needed) -> Vault -> Prover -> Bounties
 */
contract DeployAll is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("==========================================");
        console.log("GhostBounties Deployment");
        console.log("Deployer:", deployer);
        console.log("==========================================");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy Mock Token (for testing) or use existing
        address paymentToken;
        bool useMockToken = vm.envOr("USE_MOCK_TOKEN", true);
        
        if (useMockToken) {
            console.log("\n[1/4] Deploying MockERC20 token...");
            MockERC20 mockToken = new MockERC20("Mock USDC", "USDC", 6);
            paymentToken = address(mockToken);
            console.log("MockERC20 deployed at:", paymentToken);
            
            // Mint some tokens to deployer for testing
            mockToken.mint(deployer, 1000000 * 10**6); // 1M USDC
            console.log("Minted 1,000,000 USDC to deployer");
        } else {
            paymentToken = vm.envAddress("PAYMENT_TOKEN");
            console.log("\n[1/4] Using existing payment token:", paymentToken);
        }
        
        // Step 2: Deploy GhostVault
        console.log("\n[2/4] Deploying GhostVault...");
        GhostVault vault = new GhostVault(paymentToken, deployer);
        console.log("GhostVault deployed at:", address(vault));
        
        // Step 3: Deploy GitHubProver
        console.log("\n[3/4] Deploying GitHubProver...");
        GitHubProver prover = new GitHubProver();
        console.log("GitHubProver deployed at:", address(prover));
        
        // Step 4: Deploy GhostBounties
        console.log("\n[4/4] Deploying GhostBounties...");
        GhostBounties bounties = new GhostBounties(
            address(prover),
            address(vault),
            deployer
        );
        console.log("GhostBounties deployed at:", address(bounties));
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("\n==========================================");
        console.log("Deployment Summary");
        console.log("==========================================");
        console.log("Payment Token:", paymentToken);
        console.log("GhostVault:", address(vault));
        console.log("GitHubProver:", address(prover));
        console.log("GhostBounties:", address(bounties));
        console.log("==========================================");
        
        // Save addresses to file for easy access
        string memory addresses = string.concat(
            "PAYMENT_TOKEN=", vm.toString(paymentToken), "\n",
            "VAULT_ADDRESS=", vm.toString(address(vault)), "\n",
            "PROVER_ADDRESS=", vm.toString(address(prover)), "\n",
            "CONTRACT_ADDRESS=", vm.toString(address(bounties)), "\n"
        );
        
        vm.writeFile("deployment.addresses", addresses);
        console.log("\nAddresses saved to: deployment.addresses");
    }
}

