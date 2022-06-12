// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./RootOwnable.sol";

contract RootNFT is ERC1155Upgradeable, PausableUpgradeable, RootOwnable{

    using Counters for Counters.Counter;
    Counters.Counter private _categoryCount;

    string public name;
    string public symbol;

    struct Category {
        string name;
        uint256 id;
        uint256 price;
    }

    Category[] public categories;

    mapping(string=>uint256) public categoryId;

    function initialize(string memory _baseURI, string memory _name, string memory _symbol, address _receiver) public initializer{
        __ERC1155_init(_baseURI);
        __Ownable_init(_receiver);

        addCategory("collectible", 0.01 ether);
        addCategory("membership", 0.1 ether);
        addCategory("patron", 1 ether);

        name = _name;
        symbol = _symbol;

    }

    function mint(address _receiver, string memory _category, uint256 _quantity) payable public{

        require(categoryId[_category] > 0, "Wrong Category");

        require(msg.value >= categories[categoryId[_category] - 1].price, "Price not met!");
        _mint(_receiver, categoryId[_category], _quantity,"");
    }

    function setPrice(string memory _category, uint256 _price) public onlyOwner{
        require(categoryId[_category] > 0, "Wrong Category");
        require(_price >= 0 , "Wrong Price");

        categories[categoryId[_category]-1].price = _price;
    }

    function addCategory(string memory _name, uint256 _price) public onlyOwner{
        require(categoryId[_name]<=0, "Category already exist");
        _categoryCount.increment();
        uint256 _categoryId = _categoryCount.current();
        categoryId[_name] = _categoryId;
        categories.push(Category({name: _name, id: _categoryId, price: _price}));
    }

    function totalCategory() public view returns(uint256){
        return categories.length;
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