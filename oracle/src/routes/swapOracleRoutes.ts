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
import { NextFunction, Request, Response, Router } from "express"
import { MongoClient } from "mongodb"
import { BridgeConfig } from "../controllers/BrigeConfig"
import { SwapController } from "../controllers/swapController"
import { HasDb } from "../hasDb"
import { logger } from "../lib/utils"

export class Routes extends HasDb {
  private swapController: SwapController

  constructor(client: MongoClient, private password: string) {
    super(client)
    this.swapController = new SwapController(client, this.password)
  }

  /**
   * for restricted routes a token is required in order to access the function
   * the token is stored in the database and is expected in a GET param named token
   * @param req
   * @param res
   * @param next
   */
  public async checkToken(req: Request, res: Response, next: NextFunction) {
    const db = await this.db
    const { token } = req.params
    const tokens: number = await db.collection("tokens").find({
      token,
      revoked: { $eq: false },
    }).count()

    if (tokens > 0) {
      next()
    } else {
      res.status(401).send("unauthorized")
    }
  }

  /**
   * routes which require a token to access
   * @param router
   */
  public restrictedRoutes(router: Router): Router {
    router.route("/to-child/:token/:bridge/:txHash")
      .get(this.checkToken.bind(this), this.swapController.mintChildTokens.bind(this.swapController))

    router.route("/to-parent/:token/:bridge/:txHash")
      .get(this.checkToken.bind(this), this.swapController.freeParentTokens.bind(this.swapController))

    return router
  }

  /**
   * routes which do not need a token and are publicly accessible
   * @param router
   */
  public openRoutes(router: Router): Router {

    router.route("/")
      .get(async (req: Request, res: Response) => {
        const db = await this.db
        const bridges: any[] = []
        /* read all the bridges from the database*/
        const collection = await db.collection("bridges").find()
        /*iterate through the bridges and add each one to the result array*/
        for (const bridge of (await collection.toArray())) {
          try {
            /*try to deserialize the document from the database*/
            const config: BridgeConfig = await (new BridgeConfig(this.password)).deserialize(bridge)
            let tokenName: string
            try {
              tokenName = await config.parentToken.name()
            } catch {
              tokenName = await config.childToken.name()
            }
            let tokenSymbol: any
            try{
              tokenSymbol = await config.parentToken.symbol()
            } catch {
              tokenSymbol = await config.childToken.symbol()
            }
            /*in case of success, push the selected content to the result array*/
            bridges.push({
              name: config.name,
              oracle: config.parentWallet.address,
              tokenName: tokenName,
              tokenSymbol: tokenSymbol,
              parentBridge: config.parentBridgeAddress,
              childBridge: config.childBridgeAddress,
              parentToken: config.parentTokenAddress,
              childToken: config.childTokenAddress,
            })
          } catch (e) {
            /*if an exception occurs, simply ignore it and log*/
            logger.warn(e.message)
          }
        }

        /*pretty print to HTML*/
        res.status(200).send(
          `<html><bod><pre id="json">${JSON.stringify(bridges, undefined, 2)}</pre></bod></html>`)
      })

    /**
     * store a new bridge in the database. the mandatory parameters are
     * parentUrl the URL of the provider for the parent chain
     * childUrl the URL of the provider for the child chain
     * parentTokenAddress the token in the parent chain which is to be bridged
     * privaterKey the private key for the oracle (this will be encrypted before storage)
     *
     * the childToken and the two bridgeheads will be created if not provided
     */
    router.route("/new-bridge/")
      .post(this.swapController.newBridge.bind(this.swapController))

    /**
     * for test purposes a faucet is provided, which will try to execute a mint function
     * on the parent token of the provided bridge. It is the responsibility of the bridge
     * creator to make sure that this is safe
     */
    router.route("/faucet/:bridge/:address")
      .get(this.swapController.mintParentTokens.bind(this.swapController))

    /**
     * mint the same amount of tokens on the child chain which were received in the parent bridgehead
     * bridge: the name of the bridge to which the tokens were sent
     * txHash: the hash of the transaction of the token transfer. The recipient of the minted tokens and
     * the amount of tokens will be extracted from the transaction receipt
     */
    router.route("/get/to-child/:bridge/:txHash")
      .get(this.swapController.getMintChildTokensTx.bind(this.swapController))

    /**
     * burn tokens in the child bridgehead and reelease them in the parent chain
     * bridge: the name of the bridge to which the tokens were sent
     * txHash: the has of the transaction of the token transfer. The recipient of the released tokens and
     * the amount of tokens will be extracted from the transaction receipt
     */
    router.route("/get/to-parent/:bridge/:txHash")
      .get(this.swapController.getFreeParentTokensTx.bind(this.swapController))

    /**
     * returns the corresponding address in an address pair
     * origin: the origin part of the pair
     */
    router.route("/address-pair/:origin")
      .get(this.swapController.getAddAddressPair.bind(this.swapController))

    /**
     * insert a new address pair. Only two contracts may be paired. They must both have been created by the same address
     * The expected parameters in the form are
     * bridge: the name of the bridge the address pair applies to
     * originTx: the transaction of the creation of the origin contract on the parent chain
     * destinationTx: the transaction of the creation of the destination contract on the child chain
     */
    router.route("/address-pair")
      .post(this.swapController.addAddressPair.bind(this.swapController))

    return router
  }
}
