# All the contracts of Root :)

The contracts are developed using the framework hardhat (nodejs library)

## How to 

1. Initialization : `npm install`
2. Compile contracts: `npx hardhat compile`

### Running Local blockchain network
Use the file hardhat.config.js to specify the network configuration. If you don't have a mnemonic phrase, simply remove this part from config file
```
hardhat: {
      accounts:{
        mnemonic: process.env.MNEMONIC_DEV,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 5,
      }
    }

```
Hardhat will autogenerate random

3. Run a local blockchain to deploy contracts: `npx hardhat node`

4. Deploy contract using the deploy script in "scripts" folder `npx hardhat run scripts/deploy_root.js`

or

To deploy on different network
`npx hardhat run scripts/deploy_root.js --network rinkeby`

5. Interact with deployed contract
`npx hardhat console`
or
`npx hardhat console --network rinkeby`