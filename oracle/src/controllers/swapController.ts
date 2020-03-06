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
import { Request, Response } from "express"
import { MongoClient } from "mongodb"
import { HasDb } from "../hasDb"
import { signBurn, signTransfer } from "../lib/signer_functions"
import { logger } from "../lib/utils"
import { BridgeConfig, IBridge } from "./BrigeConfig"
import erc20 from "./ERC20"

const transferEvent = erc20.abi.find((entry) => entry.name === "Transfer" && entry.type === "event") || { signature: "empty" }

interface ISignedMessage {
  bridge: BridgeConfig
  bridgeContract: string
  from?: string
  to?: string
  amount: string
  token: string
  nonce: string
  v: number
  r: string
  s: string
  hash: string
}

export class SwapController extends HasDb {

  constructor (client: MongoClient, private password: string) {
    super(client)
  }

  public async mintParentTokens (req: Request, res: Response) {
    const { bridge: bridgeName, address } = req.params
    const bridge = await this.bridge(bridgeName)

    try {
      const transfer = await bridge.parentToken.mint(address, "100000000000000000000")
      await transfer.wait()
      res.status(200).send(transfer)
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }

  }

  public async newBridge (req: Request, res: Response) {
    const db = await this.db

    try {
      const bridge = await this.getBridge(req.body)
      await db.collection("bridges").insertOne(bridge.serialize())
      res.status(200).send()
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  /**
   * tokens received on the parent chain which must be minted on the child chain
   * @param req the request
   * @param res the result
   */
  public async getMintChildTokensTx (req: Request, res: Response) {
    try {
      const tx = await this.mintChildTokensTx(req)
      delete tx.bridge
      res.status(200).send(tx)
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  public async getFreeParentTokensTx (req: Request, res: Response) {
    this.logRequest(req, res)
    try {
      const tx = await this.freeParentTokensTx(req)
      delete tx.burn.bridge
      delete tx.transfer.bridge
      res.status(200).send(tx)
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  /**
   * TODO user authentication to avoid unknown users sending free transactions
   * @param req
   * @param res
   */
  public async mintChildTokens (req: Request, res: Response) {
    try {
      const tx = await this.mintChildTokensTx(req)
      const mint = await tx.bridge.childBridge.mint(tx.from, tx.to, tx.amount, tx.token, tx.nonce, tx.v, tx.r, tx.s, { gasLimit: 120000 })
      await mint.wait()
      res.status(200).send(mint)
    } catch (e) {
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  /**
   * @param req
   * @param res
   */
  public async freeParentTokens (req: Request, res: Response) {
    try {
      const { burn: btx, transfer: ttx } = await this.freeParentTokensTx(req)
      const transfer = await ttx.bridge.parentBridge.transfer(ttx.from, ttx.to, ttx.amount, ttx.token, ttx.nonce, ttx.v, ttx.r, ttx.s, { gasLimit: 120000 })
      const transferTx = await transfer.wait()
      const burn = await btx.bridge.childBridge.burn(btx.amount, btx.token, btx.nonce, btx.v, btx.r, btx.s, { gasLimit: 120000 })

      res.status(200).send({
        burn: await burn.wait(),
        transfer: transferTx,
      })
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  public async getAddAddressPair (req: Request, res: Response) {
    try {
      const { origin } = req.params
      const db = await this.db
      const pair = await db.collection("address-pairs").findOne({ origin })
      res.status(200).send(pair ? pair : { origin, destination: "unknown" })
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  public async addAddressPair (req: Request, res: Response) {
    try {
      const db = await this.db
      const { bridge: bridgeName, originTx, destinationTx } = req.body
      const bridge = await this.bridge(bridgeName)

      const origin = await bridge.parentWallet.provider.getTransactionReceipt(originTx)
      const destination = await bridge.childWallet.provider.getTransactionReceipt(destinationTx)

      if (origin.contractAddress && destination.contractAddress) {
        if ((await db.collection("address-pairs").find({ origin: origin.contractAddress.toString().toLowerCase() }).count()) === 0) {
          if (origin.from === destination.from) {
            const addressPair = {
              origin: origin.contractAddress.toString().toLowerCase(),
              destination: destination.contractAddress.toString().toLowerCase(),
            }
            await db.collection("address-pairs").insertOne(addressPair)
            res.status(200).send(addressPair)
          } else {
            res.status(500).send(`origin ${origin.from} and destination ${destination.from} from addresses do not match`)
          }
        } else {
          res.status(500).send(`origin ${origin.contractAddress} is already registered`)
        }
      } else {
        res.status(500).send(`origin ${originTx} and destination ${destinationTx} are not both contract creations`)
      }
    } catch (e) {
      logger.error(e.message)
      res.status(500).send(e.message)
    } finally {
      this.logRequest(req, res)
    }
  }

  private logRequest (req: Request, res: Response) {
    logger.info({ params: req.params, attachment: res.attachment })
  }

  private async bridge (bridgeName: string): Promise<BridgeConfig> {
    const db = await this.db
    const config: IBridge = await db.collection("bridges").findOne({
      name: bridgeName,
    })
    if (!config) {
      throw new Error(`the bridge ${bridgeName} is not configured`)
    }
    return this.getBridge(config)
  }

  private async getBridge (config: IBridge): Promise<BridgeConfig> {
    return await (new BridgeConfig(this.password)).deserialize(config)
  }

  private async mintChildTokensTx (req: Request): Promise<ISignedMessage> {
    const { bridge: bridgeName, txHash } = req.params
    try {
      const bridge = await this.bridge(bridgeName)

      const receipt = await bridge.parentWallet.provider.getTransactionReceipt(txHash)
      // @ts-ignore
      // find the transfer event on the parent token
      const event = receipt.logs.find(
        (log) => log.topics && log.topics.find((topic) => topic === transferEvent.signature) != null)
      // check that a token was sent and what its address is
      if (!event || event.address.toLowerCase() !== bridge.parentTokenAddress.toLowerCase()) {
        throw new Error(`the transaction ${txHash} is not a valid token transfer from a known token`)
      }
      // extract only the relevant fields from the ethereum log entry
      const log = bridge.parentToken.interface.parseLog(event).values
      let destAddress: string
      // check if the sender is a smart contract
      if ((await bridge.parentWallet.provider.getCode(log.from)).length > 3) {
        const db = await this.db
        // the from is a contract and the paired address must be sought from the database
        const { destination } = await db.collection("address-pairs").findOne({ origin: log.from.toLowerCase() })
        if (!destination) {
          throw new Error(`the address ${log.from} has not been paired`)
        }
        destAddress = destination
      } else {
        destAddress = log.from
      }

      // the oracle signs the transfer which can then be sent to the ChildBridgeHead contract
      const { v, r, s, hash } = await signTransfer(log.from, destAddress, log.value, bridge.childTokenAddress, txHash, bridge.childWallet)

      return {
        bridge,
        bridgeContract: bridge.childBridgeAddress as string,
        from: log.from as string,
        to: destAddress,
        amount: log.value.toString(10) as string,
        token: bridge.childTokenAddress as string,
        nonce: txHash as string,
        v: v as number,
        r: r as string,
        s: s as string,
        hash: hash as string,
      }
    } catch (e) {
      throw new Error(`buildParentTx ${e.message}`)
    }
  }

  private async freeParentTokensTx (req: Request): Promise<{ burn: ISignedMessage, transfer: ISignedMessage }> {
    const { bridge: bridgeName, txHash } = req.params
    try {
      const bridge = await this.bridge(bridgeName)

      const receipt = await bridge.childWallet.provider.getTransactionReceipt(txHash)
      // @ts-ignore
      // find the transfer event on the child token
      const event = receipt.logs.find(
        (log) => log.topics && log.topics.find((topic) => topic === transferEvent.signature) != null)
      // check that a token was sent and what its address is
      // @ts-ignore
      if (!event || event.address.toLowerCase() !== bridge.childTokenAddress.toLowerCase()) {
        throw new Error(`the transaction ${txHash} is not a valid token transfer from a known token`)
      }
      // extract only the relevant fields from the ethereum log entry
      const log = bridge.childToken.interface.parseLog(event).values
      let destAddress: string
      // check if the sender is a smart contract
      if ((await bridge.childWallet.provider.getCode(log.from)).length > 3) {
        const db = await this.db
        // the from is a contract and the paired address must be sought from the database
        const { origin } = await db.collection("address-pairs").findOne({ destination: log.from.toLowerCase() })
        if (!origin) {
          throw new Error(`the address ${log.from} has not been paired`)
        }
        destAddress = origin
      } else {
        destAddress = log.from
      }

      const { v: bv, r: br, s: bs, hash: bhash } = await signBurn(
        log.value,
        bridge.childTokenAddress,
        txHash, bridge.childWallet)
      const { v: tv, r: tr, s: ts, hash: thash } = await signTransfer(
        log.from,
        destAddress,
        log.value,
        bridge.parentTokenAddress,
        txHash,
        bridge.parentWallet)

      return {
        burn: {
          bridge,
          bridgeContract: bridge.childBridgeAddress as string,
          amount: log.value.toString(10) as string,
          token: bridge.childTokenAddress as string,
          nonce: txHash as string,
          v: bv as number,
          r: br as string,
          s: bs as string,
          hash: bhash as string,
        },
        transfer: {
          bridge,
          bridgeContract: bridge.parentBridgeAddress as string,
          from: log.from as string,
          to: destAddress as string,
          amount: log.value.toString(10) as string,
          token: bridge.parentTokenAddress as string,
          nonce: txHash as string,
          v: tv as number,
          r: tr as string,
          s: ts as string,
          hash: thash as string,
        },
      }
    } catch (e) {
      throw new Error(`buildChildTx ${e.message}`)
    }
  }
}
