/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = process.env.INFURA_KEY;

const fs = require('fs');
const privateKeys = [
  '011CE6A10DFED82F2A9BC0B906224DBAFC1E2554A2D56943733366F7D5F09C73',
  '06ED0616BB794FA8D0E4FF16EB8C2E2C282E7721909E30C8A4C720944B9E8944',
  '0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1',
  '0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c',
  '0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418',
  '0xCAB468AF941365618E45836E3C4E08F53A330C87C37941F011F68BA3D448C47B',
  '6C7A8BE3C67D73678591CFF229D9E6A17F449F7E5D2F9D6D953CE568B3D3F95A'
]

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8544,            // Standard Ethereum port (default: none)
     network_id: "9",       // Any network (default: none)
    },

    poa_all: {
      provider: () => new HDWalletProvider(privateKeys, "17 ", 0, 4),
      network_id: '17',
      from: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
      gas: 8000000
    },
    poa: {
      provider: () => new HDWalletProvider(privateKeys, "http://node35590-env-2351721.hidora.com:11009", 0, 4),
      network_id: '17',
      from: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      gas: 8000000,
      gasPrice: 1000000000
    },
    tobalaba: {
      provider: () => new HDWalletProvider(privateKeys, "http://node38817-test-cpo-api.hidora.com:11076", 0, 7),
      from: "0x006587aCbeD7EA97d43AEEDB69E4a5c02956943b",
      network_id: '401697',
      gas: 4000000
    },
    "ewf-main": {
      provider: function() {
        const {pk: mainPk} = require('./mainpk.json')
        return new HDWalletProvider(mainPk, "http://node38817-test-cpo-api.hidora.com:11076")
      },
      network_id: '401697',
      gas: 4000000
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider("CAB468AF941365618E45836E3C4E08F53A330C87C37941F011F68BA3D448C47B", `https://kovan.infura.io/v3/${infuraKey}`)
      },
      network_id: '42',
      gas: 4000000,
      gasPrice: 1000000000
    },
    mainnet: {
      provider: function() {
        const {pk: mainPk} = require('./mainpk.json')
        return new HDWalletProvider(mainPk, `https://mainnet.infura.io/v3/${infuraKey}`)
      },
      network_id: '1',
      gasPrice: 2000000000
    },
    volta_bridge: {
      provider: function() {
        const {pk: mainPk} = require('./mainpk.json')
        return new HDWalletProvider(mainPk, "https://volta-rpc.energyweb.org")
      },
      from: "0x881E6f2C336777748fcB7F1C2F9a82fCFA5C6AA3",
      network_id: '73799',
      gas: 4000000
    },
    ewc: {
      provider: function() {
        const {pk: mainPk} = require('./mainpk.json')
        return new HDWalletProvider(mainPk, "https://rpc.energyweb.org")
      },
      from: "0x881E6f2C336777748fcB7F1C2F9a82fCFA5C6AA3",
      network_id: '*',
      gas: 8000000,
      gasPrice: 10
    },
    kovan_bridge: {
      provider: function() {
        const {pk: mainPk} = require('./mainpk.json')
        return new HDWalletProvider(mainPk, "https://kovan.infura.io/v3/d28be71ba1df4f05ae9b31612cb76b0e")
      },
      from: "0x881E6f2C336777748fcB7F1C2F9a82fCFA5C6AA3",
      network_id: '42',
      gas: 4000000
    },
    kovan_tst: {
      provider: function() {
        return new HDWalletProvider("0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1", `https://kovan.infura.io/${infuraKey}`)
      },
      from: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
      network_id: '4',
      gas: 4000000,

    },
    volta_tst: {
      provider: function() {
        return new HDWalletProvider("0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1", 'https://volta-rpc.energyweb.org')
      },
      from: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
      network_id: '*',
      gas: 4000000,

    },

    // Another network with more advanced options...
    // advanced: {
      // port: 8777,             // Custom port
      // network_id: 1342,       // Custom network
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
      // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
      // network_id: 3,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
      // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
      // network_id: 2111,   // This network is yours, in the cloud.
      // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.2",    // Fetch exact version from solc-bin (default: truffle's version)
      docker: false,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       }
      }
    }
  }
}
