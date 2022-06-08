/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.1",
  networks: {
    hardhat: {
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
      }
    },
    rinkeby :{
      url : "https://eth-rinkeby.alchemyapi.io/v2/L5tMrf49vewB6qo0bb4tGwyvngJME3-5",
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_DEV
  }
};

