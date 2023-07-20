import { ethers } from "hardhat";
import hre from "hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// npx hardhat run scripts/deploy.ts --network chain
async function main() {
  const baseURI = "https://gateway.pinata.cloud/ipfs/"; // "https://gateway.pinata.cloud/ipfs/QmSpL6rVyrjZuFYKRiocL73d93eFa8DDaduuwmPKRoybRW/";
  const firstPartnerNFTContract = "0x9dB184d1058F7CFd26C0436fDf291B321057508e";
  const secondPartnerNFTContract = "0x3B4e3270eA25bdf0826AF34cE456854b88DE9b62";
  const thirdPartnerNFTContract = "0x3B4e3270eA25bdf0826AF34cE456854b88DE9b62";
  const pass = "0x0A1cC5762Fdbcef489C550721EAe725c2C77bD0a";
  const receiver = "0x2c84C3D16AaAC1157919D9210CBC7b8797F5A91a";
  const feeNumerator = 1000;
  const creator = "0x0d71a079a389817A832e43129Ba997002f01200a";
  const developer = "0x2c84C3D16AaAC1157919D9210CBC7b8797F5A91a";

  const CofMon = await ethers.getContractFactory("CofMon");
  const cofMon = await CofMon.deploy(
    baseURI,
    firstPartnerNFTContract,
    secondPartnerNFTContract,
    thirdPartnerNFTContract,
    pass,
    receiver,
    feeNumerator,
    creator,
    developer
  );

  await cofMon.deployed();
  console.log(`Staking deployed to ${cofMon.address}`);

  await new Promise(resolve => setTimeout(resolve, 60000));

  await hre.run("verify:verify", {
    address: cofMon.address,
    constructorArguments: [
      baseURI,
      firstPartnerNFTContract,
      secondPartnerNFTContract,
      thirdPartnerNFTContract,
      pass,
      receiver,
      feeNumerator,
      creator,
      developer,
    ],
    contract: "contracts/CofMon.sol:CofMon",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
