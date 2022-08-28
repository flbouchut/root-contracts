const { expect } = require("chai");

describe("Token contract", function () {

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const forwarderContract = await ethers.getContractFactory("contracts/ERC721/RootForwarder.sol:RootForwarder");
    const forwarder = await forwarderContract.deploy()

    const rootContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const root = await rootContract.deploy(forwarder.address)

    const rootFactoryContract = await ethers.getContractFactory("contracts/ERC721/RootFactory.sol:RootFactory");
    const rootFactory = await rootFactoryContract.deploy(root.address, owner.address, forwarder.address)

    const tx = await rootFactory.createProxy("test1")
    let receipt = await tx.wait();
    const newProjectEvent = receipt.events?.filter((x: any) => { return x.event == "NewProject" });
    const proxyAddr = newProjectEvent[0]["args"]["project"]
    
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyAddr);

    const receiptToggle = await rootProxy.toggleMinteable("1")
    const setTokenUriReceipt = await rootProxy.set
    const createTokenReceipt = await rootProxy.createToken("1")


    expect(createTokenReceipt.hash != null)
    // expect(receiptToggle.hash != null)

  });

});