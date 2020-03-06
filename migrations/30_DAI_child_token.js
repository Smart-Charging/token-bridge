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
const ChildBridgeHead = artifacts.require('ChildBridgeHead')
const ChildToken = artifacts.require('ChildToken')

module.exports = function (deployer, network) {
  // only deploy this contract to poa, tobalaba and EWF mainnet
  if (('poa - tobalaba - ewf-main').indexOf(network) > -1) {
      deployer.deploy(ChildToken, 'EWF-DAI', 'EWDAI', 18)
        .then(dct => dct.addMinter(ChildBridgeHead.address))
  }
}
