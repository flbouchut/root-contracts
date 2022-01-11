const AesyERC1155V1 = artifacts.require('AesyERC1155V1');

module.exports = function(_deployer) {
  _deployer.deploy(AesyERC1155V1, "Test1", "TS1", "http://localer")
};
