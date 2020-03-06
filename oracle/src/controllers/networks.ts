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
import { ethers, Wallet } from "ethers"
import { BaseProvider } from "ethers/providers"
import * as path from "path"

export const infuraKey = process.env.INFURA_KEY

export class Network {

  public parentProvider: BaseProvider
  public childProvider: BaseProvider

  public childBridge
  public childToken

  public parentBridge
  public parentToken

  public childWallet: Wallet
  public parentWallet: Wallet

  private networks = {
    kovan: `https://kovan.infura.io/${infuraKey}`,
    tobalaba: "http://node38817-test-cpo-api.hidora.com:11076",
    poa: "http://node35590-env-2351721.hidora.com:11009",
  }

  private contracts = {
    kovan: require(`${path.resolve(__dirname)}/../../../contract.defs.kovan.json`),
    tobalaba: require(`${path.resolve(__dirname)}/../../../contract.defs.tobalaba.json`),
    poa: require(`${path.resolve(__dirname)}/../../../contract.defs.poa.json`),
  }

  constructor(parentChain: string, childChain: string, privateKey: string) {
    this.parentProvider = new ethers.providers.JsonRpcProvider(this.networks[parentChain])
    this.childProvider = new ethers.providers.JsonRpcProvider(this.networks[childChain])

    this.childWallet = new ethers.Wallet(privateKey, this.childProvider)
    const childContracts = this.contracts[childChain]
    this.childBridge = new ethers.Contract(childContracts.ChildBridgeHead.address, childContracts.ChildBridgeHead.abi, this.childWallet)
    this.childToken = new ethers.Contract(childContracts.ChildToken.address, childContracts.ChildToken.abi, this.childWallet)

    this.parentWallet = new ethers.Wallet(privateKey, this.parentProvider)
    const parentContracts = this.contracts[parentChain]
    this.parentBridge = new ethers.Contract(parentContracts.ParentBridgeHead.address, parentContracts.ParentBridgeHead.abi, this.parentWallet)
    this.parentToken = new ethers.Contract(parentContracts.ParentToken.address, parentContracts.ParentToken.abi, this.parentWallet)

  }
}
