
async function main() {

    // const accounts = await hre.ethers.provider.listAccounts()
    const deployer = await hre.ethers.getContractFactory("RootNFT")
    const rootLogic = await deployer.deploy()
    await rootLogic.deployed()

    // await rootLogic.initialize("ipfs://bafybeia3yhgn7ivjsx6otaq6fe6ochtsk6zbhmo2btiqqqbipkpt4vwjce/{id}.json", "ROOT Creator Community Token", "ROOT",accounts[0])

    // const factoryDeployer = await hre.ethers.getContractFactory("RootFactoryclone")
    // const factory = await factoryDeployer.deploy(rootLogic.address)
    // await factory.deployed()


    console.log("Implementation Contract of Root deployed to: ",rootLogic.address)
    // console.log("Root Cloning Factory deployed at ", factory.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });