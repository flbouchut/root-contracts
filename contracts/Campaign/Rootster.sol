// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Rootster is ERC1155Supply, Pausable, ERC2771Context, Ownable {
    using Strings for uint256;
    string private _baseURI = "";
    mapping(uint256 => string) private _tokenURIs;

    mapping(address => bool) public isUDclaimed;
    uint256 public maxSupply;

    string public name = "ROOT Community Collection";
    string public symbol = "ROOTSTER";

    constructor(MinimalForwarder _trustedForwarder) ERC1155("") ERC2771Context(address(_trustedForwarder)){
        maxSupply = 100;
    }

   function udmint() public whenNotPaused{
        require(isTrustedForwarder(msg.sender), "caller is not trusted");
        require(!isUDclaimed[_msgSender()], "User already claimed");
        require(totalSupply(0) < maxSupply, "Supply limit reached");
        isUDclaimed[_msgSender()] = true;

        _mint(_msgSender(), 0, 1, "");
   }

  function _msgSender() internal view override(Context, ERC2771Context)
      returns (address sender) {
      sender = ERC2771Context._msgSender();
  }

  function _msgData() internal view override(Context, ERC2771Context)
      returns (bytes calldata) {
      return ERC2771Context._msgData();
  }

   function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory tokenURI = _tokenURIs[tokenId];

        // If token URI is set, concatenate base URI and tokenURI (via abi.encodePacked).
        return bytes(tokenURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenURI)) : super.uri(tokenId);
    }

    function _setURI(uint256 tokenId, string memory tokenURI) internal virtual {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(uri(tokenId), tokenId);
    }

    function setURI(uint256 _tokenId, string memory _tokenURI) public onlyOwner{
        _setURI(_tokenId, _tokenURI);
    }

    function setSupply(uint256 _maxSupply) public onlyOwner{
        maxSupply = _maxSupply;
    }

    function pause() public onlyOwner{
        _pause();
    }

    function unpause() public onlyOwner{
        _unpause();
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
    // Future mints

    function mint(address _to, uint256 _tokenId, uint256 _amount, bytes memory _data)public onlyOwner{
        // create another mint contract to mint new tokens and set it as owner
        _mint(_to, _tokenId, _amount, _data);
    }

    function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data)public onlyOwner{
        // create another mint contract to mint new tokens and set it as owner
        _mintBatch( _to, _ids, _amounts, _data);
    }
}