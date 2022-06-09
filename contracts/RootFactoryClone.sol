// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./RootNFT.sol";

contract RootFactoryclone{
    address public immutable RootCollectionLogic;
    address[] public clones;

    constructor(address _implementation){
        RootCollectionLogic = _implementation;
    }

    function createClone(string memory _baseURI, string memory _name, string memory _symbol) public returns(address){
        address clone = Clones.clone(RootCollectionLogic);
        RootNFT(clone).initialize(_baseURI, _name, _symbol, msg.sender);
        clones.push(clone);
        return clone;
    }
}
