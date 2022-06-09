// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./RootOwnable.sol";

contract RootNFT is ERC1155Upgradeable, PausableUpgradeable, RootOwnable{
    mapping(string => uint256) public CATALOGUE;
    mapping(uint256 => string) public CATALOGUEbyId;
    string public name;
    string public symbol;

    function initialize(string memory _baseURI, string memory _name, string memory _symbol, address _receiver) public initializer{
        __ERC1155_init(_baseURI);
        __Ownable_init(_receiver);
        CATALOGUE["COLLECTIBLE"] = 1;
        CATALOGUE["MEMBERSHIP"] = 2;
        CATALOGUE["PATRON"] = 3;
        CATALOGUEbyId[1] = "COLLECTIBLE";
        CATALOGUEbyId[2] = "MEMBERSHIP";
        CATALOGUEbyId[3] = "PATRON";

        name = _name;
        symbol = _symbol;
        
        _mint(_receiver, CATALOGUE["COLLECTIBLE"], 10, "");
        _mint(_receiver, CATALOGUE["MEMBERSHIP"], 5, "");
        _mint(_receiver, CATALOGUE["PATRON"], 2, "");

    }

    function mint(address _receiver, string memory _category, uint256 _quantity) public onlyOwner{

        require(CATALOGUE[_category] > 0, "Wrong Category");

        _mint(_receiver, CATALOGUE[_category], _quantity,"");
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        require(!paused(), "ERC1155Pausable: token transfer while paused");
    }

    function pause() public onlyOwner{
        _pause();
    }

    function unpause() public onlyOwner{
        _unpause();
    }
    
}