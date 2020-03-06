/*
    Copyright 2020 Nordic Energy / Smart Charging Solutions

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { signTransfer } from '../oracle/src/lib/signer_functions'
import { ethers, Wallet } from 'ethers'
const {pk: mainPk} = require('../mainpk.json')
import { contractDefs } from '../oracle/src/agent/contract.defs'
import { bigRand } from '../oracle/src/lib/utils'

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
  '0x881E6f2C336777748fcB7F1C2F9a82fCFA5C6AA3',
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0x359f160c7102E3988f64c157e0f6eC8206d1B2f2',
  mainPk)
  .then(logInfo)
  .catch(logError)
