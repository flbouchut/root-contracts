const { hre, upgrades } = require("hardhat");

const deployProxy = async () => {
    const Root = await hre.ethers.getContractFactory("RootNFT")
    const creatorContract = await upgrades.deployProxy(Root, { args: ["sample.uri", "Adeeb", "ADI"] })
    await creatorContract.deployed()
    await hre.ethernal.push({
        name: 'Root',
        address: creatorContract.address
    })
    console.log(`Creator contract instance has been deployed at ${creatorContract.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });