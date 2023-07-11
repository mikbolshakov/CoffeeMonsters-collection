import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CofMon } from "../typechain-types";

describe("CoffeeMonsters tests", () => {
  let signers: SignerWithAddress[];
  let developer: SignerWithAddress;
  let creator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let user5: SignerWithAddress;
  let firstContract: CofMon;
  let secondContract: CofMon;
  const publicPrice = ethers.utils.parseEther("0.00666");
  const priceForPartners = ethers.utils.parseEther("0.00333");
  before(async () => {
    signers = await ethers.getSigners();
    developer = signers[0];
    creator = signers[1];
    user1 = signers[2];
    user2 = signers[3];
    user3 = signers[4];
    user4 = signers[5];
    user5 = signers[6];
  });
  it("Deploys first NFT contract", async () => {
    const Factory = await ethers.getContractFactory("CofMon");
    const coffeeMonsters = await Factory.deploy(
      "https://gateway.pinata.cloud/ipfs/QmSpL6rVyrjZuFYKRiocL73d93eFa8DDaduuwmPKRoybRW/",
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      developer.address,
      1000,
      creator.address,
      developer.address
    );
    expect(coffeeMonsters.address).to.not.eq(ethers.constants.AddressZero);
    firstContract = coffeeMonsters as CofMon;

    await firstContract.unpause();
  });

  it("Mint some nfts from first contract", async () => {
    const mintTx = await firstContract.connect(user1).publicMint(2, 1, {
      value: publicPrice.mul(2),
    });
    await mintTx.wait();
    const mintTx2 = await firstContract.connect(user2).publicMint(2, 1, {
      value: publicPrice.mul(2),
    });
    await mintTx2.wait();

    const totalMined = await firstContract.totalMint();
    expect(totalMined).to.eq(4);
  });

  it("Deploys second NFT contract", async () => {
    const Factory = await ethers.getContractFactory("CofMon");
    const firstContractAddres = firstContract.address;
    const coffeeMonsters = await Factory.deploy(
      "https://gateway.pinata.cloud/ipfs/1",
      firstContractAddres,
      firstContractAddres,
      firstContractAddres,
      firstContractAddres,
      developer.address,
      1000,
      creator.address,
      developer.address
    );
    expect(coffeeMonsters.address).to.not.eq(ethers.constants.AddressZero);
    secondContract = coffeeMonsters as CofMon;

    await expect(
      secondContract.connect(user3).publicMint(1, 1)
    ).to.be.revertedWith("Pausable: paused");

    await expect(
      secondContract.connect(user3).mintForPartners(1)
    ).to.be.revertedWith("Pausable: paused");

    await expect(secondContract.connect(user3).freeMint(1)).to.be.revertedWith(
      "Pausable: paused"
    );

    await secondContract.unpause();
  });

  it("Mint some nfts from second contract", async () => {
    const mintTx = await secondContract.connect(user3).publicMint(1, 1, {
      value: publicPrice,
    });
    await mintTx.wait();
    const mintTx2 = await secondContract.connect(user1).mintForPartners(1, {
      value: priceForPartners,
    });
    await mintTx2.wait();

    const mintTx3 = await secondContract.connect(user1).freeMint(1);
    await mintTx3.wait();

    const totalMined = await secondContract.totalMint();
    expect(totalMined).to.eq(3);

    await secondContract.withdrawAll();
  });

  it("Check all possible requires", async () => {
    await expect(secondContract.withdrawAll()).to.be.revertedWith(
      "Zero balance"
    );

    await expect(
      secondContract.connect(user3).setBaseURI("https://gateway.pinata.cloud/ipfs/2")
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(secondContract.connect(user3).pause()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    await expect(secondContract.connect(user3).unpause()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    await expect(
      secondContract.connect(user3).withdrawAll()
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await expect(
      secondContract.connect(user3).mintForPartners(1, {
        value: priceForPartners,
      })
    ).to.be.revertedWith("Only for partner NFT holders");

    await expect(secondContract.connect(user5).freeMint(6)).to.be.revertedWith(
      "Only for pass holders"
    );

    await expect(secondContract.connect(user1).freeMint(6)).to.be.revertedWith(
      "Incorrect pass balance"
    );

    await expect(
      secondContract.connect(user1).mintForPartners(8, {
        value: priceForPartners.mul(8),
      })
    ).to.be.revertedWith("Incorrect partner NFT balance");

    await expect(
      secondContract.connect(user1).publicMint(8, 2)
    ).to.be.revertedWith("Incorrect mint index");

    await expect(
      secondContract.connect(user1).publicMint(15, 1)
    ).to.be.revertedWith("Exceeds max per wallet number");

    await expect(
      secondContract.connect(user5).mintForPartners(11)
    ).to.be.revertedWith("Exceeds max per wallet number");
    await expect(secondContract.connect(user5).freeMint(11)).to.be.revertedWith(
      "Exceeds max per wallet number"
    );

    await expect(
      secondContract.connect(user1).publicMint(8, 0)
    ).to.be.revertedWith("Value below price");

    await expect(
      secondContract.connect(user4).mintForPartners(10)
    ).to.be.revertedWith("Value below price");

    await expect(
      secondContract.connect(user1).publicMint(2, 1)
    ).to.be.revertedWith("Value below price");
  });
});
