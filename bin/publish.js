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
const fs = require('fs-promise')
const path = require('path')
const Web3 = require('web3')
const contract = require('truffle-contract')

// there is no need to create the JSON files for the dev environment. we can use the POA chain for testing
const network = process.argv[2] || 'poa'
const config = require('../truffle-config').networks[network]
// if the provider is a function (i.e. HD wallet) then take that, else instantiate an http provider
const provider = config.provider ? config.provider() : new Web3.providers.HttpProvider(`http://${config.host}:${config.port}`)
const web3 = new Web3(provider)

const contracts = [
  {
    name: 'ParentBridgeHead',
    chain: 'poa - kovan - mainnet'
  },
  {
    name: 'ChildBridgeHead',
    chain: 'poa - tobalaba'
  },
  {
    name: 'ParentToken',
    chain: 'poa - kovan'
  },
  {
    name: 'ChildToken',
    chain: 'poa - tobalaba'
  }
]

const isProduction = network === 'production'

async function publish() {
  const promises = contracts.map(async ctrct => {
    return new Promise((resolve, reject) => {
      if (ctrct.chain.indexOf(network) > -1) {
        const instance = contract(require('../build/contracts/' + ctrct.name))
        instance.setProvider(provider)
        instance.detectNetwork().then(() => {
          resolve({
            name: instance.contractName,
            abi: instance.abi,
            address: instance.address,
            bytecode: instance.bytecode
          })
        })
      } else {
        resolve('network not applicable')
      }
    })
  })
  const config = {}
  const result = await Promise.all(promises)
  result.forEach(contract => {
    // contract not deployed to the chain will not have names
    if(contract && contract.name){
      config[contract.name] = {
        abi: contract.abi,
        address: contract.address,
        bytecode: contract.bytecode
      }
    }
  })

  const fileName = `contract.defs.${network}.json`

  try{
    await fs.writeFile(path.resolve(__dirname) + '/../' + fileName, JSON.stringify(config, null, 3))
  } catch (e) {
    console.error(e)
  }
}

publish()
  .then(() => process.exit())
  .catch(console.err)
