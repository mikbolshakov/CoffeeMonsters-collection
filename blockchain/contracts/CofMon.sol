// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// нужно что-то придумать с роялти?
contract CofMon is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

     IERC721 public otherNFTContract = IERC721(0x9D9AE1ad49bE9b085Fef04B9c835D484a6D099e3);

    uint256 public constant MAX_ELEMENTS = 666;
    uint256 public constant PRICE = 0.00666 ether;
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

    constructor(string memory _baseURI) ERC721("CofMon", "CMT") {
        setBaseURI(_baseURI);
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
    function mint(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale end");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        require(msg.value >= price(_count), "Value below price");

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

    function mintWithMerch(address _to, uint256 _count) public payable whenNotPaused() {
        uint256 total = _totalSupply();
        require(total <= MAX_ELEMENTS, "Sale ended");
        require(total + _count <= MAX_ELEMENTS, "Max limit");
        require(mintPerWallet[_to] + _count <= MAX_PER_WALLET, "Exceeds number");
        require(msg.value >= PRICE_WITH_MERCH * _count, "Value below price");

        for (uint256 i = 0; i < _count; i++) {
            _mintAnElement(_to);
        }
        mintPerWallet[_to] += _count;
    }

    function mintNFT(address recipient, uint256 tokenId) public payable {
        require(msg.value >= getMintPrice(recipient), "Not enough Ether provided.");
        // Add your minting logic here...
    }

    function getMintPrice(address user) public view returns (uint256) {
        if(otherNFTContract.balanceOf(user) > 0) {
            // User owns a token from the other contract
            return 1 ether;
        } else {
            // User does not own a token from the other contract
            return 2 ether;
        }
    }

    // + проверка на наличие других нфт
    function price(uint256 _count) public pure returns (uint256) {
        return PRICE * _count;
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
