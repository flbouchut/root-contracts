const AesyERC1155V1 = artifacts.require("AesyERC1155V1");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("AesyERC1155V1", function (/* accounts */) {

  it("is deployed, should assert true", async function () {
    await AesyERC1155V1.deployed();
    return assert.isTrue(true);
  });

  it ("name, should be Test1", async function() {
    const instance = await AesyERC1155V1.deployed();
    const value = await instance.name();

    assert.equal(value, 'Test1');
  })

  it ("symbol, should be TS1", async function() {
    const instance = await AesyERC1155V1.deployed();
    const value = await instance.symbol();

    assert.equal(value, 'TS1');
  })
});
