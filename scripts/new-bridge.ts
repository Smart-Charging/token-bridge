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
var request = require("request");

var options =
    { method: 'POST',
      url: 'https://token-bridge.nordicenergy.io/new-bridge',
      headers:
          { 'Content-Type': 'application/x-www-form-urlencoded' },
      form:
          { name:"xchf-eth2volta",
            parentUrl:"https://mainnet.infura.io/v3/b0b1afd85a9649d2b0856efcc6acb769",
            childUrl:"https://smartcharge-rpc.nordicenergy.io",
            parentTokenAddress:"0x15d99f5925615D83e7874567dD73930dE1141FFa",
            parentBridgeAddress:"0x359f160c7102E3988f64c157e0f6eC8206d1B2f2",
            childBridgeAddress:"0x41a4522aC82f8530503588E9666E2fF92d7842df",
            privateKey:"6C7A8BE3C67D73678591CFF229D9E6A17F449F7E5D2F9D6D953CE568B3D3F95A"
          }
    };

request(options, function (error, response, body) {
  if (error) {
    console.error(error);
  } else {
    console.log(response);
    console.log(body);
  }
});
