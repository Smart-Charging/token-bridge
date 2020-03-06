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
import ethers = require("ethers")
import utils = require("web3-utils")
import { toBN } from "./utils"

export async function signTransfer(sender, recipient, amount, tokenAddress, nonce, wallet) {
  const txMsg = utils.soliditySha3(sender, recipient, toBN(amount), tokenAddress, toBN(nonce))
  const messageHashBytes = ethers.utils.arrayify(txMsg as any)
  const flatSig = await wallet.signMessage(messageHashBytes)
  const sig = ethers.utils.splitSignature(flatSig)

  return {
    ...sig,
    hash: txMsg,
  }
}

export async function signBurn(amount, tokenAddress, nonce, wallet) {
  const txMsg = utils.soliditySha3(toBN(amount), tokenAddress, toBN(nonce))
  const messageHashBytes = ethers.utils.arrayify(txMsg as any)
  const flatSig = await wallet.signMessage(messageHashBytes)
  const sig = ethers.utils.splitSignature(flatSig)

  return {
    ...sig,
    hash: txMsg,
  }
}
