/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

module.exports = {
  solidity: { compilers: [
    { version: "0.8.9" },
    { version: "0.8.11" }
  ] },
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
    ethereum :{
      url : process.env.ALCHEMY_RINKEBY_URI,
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV
      }
    }
  }
  // etherscan: 
  //   apiKey: process.env.ETHERSCAN_API_DEV
  // }
};

