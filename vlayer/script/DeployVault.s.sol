// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {GhostVault} from "../src/ghostbounties/GhostVault.sol";

contract DeployVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address paymentToken = vm.envAddress("PAYMENT_TOKEN");
        
        vm.startBroadcast(deployerPrivateKey);
        
        GhostVault vault = new GhostVault(paymentToken, msg.sender);
        
        vm.stopBroadcast();
        
        console.log("GhostVault deployed at:", address(vault));
    }
}

