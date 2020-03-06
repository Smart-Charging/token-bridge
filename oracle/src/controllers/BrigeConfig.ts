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
import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  Decipher,
  randomBytes,
  scryptSync,
} from "crypto"
import { Contract, ContractFactory, ethers, Wallet } from "ethers"
import { JsonRpcProvider } from "ethers/providers"
import { contractDefs } from "../agent/contract.defs"

const { ParentBridgeHead, ChildBridgeHead, ParentToken, ChildToken } = contractDefs

export interface IBridge {
  _id?: string
  name: string
  parentUrl: string
  childUrl: string
  parentTokenAddress: string
  childTokenAddress?: string
  parentBridgeAddress?: string
  childBridgeAddress?: string
  stringIv?: string
  childToken?: Contract
  parentToken?: Contract
  childBridge?: Contract
  parentBridge?: Contract
  childWallet?: Wallet
  parentWallet?: Wallet
  privateKey: string

  serialize?(): IBridge
}

export class BridgeConfig implements IBridge {
  public _id: string
  public name: string
  public parentUrl: string
  public childUrl: string
  public parentTokenAddress: string
  public childTokenAddress?: string
  public parentBridgeAddress?: string
  public childBridgeAddress?: string
  public privateKey: string

  private key: Buffer
  private _iv: Buffer

  private _parentWallet: Wallet
  private _childWallet: Wallet
  private _parentToken: Contract
  private _parentBridge: Contract
  private _childToken: Contract
  private _childBridge: Contract

  constructor(password: string) {
    this.key = scryptSync(password, "salt", 32)
  }

  public serialize(): IBridge {
    return {
      _id: this._id,
      name: this.name,
      parentUrl: this.parentUrl,
      childUrl: this.childUrl,
      parentTokenAddress: this.parentTokenAddress,
      childTokenAddress: this.childTokenAddress,
      parentBridgeAddress: this.parentBridgeAddress,
      childBridgeAddress: this.childBridgeAddress,
      stringIv: this.iv.toString("hex"),
      privateKey: this.privateKey,
    }
  }

  public async deserialize(config: IBridge): Promise<BridgeConfig> {
    Object.assign(this, config)

    if (!this._id) {
      this.privateKey = this.encrypt(this.privateKey)
    } else {
      this._iv = Buffer.from(config.stringIv || "0", "hex")
    }

    if (!this.parentBridgeAddress) {
      const cf = new ContractFactory(ParentBridgeHead.abi as any, ParentBridgeHead.bytecode, this.parentWallet)
      const pbd = await cf.deploy(this.parentWallet.address)
      this.parentBridgeAddress = (await pbd.deployed()).address
    }

    if (!this.childBridgeAddress) {
      const cf = new ContractFactory(ChildBridgeHead.abi as any, ChildBridgeHead.bytecode, this.childWallet)
      const cbd = await cf.deploy(this.childWallet.address)
      this.childBridgeAddress = (await cbd.deployed()).address
    }

    if (!this.childTokenAddress) {
      const ct = new ContractFactory(ChildToken.abi as any, ChildToken.bytecode, this.childWallet)
      const tokenName = await this.parentToken.name()
      const symbol = await this.parentToken.symbol()
      const decimals = await this.parentToken.decimals()
      const ctd = await ct.deploy(tokenName, symbol, decimals)
      this.childTokenAddress = (await ctd.deployed()).address
      await (await this.childToken.addMinter(this.childBridgeAddress)).wait()
    }

    return this
  }

  public encrypt(data: string): string {
    const cipher: Cipher = createCipheriv("aes-256-cbc", this.key, this.iv)
    const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex")
    return encrypted
  }

  public decrypt(cipherText: string): string {
    const decipher: Decipher = createDecipheriv("aes-256-cbc", this.key, this.iv)
    const decrypted = decipher.update(cipherText, "hex", "utf8") + decipher.final("utf8")
    return decrypted
  }

  get iv(): Buffer {
    if (!this._iv) {
      this._iv = randomBytes(16)
    }
    return this._iv
  }

  set iv(iv: Buffer) {
    this._iv = iv
  }

  get parentWallet(): Wallet {
    if (!this._parentWallet) {
      const pk = this.decrypt(this.privateKey)
      this._parentWallet = new Wallet(pk, new JsonRpcProvider(this.parentUrl))
    }
    return this._parentWallet
  }

  get childWallet(): Wallet {
    if (!this._childWallet) {
      const pk = this.decrypt(this.privateKey)
      this._childWallet = new Wallet(pk, new JsonRpcProvider(this.childUrl))
    }
    return this._childWallet
  }

  get parentToken() {
    if (!this._parentToken) {
      this._parentToken = new ethers.Contract(this.parentTokenAddress, ParentToken.abi as any, this.parentWallet)
    }
    return this._parentToken
  }

  get parentBridge() {
    if (!this._parentBridge) {
      if (this.parentBridgeAddress != null) {
        this._parentBridge = new ethers.Contract(this.parentBridgeAddress, ParentBridgeHead.abi as any, this.parentWallet)
      }
    }
    return this._parentBridge
  }

  get childToken() {
    if (!this._childToken) {
      if (this.childTokenAddress != null) {
        this._childToken = new ethers.Contract(this.childTokenAddress, ChildToken.abi as any, this.childWallet)
      }
    }
    return this._childToken
  }

  get childBridge() {
    if (!this._childBridge) {
      if (this.childBridgeAddress != null) {
        this._childBridge = new ethers.Contract(this.childBridgeAddress, ChildBridgeHead.abi as any, this.childWallet)
      }
    }
    return this._childBridge
  }
}
