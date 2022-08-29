const { expect } = require("chai");
const { BigNumber } = require("ethers")

describe("Root 721 NFT Error Scenario",  () => {

  let proxyContractAddr: (string | null) = null

  before(async () => {
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
    proxyContractAddr = newProjectEvent[0]["args"]["project"]
  })

  it("Trying to create without making class mintable", async function () {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    try { 
      await rootProxy.createToken(1) 
      throw `Root create token should fail without making the class mintable`
    } catch(e: any) { 
      expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Class not minteable'")
    }
  })

  it("Trying to settoken without making class mintable or create token", async function () {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    try { 
      await rootProxy.settokenURI(1, "https://test") 
      throw `Root create token should fail without making the class mintable`
    } catch(e: any) { 
      expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'ERC721URIStorage: URI set of nonexistent token'")
    }
  })

  it("Trying to create, and toggle mintable and fail again", async function () {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);

    await rootProxy.toggleMinteable(2)
    // first token 
    await rootProxy.createToken(2)
    // second token
    await rootProxy.createToken(2)
    // stop mintability
    await rootProxy.toggleMinteable(2)

    // should fail
    try { 
        await rootProxy.createToken(2) 
        throw `Root create token should fail without making the class mintable`
    } catch(e: any) { 
        expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Class not minteable'")
    }
  })

  it ("Reset default max supply as 1 and 2nd mint should fail", async () => {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    await rootProxy.toggleMinteable(4)
    await rootProxy.setMaxSupply(4, 1)

    expect((await rootProxy.getMaxSupply(4)).toString()).to.equal('1')

    await rootProxy.createToken(4)
    

    // should fail
    try { 
      await rootProxy.createToken(4) 
      throw `Root create token should fail with maxSupply hit`
    } catch(e: any) { 
      expect(e.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Max supply reached'")
    }
  })

});

describe("Root 721 NFT Success Scenario",  () => {

  let proxyContractAddr: (string | null) = null

  before(async () => {
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
    proxyContractAddr = newProjectEvent[0]["args"]["project"]
  })

  it ("Set default max supply as 1000", async () => {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    await rootProxy.toggleMinteable(3)
    const maxSupply = await rootProxy.getMaxSupply(3)
    expect(maxSupply.toString()).to.equal('1000')
  })

  it ("Reset default max supply as 5", async () => {
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    await rootProxy.toggleMinteable(4)
    await rootProxy.setMaxSupply(4, 5)

    expect((await rootProxy.getMaxSupply(4)).toString()).to.equal('5')
  })

  it("Trying to create with all the required stuff and then settoken", async () => { 
    const ReloadedProxyContract = await ethers.getContractFactory("contracts/ERC721/Root721NFT.sol:RootNFT");
    const rootProxy = await ReloadedProxyContract.attach(proxyContractAddr);
    await rootProxy.toggleMinteable(1)
    await rootProxy.createToken(1)
    await rootProxy.settokenURI(1, "{}")


    const tokenUri = await rootProxy.tokenURI(1)
    const classUri = await rootProxy.getclassURI(1)

    expect(tokenUri).to.equal("{}")
    expect(classUri).to.equal("{}")
  })

});