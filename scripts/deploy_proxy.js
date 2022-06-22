const { upgrades } = require("hardhat");

async function main(){
    const Root = await hre.ethers.getContractFactory("RootNFT")
    const creatorContract = await upgrades.deployProxy(Root,["sample.uri", "Adeeb2", "ADI2"])
    await creatorContract.deployed()
    console.log("Creator contract instance has beend deployed at "+creatorContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });