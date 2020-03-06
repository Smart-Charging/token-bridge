import { assert } from "chai"
import * as http from 'http'
import { Server } from 'http'
import { App } from '../src/app'
import { contractDefs } from '../src/agent/contract.defs'
import { BridgeConfig, IBridge } from '../src/controllers/BrigeConfig'
import Web3 = require('web3')
import chai = require('chai')
import ganache = require('ganache-core')
import chaiHttp = require('chai-http')
import chaiString = require('chai-string')
import { randomBytes } from 'crypto'

describe('server', function () {
  const PORT = 3333
  const GANACHE_PORT = 8313
  chai.use(chaiHttp)
  chai.use(chaiString)
  chai.should()
  let server: Server
  let contracts: any = {}
  let accounts: any
  // @ts-ignore
  const web3 = new Web3(`http://localhost:${GANACHE_PORT}`)
  let ganacheServer: any
  let addressPair = { origin: '', destination: '' }
  const bridges: IBridge[] = []
  const { ParentBridgeHead, ChildBridgeHead, ChildToken, Utils } = contractDefs

  before(async function () {
    this.timeout(10000)

    // @ts-ignore
    ganacheServer = ganache.server({
      port: GANACHE_PORT,
      network_id: 9,
      gasLimit: `0x${web3.utils.toBN('20000000').toString(16)}`,
      mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
    })
    await new Promise((resolve, reject) => {
      ganacheServer.listen(GANACHE_PORT, function (err, chain) {
        if (err) reject(err)
        else resolve(chain)
      })
    })
    accounts = await web3.eth.getAccounts()
    web3.defaultAccount = accounts[0]
    web3.eth.defaultAccount = accounts[0]

    contracts.fakeToken = await new web3.eth
      .Contract(ChildToken.abi)
      .deploy({
        data: ChildToken.bytecode,
        arguments: ['Child Token', 'CTK', 18]
      }).send({
        from: accounts[0],
        gas: 10000000
      })
    contracts.childToken = await new web3.eth
      .Contract(ChildToken.abi)
      .deploy({
        data: ChildToken.bytecode,
        arguments: ['Child Token', 'CTK', 18]
      }).send({
        from: accounts[0],
        gas: 10000000
      })
    contracts.parentToken = await new web3.eth
      .Contract(ChildToken.abi)
      .deploy({
        data: ChildToken.bytecode,
        arguments: ['Parent Token', 'PTK', 18]
      }).send({
        from: accounts[0],
        gas: 10000000
      })
    contracts.parentBridgeHead = await new web3.eth.Contract(ParentBridgeHead.abi).deploy({
      data: ParentBridgeHead.bytecode,
      arguments: [accounts[0]]
    }).send({ from: accounts[0], gas: 10000000 })
    contracts.childBridgeHead = await new web3.eth.Contract(ChildBridgeHead.abi).deploy({
      data: ChildBridgeHead.bytecode,
      arguments: [accounts[0]]
    }).send({ from: accounts[0], gas: 10000000 })
    contracts.utils = await new web3.eth.Contract(Utils.abi).deploy({ data: Utils.bytecode }).send({
      from: accounts[0],
      gas: 10000000
    })

    contracts.childToken.options.from = accounts[0]
    contracts.parentToken.options.from = accounts[0]
    contracts.parentBridgeHead.options.from = accounts[0]
    contracts.childBridgeHead.options.from = accounts[0]

    await contracts.childToken.methods.addMinter(contracts.childBridgeHead.options.address).send()
    await contracts.parentToken.methods.mint(accounts[1], '10000000000000000000').send()

    const client = {
      isConnected: () => true,
      db: () => ({
        collection: (name) => {
          if (name === 'bridges') {
            return {
              find: (query: any) => {
                return new Promise(resolve => resolve({toArray: () => bridges}))
              },
              findOne: (query: any) => {
                if (query.name) {
                  return bridges.find(bridge => bridge.name == query.name)
                } else {
                  return {
                    child: 'test',
                    parent: 'test'
                  }
                }
              },
              insertOne: (bridge: any) => {
                bridge._id = randomBytes(8).toString()
                bridges.push(bridge)
              }
            }
          } else if (name === 'address-pairs') {
            return {
              find: (query) => ({ count: () => addressPair.origin === query.origin ? 1 : 0 }),
              findOne: (query) => addressPair,
              insertOne: (addrPair) => addressPair = addrPair
            }
          } else if (name === 'tokens') {
            return {
              find: () => ({
                count: () => 1
              })

            }
          } else {
            return undefined
          }
        }
      })
    }
    return new Promise((resolve, reject) => {
      server = http.createServer(new App(client, 'test password').app).listen(PORT, () => {
        console.log('Express server listening on port', PORT)
        resolve(server)
      })
    })
  })

  it('accounts 0 is the oracle', async function () {
    assert.equal(await contracts.childBridgeHead.methods.oracle().call(), accounts[0])
    assert.equal(await contracts.parentBridgeHead.methods.oracle().call(), accounts[0])
  })

  it(`account 1 has 10 parent tokens `, async function () {
    const balance = await contracts.parentToken.methods.balanceOf(accounts[1]).call()
    assert.equal(balance.toString(10), '10000000000000000000')
  })

  it('has correctly deployed tokens', async function () {
    assert.equal(await contracts.childToken.methods.name().call(), 'Child Token')
  })

  it('encrypts and decrypts data in BridgeConfig', function () {
    const config = new BridgeConfig('my password')
    const data = 'some data'
    const cypher = config.encrypt(data)
    assert.equal(config.decrypt(cypher), data)
  })

  it(`responds with status code 200 to get http://localhost:${PORT}`, function (done) {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  it(`responds with an error when an unknown network is used in to-child tx`, function (done) {
    chai.request(server)
      .get('/get/to-child/unknown/0xd7d7dc4be18d9b940f11d0d887dcf0907016ea266071094646349237f0771f96')
      .end((err, res) => {
        res.should.have.status(500)
        res.error.text.should.endWith('the bridge unknown is not configured')
        done()
      })
  })

  it(`saves a new bridge when posted`, async function () {
    const bridge: IBridge = {
      name: 'insert test',
      parentUrl: 'parent provider url',
      childUrl: 'child provider url',
      parentTokenAddress: '0xparenttokenaddress',
      childTokenAddress: '0xchildtokenaddress',
      parentBridgeAddress: '0xparentbridgeaddress',
      childBridgeAddress: contracts.childToken.options.address,
      privateKey: '011CE6A10DFED82F2A9BC0B906224DBAFC1E2554A2D56943733366F7D5F09C73'
    }
    const res = await chai.request(server)
      .post(`/new-bridge`)
      .type('form')
      .send(bridge)
    res.should.have.status(200)
    assert.equal(bridges[bridges.length - 1].name, 'insert test')
  })

  it(`creates and saves a new bridge when posted`, async function () {
    const inputBridge: IBridge = {
      name: 'create-test',
      parentUrl: `http://localhost:${GANACHE_PORT}`,
      childUrl: `http://localhost:${GANACHE_PORT}`,
      parentTokenAddress: contracts.parentToken.options.address,
      privateKey: '011CE6A10DFED82F2A9BC0B906224DBAFC1E2554A2D56943733366F7D5F09C73'
    }
    const create = await chai.request(server)
      .post(`/new-bridge`)
      .type('form')
      .send(inputBridge)
    create.should.have.status(200)
    const bridge: BridgeConfig = await new BridgeConfig('test password').deserialize(bridges[bridges.length - 1])
    assert.equal(bridge.name, 'create-test')

    const faucet = await chai.request(server)
      .get(`/faucet/create-test/${accounts[2]}`)
    faucet.should.have.status(200)

    const transfer = await contracts.parentToken.methods.transfer(bridge.parentBridgeAddress, '1000000000000000000').send({ from: accounts[2] })
    let balance = await contracts.parentToken.methods.balanceOf(bridge.parentBridgeAddress).call()
    assert.equal(balance.toString(10), '1000000000000000000')

    balance = await contracts.childToken.methods.balanceOf(accounts[2]).call()
    assert.equal(balance.toString(10), '0')

    const res = await chai.request(server)
      .get(`/to-child/test-token/create-test/${transfer.transactionHash}`)
    res.should.have.status(200)

    assert.equal((await bridge.childToken.balanceOf(accounts[2])).toString(10), '1000000000000000000')
  })

  it(`responds with an error when an unknown network is used in to-parent tx`, function (done) {
    chai.request(server)
      .get('/get/to-parent/unknown/0xd7d7dc4be18d9b940f11d0d887dcf0907016ea266071094646349237f0771f96')
      .end((err, res) => {
        res.should.have.status(500)
        res.error.text.should.endWith('the bridge unknown is not configured')
        done()
      })
  })

  describe('bridge functions', function () {
    before(function () {
      const bridge = Object.assign(new BridgeConfig('test password'), {
        _id: 'string',
        name: 'test',
        parentUrl: `http://localhost:${GANACHE_PORT}`,
        childUrl: `http://localhost:${GANACHE_PORT}`,
        parentTokenAddress: contracts.parentToken.options.address,
        childTokenAddress: contracts.childToken.options.address,
        parentBridgeAddress: contracts.parentBridgeHead.options.address,
        childBridgeAddress: contracts.childBridgeHead.options.address,
        privateKey: '011CE6A10DFED82F2A9BC0B906224DBAFC1E2554A2D56943733366F7D5F09C73'
      })
      bridge.privateKey = bridge.encrypt(bridge.privateKey)
      bridges.push(bridge.serialize())
    })

    it(`returns a signed mint action which can be executed by the ChildBridgeHead when tokens are sent to the ParentBridgeHead`, async function () {
      const transfer = await contracts.parentToken.methods.transfer(contracts.parentBridgeHead.options.address, '1000000000000000000').send({ from: accounts[1] })
      let balance = await contracts.parentToken.methods.balanceOf(contracts.parentBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '1000000000000000000')

      const res = await chai.request(server)
        .get(`/get/to-child/test/${transfer.transactionHash}`)
      res.should.have.status(200)
      assert.equal(res.body.bridgeContract, contracts.childBridgeHead.options.address)

      const signer = await contracts.utils.methods.getSigner(res.body.hash, res.body.v, res.body.r, res.body.s).call()
      assert.equal(signer, accounts[0])

      await contracts.childBridgeHead.methods.mint(res.body.from, res.body.to, res.body.amount, res.body.token, res.body.nonce, res.body.v, res.body.r, res.body.s)
        .send({ from: accounts[2], gas: 10000000 })

      balance = await contracts.childToken.methods.balanceOf(res.body.from).call()
      assert.equal(balance.toString(10), res.body.amount)

      balance = await contracts.parentToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '9000000000000000000')
    })

    it('returns two signed actions burn and transfer which is executed by the Child and ParentBridgeHead when tokens are sent to the ChildBrdgeHead', async function () {
      const transfer = await contracts.childToken.methods.transfer(contracts.childBridgeHead.options.address, '1000000000000000000').send({ from: accounts[1] })
      let balance = await contracts.childToken.methods.balanceOf(contracts.childBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '1000000000000000000')

      const res = await chai.request(server)
        .get(`/get/to-parent/test/${transfer.transactionHash}`)
      res.should.have.status(200)
      assert.equal(res.body.burn.bridgeContract, contracts.childBridgeHead.options.address)
      assert.equal(res.body.transfer.bridgeContract, contracts.parentBridgeHead.options.address)

      let signer = await contracts.utils.methods.getSigner(res.body.burn.hash, res.body.burn.v, res.body.burn.r, res.body.burn.s).call()
      assert.equal(signer, accounts[0])
      signer = await contracts.utils.methods.getSigner(res.body.transfer.hash, res.body.transfer.v, res.body.transfer.r, res.body.transfer.s).call()
      assert.equal(signer, accounts[0])

      await contracts.childBridgeHead.methods.burn(
        res.body.burn.amount,
        res.body.burn.token,
        res.body.burn.nonce,
        res.body.burn.v,
        res.body.burn.r,
        res.body.burn.s)
        .send({ from: accounts[2], gas: 10000000 })
      await contracts.parentBridgeHead.methods.transfer(
        res.body.transfer.from,
        res.body.transfer.to,
        res.body.transfer.amount,
        res.body.transfer.token,
        res.body.transfer.nonce,
        res.body.transfer.v,
        res.body.transfer.r,
        res.body.transfer.s)
        .send({ from: accounts[2], gas: 10000000 })

      balance = await contracts.childToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '0')
      balance = await contracts.childToken.methods.balanceOf(contracts.childBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '0')
      balance = await contracts.parentToken.methods.balanceOf(contracts.parentBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '0')
      balance = await contracts.parentToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '10000000000000000000')
    })

    it('executes the minting transaction directly', async function () {
      this.timeout(10000)
      const transfer = await contracts.parentToken.methods.transfer(contracts.parentBridgeHead.options.address, '1000000000000000000').send({ from: accounts[1] })
      let balance = await contracts.parentToken.methods.balanceOf(contracts.parentBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '1000000000000000000')

      balance = await contracts.childToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '0')

      const res = await chai.request(server)
        .get(`/to-child/test-token/test/${transfer.transactionHash}`)
      res.should.have.status(200)

      balance = await contracts.childToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '1000000000000000000')
    })

    it('executes the burning and transfer transactions directly', async function () {
      this.timeout(10000)
      const transfer = await contracts.childToken.methods.transfer(contracts.childBridgeHead.options.address, '1000000000000000000').send({ from: accounts[1] })
      let balance = await contracts.childToken.methods.balanceOf(contracts.childBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '1000000000000000000')

      balance = await contracts.childToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '0')
      balance = await contracts.parentToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '9000000000000000000')

      const res = await chai.request(server)
        .get(`/to-parent/test-token/test/${transfer.transactionHash}`)
      res.should.have.status(200)

      balance = await contracts.childToken.methods.balanceOf(contracts.childBridgeHead.options.address).call()
      assert.equal(balance.toString(10), '0')
      balance = await contracts.parentToken.methods.balanceOf(accounts[1]).call()
      assert.equal(balance.toString(10), '10000000000000000000')
    })

    describe('transfer from wallet', function () {
      const { Wallet } = contractDefs
      let originTx, destinationTx, destinationWallet, originWallet

      beforeEach(async function () {
        originWallet = await new web3.eth.Contract(Wallet.abi).deploy({ data: Wallet.bytecode }).send({
          from: accounts[0],
          gas: 10000000
        }).on('transactionHash', (txHash) => originTx = txHash)
        destinationWallet = await new web3.eth.Contract(Wallet.abi).deploy({ data: Wallet.bytecode }).send({
          from: accounts[0],
          gas: 10000000
        }).on('transactionHash', (txHash) => destinationTx = txHash)
        originWallet.options.from = accounts[0]
        destinationWallet.options.from = accounts[0]
      })

      it('creates an address pair for contracts from the same signer', async function () {

        assert.ok(originTx)
        assert.ok(destinationTx)

        const res = await chai.request(server)
          .post(`/address-pair`)
          .type('form')
          .send({
            'bridge': 'test',
            'originTx': originTx,
            'destinationTx': destinationTx
          })
        res.should.have.status(200)
        assert.equal(res.body.origin, originWallet.options.address.toLowerCase())
        assert.equal(res.body.destination, destinationWallet.options.address.toLowerCase())
      })

      it('does not create an address pair for contracts from different signers', async function () {
        destinationWallet = await new web3.eth.Contract(Wallet.abi).deploy({ data: Wallet.bytecode }).send({
          from: accounts[1],
          gas: 10000000
        }).on('transactionHash', (txHash) => destinationTx = txHash)

        assert.ok(originTx)
        assert.ok(destinationTx)

        const res = await chai.request(server)
          .post(`/address-pair`)
          .type('form')
          .send({
            'bridge': 'test',
            'originTx': originTx,
            'destinationTx': destinationTx
          })
        res.should.have.status(500)
        assert.equal(res.error.text, `origin ${accounts[0]} and destination ${accounts[1]} from addresses do not match`)
      })

      it('allows to transfer tokens from origin to destination and back', async function () {
        this.timeout(20000)
        let res = await chai.request(server)
          .post(`/address-pair`)
          .type('form')
          .send({
            'bridge': 'test',
            'originTx': originTx,
            'destinationTx': destinationTx
          })
        res.should.have.status(200)
        await contracts.parentToken.methods.mint(originWallet.options.address, '1000000000000000000000').send()
        let transfer = await originWallet.methods.transfer(contracts.parentToken.options.address, contracts.parentBridgeHead.options.address, '1000000000000000000000').send()
        res = await chai.request(server)
          .get(`/to-child/test-token/test/${transfer.transactionHash}`)
        res.should.have.status(200)
        assert.equal((await contracts.childToken.methods.balanceOf(destinationWallet.options.address).call()).toString(10), '1000000000000000000000')
        assert.equal((await contracts.parentToken.methods.balanceOf(originWallet.options.address).call()).toString(10), '0')

        transfer = await destinationWallet.methods.transfer(contracts.childToken.options.address, contracts.childBridgeHead.options.address, '1000000000000000000000').send()
        res = await chai.request(server)
          .get(`/to-parent/test-token/test/${transfer.transactionHash}`)
        res.should.have.status(200)
        assert.equal((await contracts.childToken.methods.balanceOf(destinationWallet.options.address).call()).toString(10), '0')
        assert.equal((await contracts.parentToken.methods.balanceOf(originWallet.options.address).call()).toString(10), '1000000000000000000000')
      })

      it('fails when transferring the wrong token to the parent bridge', async function () {
        await contracts.fakeToken.methods.mint(originWallet.options.address, '1000000000000000000000').send({from: accounts[0]})
        let transfer = await originWallet.methods.transfer(contracts.fakeToken.options.address, contracts.parentBridgeHead.options.address, '1000000000000000000000').send()
        const res = await chai.request(server)
          .get(`/to-child/test-token/test/${transfer.transactionHash}`)
        res.should.have.status(500)
        assert.startsWith(res.text, 'buildParentTx the transaction 0x')
        assert.endsWith(res.text, 'is not a valid token transfer from a known token')
      })

      it('fails when transferring the wrong token to the child bridge', async function () {
        await contracts.fakeToken.methods.mint(originWallet.options.address, '1000000000000000000000').send({from: accounts[0]})
        let transfer = await originWallet.methods.transfer(contracts.fakeToken.options.address, contracts.childBridgeHead.options.address, '1000000000000000000000').send()
        const res = await chai.request(server)
          .get(`/to-parent/test-token/test/${transfer.transactionHash}`)
        res.should.have.status(500)
        assert.startsWith(res.text, 'buildChildTx the transaction 0x')
        assert.endsWith(res.text, 'is not a valid token transfer from a known token')
      })

      it('gets the address pair once it has been inserted', async function () {
        const res = await chai.request(server)
          .get(`/address-pair/${addressPair.origin}`)
        res.should.have.status(200)
        assert.equal(res.body.origin, addressPair.origin)
        assert.equal(res.body.destination, addressPair.destination)
      })
    })

  })

  after(function () {
    server.close()
    ganacheServer.close()
  })
})
