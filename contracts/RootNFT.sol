// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RootNFT is ERC1155, Ownable {
    mapping(string => uint256) public CATALOGUE;
    mapping(uint256 => string) public CATALOGUEbyId;
    string public constant name = "ROOT Creator Community";
    string public constant symbol = "ROOT";

    event PermanentURI(string _value, uint256 indexed _id);

    constructor(string memory _baseURI) ERC1155(_baseURI) {
        CATALOGUE["COLLECTIBLE"] = 1;
        CATALOGUE["MEMBERSHIP"] = 2;
        CATALOGUE["PATRON"] = 3;
        CATALOGUEbyId[1] = "COLLECTIBLE";
        CATALOGUEbyId[2] = "MEMBERSHIP";
        CATALOGUEbyId[3] = "PATRON";

        emit PermanentURI(_baseURI, 1);
        emit PermanentURI(_baseURI, 2);
        emit PermanentURI(_baseURI, 3);

        _mint(msg.sender, CATALOGUE["COLLECTIBLE"], 10, "");
        _mint(msg.sender, CATALOGUE["MEMBERSHIP"], 5, "");
        _mint(msg.sender, CATALOGUE["PATRON"], 2, "");
           
    }

    function mint(address _receiver, string memory _category, uint256 _quantity) public onlyOwner{
         _mint(_receiver, CATALOGUE[_category], _quantity,"");
    }
}