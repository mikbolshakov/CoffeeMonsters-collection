// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

// нужно что-то придумать с роялти?
contract CofMon is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    IERC721 public otherNFTContract;

    uint256 public constant MAX_ELEMENTS = 666;
    uint256 public constant PRICE_PUBLIC = 0.00666 ether;
    uint256 public constant PRICE_FOR_BROS = 0.00333 ether;
    uint256 public constant PRICE_WITH_MERCH = 0.0666 ether;
    uint256 public constant MAX_PER_WALLET = 10;
    address public constant creatorAddress = 0x2c84C3D16AaAC1157919D9210CBC7b8797F5A91a;
    address public constant devAddress = 0x2c84C3D16AaAC1157919D9210CBC7b8797F5A91a;
    string public baseTokenURI;

mapping(address => uint256) public mintPerWallet;
    // enum SaleState {
    //     CLOSED,
    //     OPEN,
    //     PRESALE
    // }
    //  SaleState public saleState = SaleState.CLOSED;

    constructor(string memory _baseURI, address _nftContract, address _receiver, uint _feeNumerator) ERC721("CofMon", "CMT") {
        setBaseURI(_baseURI);
        otherNFTContract = IERC721(_nftContract);
        _setDefaultRoyalty(_receiver, _feeNumerator);
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


/*
для этих 50% скидка на минт, бесплатно для держателей наших пассов и паблик. 
еще четвёртый, паблик+мерч, он будет в 10 раз дороже паблика.
*/
    function publicMint(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale end");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        require(msg.value >= (PRICE_PUBLIC * _count), "Value below price");

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(_to);
        }
        mintPerWallet[_to] += _count;
    }

    function mintForBros(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale end");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        require(msg.value >= (PRICE_FOR_BROS * _count), "Value below price");
        require(otherNFTContract.balanceOf(_to) >= _count, "only for bros holders");

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(_to);
        }
        mintPerWallet[_to] += _count;
    }

    function freeMint(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale end");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        // основные проверки! otherNFTContract.balanceOf(user) > 0
        // ограничение на кол-во 1нфт = 1 наша нфт, 1 пасс = 1 наша нфт

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(_to);
        }
        mintPerWallet[_to] += _count;
    }


    function mintWithMerch(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale ended");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        require(msg.value >= (PRICE_WITH_MERCH * _count), "Value below price");

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(_to);
        }
        mintPerWallet[_to] += _count;
    }

    function _mintAnElement(address _to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
    }

    // хорошая задумка withdraw!
    function withdrawAll() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0);
        _widthdraw(devAddress, (balance * 35) / 100);
        _widthdraw(creatorAddress, address(this).balance);
    }

    function _widthdraw(address _address, uint256 _amount) private {
        (bool success, ) = _address.call{value: _amount}("");
        require(success, "Transfer failed.");
    }

    // из oz
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
}
