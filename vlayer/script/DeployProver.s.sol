// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {GitHubProver} from "../src/ghostbounties/GitHubProver.sol";

contract DeployProver is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        GitHubProver prover = new GitHubProver();
        
        vm.stopBroadcast();
        
        console.log("GitHubProver deployed at:", address(prover));
    }
}

