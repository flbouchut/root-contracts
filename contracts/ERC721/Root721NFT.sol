// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RootNFT is ERC721Upgradeable, ERC2771ContextUpgradeable, OwnableUpgradeable{
    mapping(uint256 => bool) private minteable;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) private classURIs;
    mapping(uint256 => uint256) private classbyId;
    mapping(uint256 => uint256[]) private idsbyClass;

    address private handler;
    bool private isInit;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    function initialize(address _handler, string memory _name) public initializer {
        __ERC721_init(_name, "ROOT");
        __Ownable_init();
        setHandler(_handler);
        isInit = true;
    }

    constructor(MinimalForwarderUpgradeable _trustedForwarder) ERC2771ContextUpgradeable(address(_trustedForwarder)) {}

    // Forwarder override 
    function _msgSender() internal view override(ContextUpgradeable, ERC2771ContextUpgradeable)
      returns (address sender) {
      if(!isInit){
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
      }else{
          sender = ERC2771ContextUpgradeable._msgSender(); 
      }
    }

    function _msgData() internal view override(ContextUpgradeable, ERC2771ContextUpgradeable)
      returns (bytes calldata) {
        if(!isInit){
            return msg.data[:msg.data.length - 20];
        }else{
            return ERC2771ContextUpgradeable._msgData();
        }
    }

    function createToken(uint256 _classId) public {
        require(minteable[_classId], "Class not minteable");
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        classbyId[id] = _classId;
        idsbyClass[_classId].push(id);
        _safeMint(_msgSender(), id, "");
        settokenURIbyminter(id, classURIs[_classId]);
    }

    function settokenURIbyminter(uint256 _tokenId, string memory _tokenURI) internal {
        require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[_tokenId] = _tokenURI;
    }

    // Owner or Handler write functions
    function settokenURI(uint256 _tokenId, string memory _tokenURI) public {
         require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
         require( (_msgSender() == owner()) || (_msgSender() == handler), "Caller is not authorized");
        _tokenURIs[_tokenId] = _tokenURI;
    }

    // Only owner write functions
    function setclassURI(uint256 _classId, string memory _tokenURI) public onlyOwner {
        if(!minteable[_classId])
            minteable[_classId] = true;
        classURIs[_classId] = _tokenURI;
    }

    function setHandler(address _handler) public onlyOwner{
        handler = _handler;
    }

    function toggleMinteable(uint256 _classId) public onlyOwner{
        minteable[_classId] = !minteable[_classId];
    }

    // Public view functions
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function getclassURI(uint256 _classId) public view returns(string memory) {
        return classURIs[_classId];
    }

    function isMinteable(uint256 _classId) public view returns (bool) {
        return minteable[_classId];
    }

    function allIds(uint256 _classId) public view returns(uint256[] memory) {
        uint256[] memory ids = idsbyClass[_classId];
        return ids;
    }
}