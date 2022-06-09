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
Hardhat will autogenerate random accounts for you if no account is given

3. Run a local blockchain to deploy contracts: `npx hardhat node`

4. Deploy contract using the deploy script in "scripts" folder `npx hardhat run --network localhost scripts/deploy_root.js`

or

4. Deploy on different network
`npx hardhat run scripts/deploy_root.js --network rinkeby`

5. Interact with deployed contract
`npx hardhat console --network localhost`
or
`npx hardhat console --network rinkeby`

### Useful commands to interact with contract in console
* List all accounts used in the network : `accounts = await ethers.provider.listAccounts()`
* Get contract ABI: `contract = await ethers.getContractFactory(<Name of the contract>)`
* Get contract Instance: `contractInstance = await contract.attach(<Contract Address>)`
* Call contract methods: `await contractInstance.method()`
* Get a particular account: `signer = await ethers.getSigner(address)`
* Call contract as that account: `contractwithsigner = contractInstance.connect(signer)`