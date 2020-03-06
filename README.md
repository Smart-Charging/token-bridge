# Atomic Swap facility

this repo contains the smart-contracts and the oracle code which allows to send tokens from 
a parent chain to a child chain and back, with the guarantee that no tokens will be created 
in the process.

## Smart contracts

There are 4 relevant smart contracts:

* The ParentBridgeHead which holds the tokens on the parent chain
* The ChildBridgeHead which holds the tokens on the child chain
* The ParentToken which must be an ERC20 compatible token
* The ChildToken which is a Mintable and Burnable Token from openzeppelin

### Bridge head utility

It is the oracle which is responsible for keeping the tokens locked in the parent chain and 
minting the tokens in the child chain. It would be enough to send the tokens to the oracle 
and have it manage them.

The reason we created the BridgeHead contracts is to enable anyone to execute the blockchain 
transactions, not just the oracle. 

The way this works is that the oracle makes sure what the transaction should be. It is still 
the guardian of the tokens. But instead of sending the transactions to the blockchain, it 
signs the transaction parameters and allows anyone to submit them to the smart-contract.

The BridgeHead smart-contract function verifies the signature and only executes calls which 
were signed by the oracle. This allows to increase the bandwidth of the atomic-swap facility.

### ParentBridgeHead

This contract's purpose is to hold the coins which get minted in the child chain. It has only 
one function: `transfer` which allows to send the tokens held by the smart-contract to any 
address.

### ChildBridgeHead

This contract's purpose is to mint tokens on the child chain for every token locked in the 
ParentBridgeHead contract. It has two functions `mint` and `burn`

#### Mint

When some tokens are sent to the ParentBridgeHead, mint is called to send tokens to the 
correspondent address on the child chain.

#### Burn

When someone sends tokens to the ChildBridgeHead, burn is called before the tokens are released 
from the ParentBridgeHead. This way we can ensure that the same total supply exists on both 
chains.

## Oracle

The oracle can be used to send any ERC20 token from any parent chain to any child chain. The 
chain has to be an Ethereum based blockchain for the time being but it is conceivable that 
we send tokens from Stellar to Ethereum or RSK and back.

### End points

* GET `https://token-bridge.nordicenergy.com//` list existing bridges 
* POST `https://token-bridge.nordicenergy.com//new-bridge` to create a new bridge 
* GET `https://token-bridge.nordicenergy.com//to-child/:security-token/:bridge/:txHash` to make the oracle mint tokens on the child 
chain and assign them to the same address
* GET `https://token-bridge.nordicenergy.com//to-parent/:security-token/:bridge/:txHash` to make the oracle burn tokens on the child 
chain and transfer them to the same address on the parent chain
* POST `https://token-bridge.nordicenergy.com//address-pair` to configure the child chain correspondent address for a smart-contract 
on the parent chain or the other way round

#### Existing bridges

The root path returns a list of all known bridges with the addresses of the bridgeheads and 
the tokens. The name of the bridge should contain the information of which chains are bridged.

##### Example
````
  {
      "name": "test-kovan2volta",
      "oracle": "0x881E6f2C336777748fcB7F1C2F9a82fCFA5C6AA3",
      "tokenName": "Kovan DAI",
      "tokenSymbol": "KAI",
      "parentBridge": "0xa98769AF1DAEc5F008E3eD06281768ce2cc8F61E",
      "childBridge": "0xaE8A645fD894b9aB65AD5CfE6c361b64021185d2",
      "parentToken": "0x1FBA6Dc99EcF41741726e87d962F9cFcd099B353",
      "childToken": "0xa98769AF1DAEc5F008E3eD06281768ce2cc8F61E"
  }
````

This bridge is configured between Kovan (the parent) and Volta (the child) as the name suggests. 
The token name and symbol as well as all the addresses are provided in the description. 

#### getting parent tokens for test

By calling `/faucet/:bridge/:address` the oracle will try to mint 100 tokens on the parent chain 
and assign them to the provided address. This obviously only works on test tokens which are 
mintable by the oracle. 

#### from parent to child chain

when the URL GET `/to-child/:security-token/:bridge/:txHash` is accessed the oracle will mint 
the same number of tokens on the child chain as have been transferred to the parent bridgehead. 

The `security-token` is created by the admin of the bridge and allows a user to direct the oracle 
to create transactions. Without the security token, the user has to publish the transaction on 
their own, which is a bit tricky.

The `txHash` is the hash of the transaction in which the tokens were sent to the parent bridge. 
The transaction contains all the information required to mint the tokens on the child chain.

#### from child back to parent

in order to release tokens in the parent bridgehead, they need to be burned on the child chain. 
This happens when tokens are sent to the child bridgehead address and the URL is called: 
`/to-parent/:security-token/:bridge/:txHash`

For an explanation of `security-token` look above.

The `txHash` is the hash of the transaction in which the tokens were sent to the child bridgehead. 
The transaction contains all the information required to burn the tokens on the child chain and 
make the transfer on the parent chain.

#### Address-Pairs

An address pair is required in order to send tokens out of a smart-contract between chains. 
If your tokens sit in a multisig wallet, they will come out of a smart-contract.

In order to keep the oracle simple, we have not implemented any authentication mechanism. 
This means that we need another way to decide whether an address pair can be created. We 
decided that the easiest way would be to only allow the transfer of tokens between smart-contracts 
which have been created with the same address.

This also makes the input to the POST end-point easy. We require:
* the transaction hash for the contract creation on the parent chain. E.g. Kovan
* the transaction hash for the contract creation on the child chain. E.g. Volta
* the name of the bridge which contains the providers for parent and child bridges

here is an example of how to send this in a node.js script:

```
var request = require("request");

var options = 
    { method: 'POST',
      url: 'https://token-bridge.nordicenergy.com/address-pair',
      headers: 
       { 'Content-Type': 'application/x-www-form-urlencoded' },
      form: 
       { parentChainTx: '0xebcd316d369ea95ec2e4e3e5fc76fee5bb1506cfd11f593e95b03656e7a25313',
         childChainTx: '0x936655614f9bb1d18316ed5ec9773ebe509fab21354695534b17b15871f43f9a',
         bridge: 'kovan'
       } 
    };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

If this example is sent it will return an error because the addresses are already paired. But 
it is useful to see the transactions on [kovan](https://kovan.etherscan.io/tx/0xebcd316d369ea95ec2e4e3e5fc76fee5bb1506cfd11f593e95b03656e7a25313)
and [volta](https://tobalaba.etherscan.com/tx/0x936655614f9bb1d18316ed5ec9773ebe509fab21354695534b17b15871f43f9a)

There is a minimal `Wallet` contract in `contracts/test` which can transfer any ERC20. This is 
the contract that has been deployed in the above transactions. It can be used for testing without 
needing authorization. 
