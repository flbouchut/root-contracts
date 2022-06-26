/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require('hardhat-ethernal');
require('dotenv').config();

module.exports = {
  solidity: "0.8.2",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
      },
      chainId: 1337
    },
    rinkeby :{
      url : process.env.ALCHEMY_RINKEBY_URI,
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_DEV
  }
};

