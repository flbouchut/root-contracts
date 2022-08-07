// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Root721NFT.sol";

contract RootFactory is ERC2771Context, Ownable {
    UpgradeableBeacon private immutable RootBeacon;
    address private RootAdmin;
    address[] private projects;

    constructor(address _implementation, address _admin,address _trustedForwarder) ERC2771Context(_trustedForwarder){
        RootBeacon = new UpgradeableBeacon(_implementation);
        RootAdmin = _admin;
    }

    // Forwarder override
    function _msgSender() internal view override(Context, ERC2771Context)
      returns (address sender) {
      sender = ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context)
      returns (bytes calldata) {
      return ERC2771Context._msgData();
    }

    function createProxy(string memory name) public returns(address){
        BeaconProxy proxy = new BeaconProxy(address(RootBeacon), 
            abi.encodeWithSelector(RootNFT(address(0)).initialize.selector, name, RootAdmin)
        );

        projects.push(address(proxy));
        return address(proxy);
    }

    function updateAdmin(address newAdmin) external onlyOwner{
        RootAdmin = newAdmin;
    }

    function getAdmin() public view returns(address){
        return RootAdmin;
    }

    function getBeacon() public view returns(address){
        return address(RootBeacon);
    }

    function getAllProjects() public view returns(address[] memory){
        return projects;
    }

}