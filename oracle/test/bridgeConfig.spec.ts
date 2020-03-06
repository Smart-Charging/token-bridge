import { assert } from "chai"
import { MongoClient } from 'mongodb'
import { mongoClient } from '../src/config'
import { BridgeConfig, IBridge } from '../src/controllers/BrigeConfig'
import { randomBytes } from 'ethers/utils'
import { Routes } from '../src/routes/swapOracleRoutes'

describe('mongodb tests', function () {
  const client: MongoClient = mongoClient()
  const bridgeName = randomBytes(8).toString()

  async function getDb (): Promise<MongoClient> {
    if (!client.isConnected())
      return client.connect().then(cli => cli.db('atomic-swap'))
    else
      return client.db('atomic-swap')
  }

  before(async function () {
    const db = await getDb()
    await db.collection('tokens').remove({$or: [{token: 'TEST'}, {token: 'REVOKED'}]})
    db.collection('tokens').insertMany([
      {token: 'TEST', revoked: false},
      {token: 'REVOKED', revoked: true}
    ])
  })

  it('saves a serialized bridge config to bridges', async function () {
    const bridge = Object.assign(new BridgeConfig('test password'), {
      _id: bridgeName,
      name: 'test-' + bridgeName,
      parentUrl: 'parent provider url',
      childUrl: 'child provider url',
      parentTokenAddress: '0xparenttokenaddress',
      childTokenAddress: '0xchildtokenaddress',
      parentBridgeAddress: '0xparentbridgeaddress',
      childBridgeAddress: '0xchildbridgeaddress',
      privateKey: 'test key'
    })
    bridge.privateKey = bridge.encrypt(bridge.privateKey)

    await (await getDb()).collection('bridges').insertOne(bridge.serialize())
  })

  it('deserialises the bridge from mongodb and decrypts the private key', async function () {
    const config: IBridge = await (await getDb()).collection('bridges').findOne({
      name: 'test-' + bridgeName
    })
    const bridgeConfig: BridgeConfig = await (new BridgeConfig('test password')).deserialize(config)

    assert.equal(bridgeConfig.decrypt(bridgeConfig.privateKey), 'test key')
  })

  it('validates a token', async function () {
    const routes = new Routes(client, 'my password')
    return new Promise(((resolve, reject) => {
      // @ts-ignore
      routes.checkToken({ params: { token: 'TEST' } }, undefined, resolve)
        .catch(reject)
    }))
  })

  it('rejects a revoked token', async function () {
    const routes = new Routes(client, 'my password')
    return new Promise(((resolve, reject) => {
        // @ts-ignore
        routes.checkToken({ params: { token: 'REVOKED' } }, undefined, reject)
          .catch(resolve)
    }))
  })

  after(async function () {
    const db = await getDb()
    await db.collection('tokens').remove({$or: [{token: 'TEST'}, {token: 'REVOKED'}]})
    setTimeout(process.exit, 5000)
  })
})
