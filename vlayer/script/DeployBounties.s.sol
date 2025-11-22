// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {GhostBounties} from "../src/ghostbounties/GhostBounties.sol";

contract DeployBounties is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address githubProver = vm.envAddress("GITHUB_PROVER");
        address vault = vm.envAddress("VAULT");
        
        vm.startBroadcast(deployerPrivateKey);
        
        GhostBounties bounties = new GhostBounties(
            githubProver,
            vault,
            msg.sender
        );
        
        vm.stopBroadcast();
        
        console.log("GhostBounties deployed at:", address(bounties));
    }
}

