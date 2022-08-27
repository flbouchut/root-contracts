

const deployMintInfraForwarder = async() => {
    const deployer = await ethers.getContractFactory("contracts/ERC721/RootForwarder.sol:RootForwarder")
    const admin = await deployer.deploy()
    await admin.deployed()
    console.log(`ERC721 RootForwarder for campaign contract deployed at ${admin.address}`)
    return admin.address
}

const deployMintInfraRoot721NFT = async(forwarderAddr: string) => {
    const deployer = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT")
    const admin = await deployer.deploy(forwarderAddr)
    await admin.deployed()
    console.log(`Root721NFT for campaign contract deployed at ${admin.address}`)
    await admin.initialize(hre.network.config.account, "TestName")
    return  { addr: admin.address, for: forwarderAddr }
}

const deployMintInfraRootFactory = async(impl: string, adminAddr: string, forwarderAddr: string) => {
    const deployer = await ethers.getContractFactory("contracts/ERC721/RootFactory.sol:RootFactory")
    const admin = await deployer.deploy(impl, adminAddr, forwarderAddr)
    await admin.deployed()
    console.log(`RootFactory for campaign contract deployed at ${admin.address}`)
    return admin.address
}

deployMintInfraForwarder()
    .then(deployMintInfraRoot721NFT)
    .then(data => {
        deployMintInfraRootFactory(data.addr, hre.network.config.account, data.for)
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });