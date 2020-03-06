const ethers = require('ethers')
const {toBN, bigRand} = require('../lib/utils')
const {signTransfer, signBurn} = require('../lib/signer_functions')
const ChildBridgeHead = artifacts.require('ChildBridgeHead')
const TestToken = artifacts.require('TestToken')

contract('ChildBridgeHead', function (accounts) {
  const privateKey = '0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b'
  const wallet = new ethers.Wallet(privateKey)

  var childBridgeHead, tokenA, tokenB

  before(async () => {
    childBridgeHead = await ChildBridgeHead.new(wallet.address)
    tokenA = await TestToken.new('Token A', 'TKA', 18)
    tokenB = await TestToken.new('Token B', 'TKB', 18)
  })

  it('has tokens named Token A and B', async () => {
    assert.equal(await tokenA.name(), 'Token A')
    assert.equal(await tokenB.name(), 'Token B')
  })

  it('has the sender as owner if not otherwise defined', async () => {
    const contract = await ChildBridgeHead.new('0x0000000000000000000000000000000000000000')
    const oracle = await contract.oracle()
    assert.equal(oracle, accounts[0])
  })

  it(`has ${wallet.address} as oracle`, async () => {
    const oracle = await childBridgeHead.oracle()
    assert.equal(oracle, wallet.address)
  })

  it(`gets added as minter to TokenA`, async () => {
    const tx = await tokenA.addMinter(childBridgeHead.address)
    assert.isTrue(await tokenA.isMinter(childBridgeHead.address))
  })

  it(`mints 1e29 tokenA tokens into ${accounts[2]}`, async () => {
    const _nonce = bigRand()
    const sig = await signTransfer(accounts[3], accounts[2], toBN('1e29'), tokenA.address, _nonce, wallet)

    const tx = await childBridgeHead.mint(accounts[3], accounts[2], toBN('1e29'), tokenA.address, _nonce, sig.v, sig.r, sig.s)
    assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('1e29').toString())
  })

  const nonce = bigRand()
  it(`can burn 1e28 tokens if the oracle signs the request`, async () => {
    await tokenA.transfer(childBridgeHead.address, toBN('5e28'), {from: accounts[2]})
    assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('5e28').toString())
    assert.equal((await tokenA.balanceOf(childBridgeHead.address)).toString(), toBN('5e28').toString())

    const sig = await signBurn(toBN('1e28'), tokenA.address, nonce, wallet)
    const tx = await childBridgeHead.burn(toBN('1e28'), tokenA.address, nonce, sig.v, sig.r, sig.s)
    assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('5e28').toString())
    assert.equal((await tokenA.balanceOf(childBridgeHead.address)).toString(), toBN('4e28').toString())
  })

  it('fails to execute the same transaction twice', async () => {
    try{
      const sig = await signBurn(toBN('1e28'), tokenA.address, nonce, wallet)
      const tx = await childBridgeHead.burn(toBN('1e28'), tokenA.address, nonce, sig.v, sig.r, sig.s)
      assert.fail('an exception must be thrown')
    } catch (e) {
      assert.equal((await tokenA.balanceOf(accounts[2])).toString(), toBN('5e28').toString())
      assert.equal((await tokenA.balanceOf(childBridgeHead.address)).toString(), toBN('4e28').toString())
    }
  })

})
