const main = async()=>{
    const deployer = await hre.ethers.getContractFactory("ProxyAdmin")
    const admin = await deployer.deploy()
    await admin.deployed()
    await hre.ethernal.push({
        name: 'ProxyAdmin',
        address: admin.address
    })
    console.log("Creator Admin contract deployed at "+admin.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });