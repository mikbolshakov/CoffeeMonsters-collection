// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CofMon is ERC721, Pausable, Ownable, ERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    IERC721 public immutable firstPartnerNFTContract;
    IERC721 public immutable secondPartnerNFTContract;
    IERC721 public immutable thirdPartnerNFTContract;
    IERC721 public immutable passContract;
    address public immutable creatorAddress;
    address public immutable developerAddress;

    uint256 public constant MAX_TOKENS = 666;
    uint256 public constant PRICE_PUBLIC = 0.00666 ether;
    uint256 public constant PRICE_FOR_PARTNERS = 0.00333 ether;
    uint256 public constant PRICE_WITH_MERCH = 0.0666 ether;
    uint256 public constant MAX_PER_WALLET = 10;
    string public baseTokenURI;

    mapping(address => uint256) public mintPerWallet;
    mapping(address => bool) public checkNumberOfPartnerTokens;
    mapping(address => uint) public numberOfPartnerTokens;

    mapping(address => bool) public checkNumberOfPassTokens;
    mapping(address => uint) public numberOfPassTokens;

    // enum SaleState {
    //     CLOSED,
    //     OPEN,
    //     PRESALE
    // }
    //  SaleState public saleState = SaleState.CLOSED;

    constructor(
        string memory _baseURI,
        address _firstPartnerNFTContract,
        address _secondPartnerNFTContract,
        address _thirdPartnerNFTContract,
        address _pass,
        address _receiver,
        uint96 _feeNumerator,
        address _creator,
        address _developer
    ) ERC721("CofMon", "CMT") {
        setBaseURI(_baseURI);
        firstPartnerNFTContract = IERC721(_firstPartnerNFTContract);
        secondPartnerNFTContract = IERC721(_secondPartnerNFTContract);
        thirdPartnerNFTContract = IERC721(_thirdPartnerNFTContract);
        passContract = IERC721(_pass);
        _setDefaultRoyalty(_receiver, _feeNumerator);
        creatorAddress = _creator;
        developerAddress = _developer;
        pause();
    }

    function _totalSupply() internal view returns (uint) {
        return _tokenIdCounter.current();
    }

    function totalMint() public view returns (uint256) {
        return _totalSupply();
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function publicMint(
        uint256 _count,
        uint _mintIndex
    ) public payable whenNotPaused {
        uint256 total = _totalSupply();
        require(_mintIndex <= 1, "Incorrect mint index");
        require(total <= MAX_TOKENS, "Sale ended");
        require(total + _count <= MAX_TOKENS, "Max limit");
        require(
            mintPerWallet[msg.sender] + _count <= MAX_PER_WALLET,
            "Exceeds max per wallet number"
        );

        if (_mintIndex == 0) {
            require(
                msg.value >= (PRICE_WITH_MERCH * _count),
                "Value below price"
            );
        } else if (_mintIndex == 1) {
            require(msg.value >= (PRICE_PUBLIC * _count), "Value below price");
        }

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(msg.sender);
        }
        mintPerWallet[msg.sender] += _count;
    }

    function mintForPartners(uint256 _count) public payable whenNotPaused {
        uint256 total = _totalSupply();
        require(total <= MAX_TOKENS, "Sale ended");
        require(total + _count <= MAX_TOKENS, "Max limit");
        require(
            mintPerWallet[msg.sender] + _count <= MAX_PER_WALLET,
            "Exceeds max per wallet number"
        );
        require(
            msg.value >= (PRICE_FOR_PARTNERS * _count),
            "Value below price"
        );
        require(
            numberOfPartnerTokens[msg.sender] > 0 ||
                firstPartnerNFTContract.balanceOf(msg.sender) > 0 ||
                secondPartnerNFTContract.balanceOf(msg.sender) > 0 ||
                thirdPartnerNFTContract.balanceOf(msg.sender) > 0,
            "Only for partner NFT holders"
        );

        if (!checkNumberOfPartnerTokens[msg.sender]) {
            uint count = firstPartnerNFTContract.balanceOf(msg.sender) +
                secondPartnerNFTContract.balanceOf(msg.sender) +
                thirdPartnerNFTContract.balanceOf(msg.sender);

            numberOfPartnerTokens[msg.sender] = count;
        }

        require(
            numberOfPartnerTokens[msg.sender] >= _count,
            "Incorrect partner NFT balance"
        );

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(msg.sender);
        }

        checkNumberOfPartnerTokens[msg.sender] = true;
        numberOfPartnerTokens[msg.sender] -= _count;
        mintPerWallet[msg.sender] += _count;
    }

    function freeMint(uint256 _count) public payable whenNotPaused {
        uint256 total = _totalSupply();
        require(total <= MAX_TOKENS, "Sale ended");
        require(total + _count <= MAX_TOKENS, "Max limit");
        require(
            mintPerWallet[msg.sender] + _count <= MAX_PER_WALLET,
            "Exceeds max per wallet number"
        );

        require(
            numberOfPassTokens[msg.sender] > 0 ||
                passContract.balanceOf(msg.sender) > 0,
            "Only for pass holders"
        );

        if (!checkNumberOfPassTokens[msg.sender]) {
            numberOfPassTokens[msg.sender] = passContract.balanceOf(msg.sender);
        }

        require(
            numberOfPassTokens[msg.sender] >= _count,
            "Incorrect pass balance"
        );

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(msg.sender);
        }

        checkNumberOfPassTokens[msg.sender] = true;
        numberOfPassTokens[msg.sender] -= _count;
        mintPerWallet[msg.sender] += _count;
    }

    function _mintAnElement(address _to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
    }

    function withdrawAll() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Zero balance");
        _widthdraw(developerAddress, (balance * 35) / 100);
        _widthdraw(creatorAddress, address(this).balance);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
