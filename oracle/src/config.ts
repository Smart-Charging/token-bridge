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
import { MongoClient } from "mongodb"
import { logger } from "./lib/utils"

function getClient(mongoConf) {
  return new MongoClient(`mongodb://${mongoConf.mongoUser ? mongoConf.mongoUser + ":" + mongoConf.mongoPassword + "@" : ""}${mongoConf.mongoUrl}`)
}

const config = {
  default: {
    mongoUrl: process.env.MONGO_URL || "localhost:27017",
    urlProperty: process.env.MONGO_URL_PROP || "internalUrl",
    mongoUser: process.env.MONGO_USER,
    mongoPassword: process.env.MONGO_PASSWORD,
    getClient: () => getClient(config.default),
  },
  test: {
    mongoUrl: "node40208-test-node.hidora.com:11035",
    mongoUser: "admin",
    mongoPassword: "SATrdv62396",
    urlProperty: "internalUrl",
    getClient: () => getClient(config.test),
  },
}

export const conf = config[process.env.ENV ? process.env.ENV as any : "default"]

export function mongoClient() {
  logger.info(`mongoClient config environment: ${process.env.ENV ? process.env.ENV as any : "default"}`)
  return conf.getClient()
}
