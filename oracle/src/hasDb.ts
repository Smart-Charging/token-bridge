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

export class HasDb {
  constructor(private client: MongoClient) {
  }

  public get db() {
    if (!this.client.isConnected()) {
      return this.client.connect().then((cli) => cli.db("atomic-swap"))
    } else {
      return this.client.db("atomic-swap")
    }
  }

}
