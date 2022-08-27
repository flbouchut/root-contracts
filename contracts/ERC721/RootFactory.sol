// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract RootFactory is ERC2771Context, Ownable, Pausable {
    UpgradeableBeacon private immutable RootBeacon;
    address private RootAdmin;
    event NewProject(address indexed creator, address project, string name);

    constructor(address _implementation, address _admin, address _trustedForwarder) ERC2771Context(_trustedForwarder){
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

    function createProxy(string memory name) public whenNotPaused returns (address) {
        BeaconProxy proxy = new BeaconProxy(
            address(RootBeacon),
            abi.encodePacked(abi.encodeWithSignature("initialize(address,string)",  RootAdmin, name), _msgSender())
        );

        emit NewProject(_msgSender(), address(proxy), name);
        return address(proxy);
    }

    function togglePause() public onlyOwner{
        if(paused()){
            _unpause();
        }else{
            _pause();
        }
    }

    function updateAdmin(address newAdmin) external onlyOwner {
        RootAdmin = newAdmin;
    }

    function getAdmin() public view returns(address) {
        return RootAdmin;
    }

    function getBeacon() public view returns(address) {
        return address(RootBeacon);
    }
}