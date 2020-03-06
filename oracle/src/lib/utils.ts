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
import BigNumber from "bignumber.js"
import crypto = require("crypto")
import snl = require("simple-node-logger")
import utils = require("web3-utils")

// the purpose of this function is to be able to create BN from exponent numbers like '2e22' they must be formatted as string in this case
export const toBN = (num) => utils.toBN(new BigNumber(num.toString()).toString(10))
export const bigRand = () => {
  return "0x" + crypto.randomBytes(32).toString("hex")
}

export const logger = snl.createSimpleLogger(process.env.LOG_FILE)
logger.setLevel(process.env.LOG_LEVEL || "info")
