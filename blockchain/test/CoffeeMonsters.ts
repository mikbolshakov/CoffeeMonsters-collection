import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { CofMon } from "../typechain-types";

describe("CoffeeMonsters tests", () => {
  let signers: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let firstContract: CofMon;
  let secondContract: CofMon;
  const publicPrice = ethers.utils.parseEther("0.00666");
  const priceForBros = ethers.utils.parseEther("0.00333");
  before(async () => {
    signers = await ethers.getSigners();
    deployer = signers[0];
    user1 = signers[1];
    user2 = signers[2];
    user3 = signers[3];
    user4 = signers[4];
  });
  it("Deploys first NFT contract", async () => {
    const Factory = await ethers.getContractFactory("CofMon");
    const coffeeMonsters = await Factory.deploy(
      "https://gateway.pinata.cloud/ipfs/QmSpL6rVyrjZuFYKRiocL73d93eFa8DDaduuwmPKRoybRW/",
      "0x9D9AE1ad49bE9b085Fef04B9c835D484a6D099e3"
    );
    expect(coffeeMonsters.address).to.not.eq(ethers.constants.AddressZero);
    firstContract = coffeeMonsters as CofMon;

    await firstContract.unpause();
  });

  it("Mint some nfts from first contract", async () => {
    const mintTx = await firstContract.publicMint(user1.address, 1, {
      value: publicPrice,
    });
    await mintTx.wait();

    const mintTx2 = await firstContract.publicMint(user2.address, 1, {
      value: publicPrice,
    });
    await mintTx2.wait();
  });

  it("Deploys second NFT contract", async () => {
    const Factory = await ethers.getContractFactory("CofMon");
    const outAddress = firstContract.address;
    const coffeeMonsters = await Factory.deploy(
      "https://gateway.pinata.cloud/ipfs/QmSpL6rVyrjZuFYKRiocL73d93eFa8DDaduuwmPKRoybRW/",
      outAddress
    );
    expect(coffeeMonsters.address).to.not.eq(ethers.constants.AddressZero);
    secondContract = coffeeMonsters as CofMon;

    await secondContract.unpause();
  });

  it("Mint some nfts from second contract", async () => {
    const mintTx = await secondContract.publicMint(user3.address, 1, {
      value: publicPrice,
    });
    await mintTx.wait();
    // expect(await token.tokenURI(0)).to.eq(`ipfs://${tokenId}`);

    const mintTx2 = await secondContract.mintForBros(user1.address, 1, {
      value: priceForBros,
    });
    await mintTx2.wait();

    await expect(
      secondContract.mintForBros(user4.address, 1, {
        value: priceForBros,
      })
    ).to.be.revertedWith("only for bros holders");
  });
});

/*
describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    onst mintTx3 = await token.safeMint(deployer, tokenId3);
    await mintTx3.wait();
    expect(await token.totalSupply()).to.eq(3);
    const deployerTokenId = await token.tokenOfOwnerByIndex(deployer, 0);
    expect(deployerTokenId).to.eq(2);
    expect(await token.tokenURI(deployerTokenId)).to.eq(`ipfs://${tokenId3}`);

    expect(await token.ownerOf(deployerTokenId)).to.eq(deployer);
    
    const approveTx = await token.approve(user, deployerTokenId);
    await approveTx.wait();

    const transferTx = await tokenAsUser.transferFrom(deployer, user, deployerTokenId);
    await transferTx.wait();

    expect(await token.ownerOf(deployerTokenId)).to.eq(user);

    const burnTx = await tokenAsUser.burn(deployerTokenId);
    await burnTx.wait();
    expect(await token.totalSupply()).to.eq(2);


    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
*/
