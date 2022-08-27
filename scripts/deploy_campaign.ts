const { ethers, upgrades, hre } = require("hardhat");

const deployCampaignForwarder = async() => {
    const deployer = await ethers.getContractFactory("contracts/Campaign/RootForwarder.sol:RootForwarder")
    const admin = await deployer.deploy()
    await admin.deployed()
    console.log(`RootForwarder for campaign contract deployed at ${admin.address}`)
    return admin.address
}

const deployCampaignRootster = async (forwarderAddr: string) => {
  const Rootster = await ethers.getContractFactory("contracts/Campaign/Rootster.sol:Rootster")
  const rootserContract = await Rootster.deploy(forwarderAddr)
  await rootserContract.deployed()
  console.log(`Rootster contract instance has been deployed at ${rootserContract.address}`)
}

deployCampaignForwarder()
  .then((address) => {
    deployCampaignRootster(address).then(() => {
      process.exit(0)
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });