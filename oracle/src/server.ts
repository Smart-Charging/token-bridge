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
import * as http from "http"
import { Server } from "http"
import { App } from "./app"
import { mongoClient } from "./config"
import { logger } from "./lib/utils"

/*
import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
*/

const PORT = process.env.PORT || 3000
const PASSWORD = process.env.PASSWORD || "test password"

const server: Server = http.createServer(new App(mongoClient(), PASSWORD).app).listen(PORT, () => {
  logger.info(`token-bridge server listening on port ${PORT}`)
})

module.exports = server
