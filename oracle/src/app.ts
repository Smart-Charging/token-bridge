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
import * as bodyParser from "body-parser"
import express = require("express")
import { Application, Router } from "express"
import { MongoClient } from "mongodb"
import { Routes } from "./routes/swapOracleRoutes"

export class App {

  public app: Application = express()
  public route: Routes

  constructor(client: MongoClient, password: string) {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.route = new Routes(client, password)
    this.app.use(this.route.openRoutes(Router()))
    this.app.use(this.route.restrictedRoutes(Router()))
    // serving static files
    this.app.use(express.static("public"))
  }

}
