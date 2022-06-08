
async function main() {

    const deployer = await hre.ethers.getContractFactory("RootNFT")
    const rootLogic = await deployer.deploy("ipfs://bafybeia3yhgn7ivjsx6otaq6fe6ochtsk6zbhmo2btiqqqbipkpt4vwjce/{id}.json")
    await rootLogic.deployed()

    console.log("Implementation Contract of Root deployed to: ",rootLogic.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });