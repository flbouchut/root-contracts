// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/MinimalForwarderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

struct TokenClass {
    string tokenUri;
    uint256 maxSupply;
    bool isInited;
}

contract RootNFT is ERC721Upgradeable, ERC2771ContextUpgradeable, OwnableUpgradeable {
    mapping(uint256 => bool) private minteable;
    mapping(uint256 => uint256) private classIdByTokenId;
    mapping(uint256 => string) private tokenUriByTokenId;
    mapping(uint256 => uint256[]) private tokenIdsByClassId;
    mapping(uint256 => TokenClass) private classbyClassId;

    bool private isInit;
    address private handler;

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
      if(!isInit) {
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
      } else {
          sender = ERC2771ContextUpgradeable._msgSender(); 
      }
    }

    function _msgData() internal view override(ContextUpgradeable, ERC2771ContextUpgradeable)
      returns (bytes calldata) {
        if (!isInit) {
            return msg.data[:msg.data.length - 20];
        } else {
            return ERC2771ContextUpgradeable._msgData();
        }
    }

    function createToken(uint256 _classId) public {
        TokenClass memory _tokenClass = classbyClassId[_classId];
        require(minteable[_classId], "Class not minteable");
        require(_tokenClass.maxSupply > tokenIdsByClassId[_classId].length, "Max supply reached");
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        tokenIdsByClassId[_classId].push(id);
        classIdByTokenId[id] = _classId;
        _safeMint(_msgSender(), id, "");
        settokenURIbyminter(id, _tokenClass.tokenUri);
    }

    function settokenURIbyminter(uint256 _tokenId, string memory _tokenURI) internal {
        require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
        tokenUriByTokenId[_tokenId] = _tokenURI;
    }

    // Owner or Handler write functions
    function settokenURI(uint256 _tokenId, string memory _tokenURI) public {
        require(_exists(_tokenId), "ERC721URIStorage: URI set of nonexistent token");
        require( (_msgSender() == owner()) || (_msgSender() == handler), "Caller is not authorized");
        tokenUriByTokenId[_tokenId] = _tokenURI;
    }

    // Only owner write functions
    function setclassURI(uint256 _classId, string memory _tokenURI) public onlyOwner {
        if(!minteable[_classId]) {
            toggleMinteable(_classId);
        }
        classbyClassId[_classId].tokenUri = _tokenURI;
    }


    function setMaxSupply(uint256 _classId, uint256 _maxSupply) public onlyOwner {
        classbyClassId[_classId].maxSupply = _maxSupply;
    }

    function setHandler(address _handler) public onlyOwner {
        handler = _handler;
    }

    function toggleMinteable(uint256 _classId) public onlyOwner {
        if (classbyClassId[_classId].isInited != true) {
            classbyClassId[_classId] = TokenClass("", 1000, true);
        }
        minteable[_classId] = !minteable[_classId];
    }

    // Public view functions
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return tokenUriByTokenId[tokenId];
    }

    function getclassURI(uint256 _classId) public view returns (string memory) {
        return classbyClassId[_classId].tokenUri;
    }

    function getMaxSupply(uint256 _classId) public view returns (uint256) {
        return classbyClassId[_classId].maxSupply;
    }

    function isMinteable(uint256 _classId) public view returns (bool) {
        return minteable[_classId];
    }

    function allIds(uint256 _classId) public view returns(uint256[] memory) {
        return tokenIdsByClassId[_classId];
    }
}