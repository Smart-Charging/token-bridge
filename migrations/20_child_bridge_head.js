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

module.exports = function (deployer, network) {
  // only deploy this contract to poa, tobalaba and EWF mainnet
  if (('poa - tobalaba').indexOf(network) > -1) {
    deployer.deploy(ChildBridgeHead, '0x006587aCbeD7EA97d43AEEDB69E4a5c02956943b')
  } else if (('ewf-main').indexOf(network) > -1) {
    deployer.deploy(ChildBridgeHead, '0x0000000000000000000000000000000000000000')
  }
}
