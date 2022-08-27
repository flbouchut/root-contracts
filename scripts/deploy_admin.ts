const deployAdmin = async() => {
    const deployer = await hre.ethers.getContractFactory("ProxyAdmin")
    const admin = await deployer.deploy()
    await admin.deployed()
    console.log(`Creator Admin contract deployed at ${admin.address}`)
}

deployAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });