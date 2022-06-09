
async function main() {

    const deployer = await hre.ethers.getContractFactory("RootNFT")
    const rootLogic = await deployer.deploy()
    await rootLogic.deployed()

    const factoryDeployer = await hre.ethers.getContractFactory("RootFactoryclone")
    const factory = await factoryDeployer.deploy(rootLogic.address)
    await factory.deployed()

    console.log("Implementation Contract of Root deployed to: ",rootLogic.address)
    console.log("Root Cloning Factory deployed at ", factory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });