import { signTransfer } from './oracle/src/lib/signer_functions'
import { ethers, Wallet } from 'ethers'
const {pk: mainPk} = require('./mainpk.json')
import { contractDefs } from './oracle/src/agent/contract.defs'
import { bigRand } from './oracle/src/lib/utils'

const { ParentBridgeHead, ParentToken } = contractDefs

async function resend (destAddress: string, tokenAddress, bridgeAddress:string, pk: string) {
  const wallet = new Wallet(pk, new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/b0b1afd85a9649d2b0856efcc6acb769'))
  const token = new ethers.Contract(tokenAddress, ParentToken.abi, wallet)
  const bridge = new ethers.Contract(bridgeAddress, ParentBridgeHead.abi, wallet)
  const amount = await token.balanceOf(bridgeAddress)
  const nonce = bigRand()
  const { v, r, s, hash } = await signTransfer(destAddress, destAddress, amount.toString(), tokenAddress, nonce, wallet)
  if(wallet.address === await bridge.oracle()) {
    const transfer = await bridge.transfer(destAddress, destAddress, amount, tokenAddress, nonce, v, r, s, { gasLimit: 120000 })
    const transferTx = await transfer.wait()
    return {v, r, s, hash, transferTx}
  }
  return 'error'
}

function logInfo(info){
  console.info(info)
}

function logError(error) {
  console.error(error)
}

resend(
  '0xaB3b639A80CBF79bC98F88F9913Ba200AEf29731',
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  '0xa98769AF1DAEc5F008E3eD06281768ce2cc8F61E',
  mainPk)
  .then(logInfo)
  .catch(logError)
