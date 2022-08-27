const deployRoot = async() => {
  const deployer = await hre.ethers.getContractFactory("RootNFT")
  const root = await deployer.deploy()
  await root.deployed()
  await hre.ethernal.push({
      name: 'RootNFT',
      address: root.address
  })
  console.log(`Root NFT contract deployed at ${root.address}`)
}

deployRoot()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });