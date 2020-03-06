const ethers = require('ethers')
const {toBN, bigRand} = require('../lib/utils')
const {signTransfer, signBurn} = require('../lib/signer_functions')
const ParentBridgeHead = artifacts.require('ParentBridgeHead')
const TestToken = artifacts.require('TestToken')

contract('ParentBridgeHead', function (accounts) {
  const privateKey = '0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b'
  const wallet = new ethers.Wallet(privateKey)

  var parentBridgeHead, tokenA, tokenB

  before(async () => {
    parentBridgeHead = await ParentBridgeHead.new(wallet.address)
    tokenA = await TestToken.new('Token A', 'TKA', 18)
    tokenB = await TestToken.new('Token B', 'TKB', 18)
  })

  it('has the sender as owner if not otherwise defined', async () => {
    const contract = await ParentBridgeHead.new('0x0000000000000000000000000000000000000000')
    const oracle = await contract.oracle()
    assert.equal(oracle, accounts[0])
  })

  it(`can set the oracle address to ${accounts[1]}`, async () => {
    const contract = await ParentBridgeHead.new('0x0000000000000000000000000000000000000000')
    const tx = contract.setOracle(accounts[1])
    const oracle = await contract.oracle()
    assert.equal(oracle, accounts[1])
  })

  it(`has ${wallet.address} as oracle`, async () => {
    const oracle = await parentBridgeHead.oracle()
    assert.equal(oracle, wallet.address)
  })

  it('gets 1e29 tokenA tokens', async () => {
    const tx = await tokenA.mint(parentBridgeHead.address, toBN('1e29'))
    assert.equal((await tokenA.balanceOf(parentBridgeHead.address)).toString(), toBN('1e29').toString())
  })

  const nonce = bigRand()
  it(`can transfer 1e28 tokens to ${accounts[2]} if the oracle signs the request`, async () => {
    const sig = await signTransfer(accounts[3], accounts[2], toBN('1e28'), tokenA.address, nonce, wallet)
    const tx = await parentBridgeHead.transfer(accounts[3], accounts[2], toBN('1e28'), tokenA.address, nonce, sig.v, sig.r, sig.s)
    assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('1e28').toString())
    assert.equal((await tokenA.balanceOf(parentBridgeHead.address)).toString(), toBN('9e28').toString())
  })

  it('fails to execute the same transfer twice', async () => {
    const sig = await signTransfer(accounts[3], accounts[2], toBN('1e28'), tokenA.address, nonce, wallet)
    try{
      const tx = await parentBridgeHead.transfer(accounts[3], accounts[2], toBN('1e28'), tokenA.address, nonce, sig.v, sig.r, sig.s)
      assert.fail('an exception must be thrown')
    } catch (e) {
      assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('1e28').toString())
      assert.equal((await tokenA.balanceOf(parentBridgeHead.address)).toString(), toBN('9e28').toString())
    }
  })

})
