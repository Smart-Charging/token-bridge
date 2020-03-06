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
export const contractDefs = {
   ParentBridgeHead: {
      abi: [
         {
            constant: false,
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "prefix",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "oracle",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "",
                  type: "bytes32",
               },
            ],
            name: "executedTransactions",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "isOwner",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
               {
                  name: "authorizedSigner",
                  type: "address",
               },
            ],
            name: "verifySignature",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "newOwner",
                  type: "address",
               },
            ],
            name: "transferOwnership",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "getSigner",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "pure",
            type: "function",
         },
         {
            inputs: [
               {
                  name: "_oracle",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "previousOwner",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "newOwner",
                  type: "address",
               },
            ],
            name: "OwnershipTransferred",
            type: "event",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "_oracle",
                  type: "address",
               },
            ],
            name: "setOracle",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "from",
                  type: "address",
               },
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "amount",
                  type: "uint256",
               },
               {
                  name: "token",
                  type: "address",
               },
               {
                  name: "nonce",
                  type: "uint256",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "transfer",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
      ],
      bytecode: "0x608060405234801561001057600080fd5b5060405160208061082d8339810180604052602081101561003057600080fd5b505160008054600160a060020a03191633178082556040518392600160a060020a039290921691907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3600160a060020a03811615156100a45760028054600160a060020a031916331790556100c0565b60028054600160a060020a031916600160a060020a0383161790555b505061075c806100d16000396000f3fe608060405234801561001057600080fd5b50600436106100c6576000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b1161008e5780638da5cb5b146101cd5780638f32d59b146101d5578063a044ed91146101dd578063e721d58d1461021e578063f2fde38b14610278578063f96ddf7a1461029e576100c6565b8063715018a6146100cb57806375dadb32146100d55780637adbf973146101525780637dc0d1d0146101785780638691d34c1461019c575b600080fd5b6100d36102d0565b005b6100dd61033a565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101175781810151838201526020016100ff565b50505050905090810190601f1680156101445780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100d36004803603602081101561016857600080fd5b5035600160a060020a0316610371565b6101806103b3565b60408051600160a060020a039092168252519081900360200190f35b6101b9600480360360208110156101b257600080fd5b50356103c2565b604080519115158252519081900360200190f35b6101806103d7565b6101b96103e6565b610180600480360360a08110156101f357600080fd5b50803590602081013560ff169060408101359060608101359060800135600160a060020a03166103f7565b6100d3600480360361010081101561023557600080fd5b50600160a060020a038135811691602081013582169160408201359160608101359091169060808101359060ff60a0820135169060c08101359060e0013561045e565b6100d36004803603602081101561028e57600080fd5b5035600160a060020a031661058c565b610180600480360360808110156102b457600080fd5b5080359060ff60208201351690604081013590606001356105ab565b6102d86103e6565b15156102e357600080fd5b60008054604051600160a060020a03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36000805473ffffffffffffffffffffffffffffffffffffffff19169055565b60408051808201909152601c81527f19457468657265756d205369676e6564204d6573736167653a0a333200000000602082015281565b6103796103e6565b151561038457600080fd5b6002805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600254600160a060020a031681565b60016020526000908152604090205460ff1681565b600054600160a060020a031690565b600054600160a060020a0316331490565b60008581526001602052604081205460ff161561041357600080fd5b60008681526001602081905260408220805460ff1916909117905561043a878787876105ab565b9050600160a060020a038082169084161461045457600080fd5b9695505050505050565b604080516c01000000000000000000000000600160a060020a03808c168202602080850191909152818c1683026034850152604884018b9052818a169092026068840152607c80840189905284518085039091018152609c909301909352815191012060025490916104d8918391879187918791166103f7565b5085600160a060020a031663a9059cbb89896040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b15801561055557600080fd5b505af1158015610569573d6000803e3d6000fd5b505050506040513d602081101561057f57600080fd5b5050505050505050505050565b6105946103e6565b151561059f57600080fd5b6105a8816106b3565b50565b600060016040805190810160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250866040516020018083805190602001908083835b602083106106185780518252601f1990920191602091820191016105f9565b51815160209384036101000a600019018019909216911617905292019384525060408051808503815284830180835281519184019190912060009091528185018083525260ff8a1660608501526080840189905260a084018890525160c080850195509193601f198201935081900390910190855afa15801561069f573d6000803e3d6000fd5b5050604051601f1901519695505050505050565b600160a060020a03811615156106c857600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039290921691909117905556fea165627a7a72305820ee6e431aba5fb99862991c9bcd1caec08c1a2046e7d1a44d658b6e418505568a0029",
   },
   ChildBridgeHead: {
      abi: [
         {
            constant: false,
            inputs: [],
            name: "renounceOwnership",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "prefix",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "_oracle",
                  type: "address",
               },
            ],
            name: "setOracle",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "oracle",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "",
                  type: "bytes32",
               },
            ],
            name: "executedTransactions",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "owner",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "isOwner",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
               {
                  name: "authorizedSigner",
                  type: "address",
               },
            ],
            name: "verifySignature",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "newOwner",
                  type: "address",
               },
            ],
            name: "transferOwnership",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "getSigner",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "pure",
            type: "function",
         },
         {
            inputs: [
               {
                  name: "_oracle",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "previousOwner",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "newOwner",
                  type: "address",
               },
            ],
            name: "OwnershipTransferred",
            type: "event",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "amount",
                  type: "uint256",
               },
               {
                  name: "token",
                  type: "address",
               },
               {
                  name: "nonce",
                  type: "uint256",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "burn",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "from",
                  type: "address",
               },
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "amount",
                  type: "uint256",
               },
               {
                  name: "token",
                  type: "address",
               },
               {
                  name: "nonce",
                  type: "uint256",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "mint",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
      ],
      bytecode: "0x608060405234801561001057600080fd5b5060405160208061090b8339810180604052602081101561003057600080fd5b505160008054600160a060020a03191633178082556040518392600160a060020a039290921691907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3600160a060020a03811615156100a45760028054600160a060020a031916331790556100c0565b60028054600160a060020a031916600160a060020a0383161790555b505061083a806100d16000396000f3fe608060405234801561001057600080fd5b50600436106100b85760003560e060020a900480638691d34c116100755780638691d34c1461022f5780638da5cb5b146102605780638f32d59b14610268578063a044ed9114610270578063f2fde38b146102b1578063f96ddf7a146102d7576100b8565b8063428908e8146100bd5780634a4274c414610106578063715018a61461016057806375dadb32146101685780637adbf973146101e55780637dc0d1d01461020b575b600080fd5b610104600480360360c08110156100d357600080fd5b50803590600160a060020a036020820135169060408101359060ff6060820135169060808101359060a00135610309565b005b610104600480360361010081101561011d57600080fd5b50600160a060020a038135811691602081013582169160408201359160608101359091169060808101359060ff60a0820135169060c08101359060e001356103d4565b6101046104dc565b610170610546565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101aa578181015183820152602001610192565b50505050905090810190601f1680156101d75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610104600480360360208110156101fb57600080fd5b5035600160a060020a031661057d565b6102136105bf565b60408051600160a060020a039092168252519081900360200190f35b61024c6004803603602081101561024557600080fd5b50356105ce565b604080519115158252519081900360200190f35b6102136105e3565b61024c6105f2565b610213600480360360a081101561028657600080fd5b50803590602081013560ff169060408101359060608101359060800135600160a060020a0316610603565b610104600480360360208110156102c757600080fd5b5035600160a060020a031661066a565b610213600480360360808110156102ed57600080fd5b5080359060ff6020820135169060408101359060600135610689565b604080516020808201899052600160a060020a038881166c01000000000000000000000000028385015260548084018990528451808503909101815260749093019093528151910120600254909161036991839187918791879116610603565b5085600160a060020a03166342966c68886040518263ffffffff1660e060020a02815260040180828152602001915050600060405180830381600087803b1580156103b357600080fd5b505af11580156103c7573d6000803e3d6000fd5b5050505050505050505050565b604080516c01000000000000000000000000600160a060020a03808c168202602080850191909152818c1683026034850152604884018b9052818a169092026068840152607c80840189905284518085039091018152609c9093019093528151910120600254909161044e91839187918791879116610603565b5085600160a060020a03166340c10f1989896040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b1580156104b257600080fd5b505af11580156104c6573d6000803e3d6000fd5b505050506040513d60208110156103c757600080fd5b6104e46105f2565b15156104ef57600080fd5b60008054604051600160a060020a03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36000805473ffffffffffffffffffffffffffffffffffffffff19169055565b60408051808201909152601c81527f19457468657265756d205369676e6564204d6573736167653a0a333200000000602082015281565b6105856105f2565b151561059057600080fd5b6002805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b600254600160a060020a031681565b60016020526000908152604090205460ff1681565b600054600160a060020a031690565b600054600160a060020a0316331490565b60008581526001602052604081205460ff161561061f57600080fd5b60008681526001602081905260408220805460ff1916909117905561064687878787610689565b9050600160a060020a038082169084161461066057600080fd5b9695505050505050565b6106726105f2565b151561067d57600080fd5b61068681610791565b50565b600060016040805190810160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250866040516020018083805190602001908083835b602083106106f65780518252601f1990920191602091820191016106d7565b51815160209384036101000a600019018019909216911617905292019384525060408051808503815284830180835281519184019190912060009091528185018083525260ff8a1660608501526080840189905260a084018890525160c080850195509193601f198201935081900390910190855afa15801561077d573d6000803e3d6000fd5b5050604051601f1901519695505050505050565b600160a060020a03811615156107a657600080fd5b60008054604051600160a060020a03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039290921691909117905556fea165627a7a72305820feb1e143f0fb3219c97deb111bc41e0c00a9df936c03492637e7b6aaf502b96c0029",
   },
   ParentToken: {
      abi: [
         {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "approve",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "from",
                  type: "address",
               },
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "transferFrom",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
               {
                  name: "",
                  type: "uint8",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "addedValue",
                  type: "uint256",
               },
            ],
            name: "increaseAllowance",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "mint",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "owner",
                  type: "address",
               },
            ],
            name: "balanceOf",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "account",
                  type: "address",
               },
            ],
            name: "addMinter",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [],
            name: "renounceMinter",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "subtractedValue",
                  type: "uint256",
               },
            ],
            name: "decreaseAllowance",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "transfer",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "account",
                  type: "address",
               },
            ],
            name: "isMinter",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "owner",
                  type: "address",
               },
               {
                  name: "spender",
                  type: "address",
               },
            ],
            name: "allowance",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            inputs: [
               {
                  name: "name",
                  type: "string",
               },
               {
                  name: "symbol",
                  type: "string",
               },
               {
                  name: "decimals",
                  type: "uint8",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "account",
                  type: "address",
               },
            ],
            name: "MinterAdded",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "account",
                  type: "address",
               },
            ],
            name: "MinterRemoved",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "from",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "to",
                  type: "address",
               },
               {
                  indexed: false,
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "Transfer",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "owner",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "spender",
                  type: "address",
               },
               {
                  indexed: false,
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "Approval",
            type: "event",
         },
      ],
      bytecode: "0x60806040523480156200001157600080fd5b5060405162000cd938038062000cd9833981018060405260608110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b820160208101848111156200006457600080fd5b81516401000000008111828201871017156200007f57600080fd5b505092919060200180516401000000008111156200009c57600080fd5b82016020810184811115620000b057600080fd5b8151640100000000811182820187101715620000cb57600080fd5b50506020909101519092509050828282620000ef336401000000006200013b810204565b82516200010490600490602086019062000220565b5081516200011a90600590602085019062000220565b506006805460ff191660ff9290921691909117905550620002c59350505050565b620001566003826401000000006200093e6200018d82021704565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b600160a060020a0381161515620001a357600080fd5b620001b88282640100000000620001e8810204565b15620001c357600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b6000600160a060020a03821615156200020057600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200026357805160ff191683800117855562000293565b8280016001018555821562000293579182015b828111156200029357825182559160200191906001019062000276565b50620002a1929150620002a5565b5090565b620002c291905b80821115620002a15760008155600101620002ac565b90565b610a0480620002d56000396000f3fe608060405234801561001057600080fd5b5060043610610112576000357c01000000000000000000000000000000000000000000000000000000009004806370a08231116100b4578063a457c2d711610083578063a457c2d7146102f8578063a9059cbb14610324578063aa271e1a14610350578063dd62ed3e1461037657610112565b806370a082311461029a57806395d89b41146102c0578063983b2d56146102c857806398650275146102f057610112565b806323b872dd116100f057806323b872dd146101ee578063313ce56714610224578063395093511461024257806340c10f191461026e57610112565b806306fdde0314610117578063095ea7b31461019457806318160ddd146101d4575b600080fd5b61011f6103a4565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610159578181015183820152602001610141565b50505050905090810190601f1680156101865780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101c0600480360360408110156101aa57600080fd5b50600160a060020a03813516906020013561043a565b604080519115158252519081900360200190f35b6101dc610450565b60408051918252519081900360200190f35b6101c06004803603606081101561020457600080fd5b50600160a060020a03813581169160208101359091169060400135610456565b61022c6104ad565b6040805160ff9092168252519081900360200190f35b6101c06004803603604081101561025857600080fd5b50600160a060020a0381351690602001356104b6565b6101c06004803603604081101561028457600080fd5b50600160a060020a0381351690602001356104f2565b6101dc600480360360208110156102b057600080fd5b5035600160a060020a0316610512565b61011f61052d565b6102ee600480360360208110156102de57600080fd5b5035600160a060020a031661058e565b005b6102ee6105ae565b6101c06004803603604081101561030e57600080fd5b50600160a060020a0381351690602001356105b9565b6101c06004803603604081101561033a57600080fd5b50600160a060020a0381351690602001356105f5565b6101c06004803603602081101561036657600080fd5b5035600160a060020a0316610602565b6101dc6004803603604081101561038c57600080fd5b50600160a060020a038135811691602001351661061b565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104305780601f1061040557610100808354040283529160200191610430565b820191906000526020600020905b81548152906001019060200180831161041357829003601f168201915b5050505050905090565b6000610447338484610646565b50600192915050565b60025490565b60006104638484846106d2565b600160a060020a0384166000908152600160209081526040808320338085529252909120546104a391869161049e908663ffffffff61079f16565b610646565b5060019392505050565b60065460ff1690565b336000818152600160209081526040808320600160a060020a0387168452909152812054909161044791859061049e908663ffffffff6107b416565b60006104fd33610602565b151561050857600080fd5b61044783836107cd565b600160a060020a031660009081526020819052604090205490565b60058054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104305780601f1061040557610100808354040283529160200191610430565b61059733610602565b15156105a257600080fd5b6105ab81610877565b50565b6105b7336108bf565b565b336000818152600160209081526040808320600160a060020a0387168452909152812054909161044791859061049e908663ffffffff61079f16565b60006104473384846106d2565b600061061560038363ffffffff61090716565b92915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b600160a060020a038216151561065b57600080fd5b600160a060020a038316151561067057600080fd5b600160a060020a03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b600160a060020a03821615156106e757600080fd5b600160a060020a038316600090815260208190526040902054610710908263ffffffff61079f16565b600160a060020a038085166000908152602081905260408082209390935590841681522054610745908263ffffffff6107b416565b600160a060020a038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b6000828211156107ae57600080fd5b50900390565b6000828201838110156107c657600080fd5b9392505050565b600160a060020a03821615156107e257600080fd5b6002546107f5908263ffffffff6107b416565b600255600160a060020a038216600090815260208190526040902054610821908263ffffffff6107b416565b600160a060020a0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b61088860038263ffffffff61093e16565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b6108d060038263ffffffff61098c16565b604051600160a060020a038216907fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb6669290600090a250565b6000600160a060020a038216151561091e57600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b600160a060020a038116151561095357600080fd5b61095d8282610907565b1561096757600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b600160a060020a03811615156109a157600080fd5b6109ab8282610907565b15156109b657600080fd5b600160a060020a0316600090815260209190915260409020805460ff1916905556fea165627a7a72305820b1ba0101734317e54311b166572f8c2637e683271664ad5dc9e7fc8b9930c6ac0029",
   },
   ChildToken: {
      abi: [
         {
            constant: true,
            inputs: [],
            name: "name",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "approve",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "totalSupply",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "from",
                  type: "address",
               },
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "transferFrom",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [
               {
                  name: "",
                  type: "uint8",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "addedValue",
                  type: "uint256",
               },
            ],
            name: "increaseAllowance",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "mint",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "burn",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "owner",
                  type: "address",
               },
            ],
            name: "balanceOf",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "from",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "burnFrom",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [],
            name: "symbol",
            outputs: [
               {
                  name: "",
                  type: "string",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "account",
                  type: "address",
               },
            ],
            name: "addMinter",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [],
            name: "renounceMinter",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "spender",
                  type: "address",
               },
               {
                  name: "subtractedValue",
                  type: "uint256",
               },
            ],
            name: "decreaseAllowance",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "transfer",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "account",
                  type: "address",
               },
            ],
            name: "isMinter",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "owner",
                  type: "address",
               },
               {
                  name: "spender",
                  type: "address",
               },
            ],
            name: "allowance",
            outputs: [
               {
                  name: "",
                  type: "uint256",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            inputs: [
               {
                  name: "name",
                  type: "string",
               },
               {
                  name: "symbol",
                  type: "string",
               },
               {
                  name: "decimals",
                  type: "uint8",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "account",
                  type: "address",
               },
            ],
            name: "MinterAdded",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "account",
                  type: "address",
               },
            ],
            name: "MinterRemoved",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "from",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "to",
                  type: "address",
               },
               {
                  indexed: false,
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "Transfer",
            type: "event",
         },
         {
            anonymous: false,
            inputs: [
               {
                  indexed: true,
                  name: "owner",
                  type: "address",
               },
               {
                  indexed: true,
                  name: "spender",
                  type: "address",
               },
               {
                  indexed: false,
                  name: "value",
                  type: "uint256",
               },
            ],
            name: "Approval",
            type: "event",
         },
      ],
      bytecode: "0x60806040523480156200001157600080fd5b5060405162000e3e38038062000e3e833981018060405260608110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b820160208101848111156200006457600080fd5b81516401000000008111828201871017156200007f57600080fd5b505092919060200180516401000000008111156200009c57600080fd5b82016020810184811115620000b057600080fd5b8151640100000000811182820187101715620000cb57600080fd5b50506020909101519092509050828282620000ef336401000000006200013b810204565b82516200010490600490602086019062000220565b5081516200011a90600590602085019062000220565b506006805460ff191660ff9290921691909117905550620002c59350505050565b6200015660038264010000000062000aa36200018d82021704565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b600160a060020a0381161515620001a357600080fd5b620001b88282640100000000620001e8810204565b15620001c357600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b6000600160a060020a03821615156200020057600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200026357805160ff191683800117855562000293565b8280016001018555821562000293579182015b828111156200029357825182559160200191906001019062000276565b50620002a1929150620002a5565b5090565b620002c291905b80821115620002a15760008155600101620002ac565b90565b610b6980620002d56000396000f3fe608060405234801561001057600080fd5b5060043610610128576000357c01000000000000000000000000000000000000000000000000000000009004806370a08231116100bf578063986502751161008e578063986502751461034f578063a457c2d714610357578063a9059cbb14610383578063aa271e1a146103af578063dd62ed3e146103d557610128565b806370a08231146102cf57806379cc6790146102f557806395d89b4114610321578063983b2d561461032957610128565b8063313ce567116100fb578063313ce5671461023a578063395093511461025857806340c10f191461028457806342966c68146102b057610128565b806306fdde031461012d578063095ea7b3146101aa57806318160ddd146101ea57806323b872dd14610204575b600080fd5b610135610403565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561016f578181015183820152602001610157565b50505050905090810190601f16801561019c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101d6600480360360408110156101c057600080fd5b50600160a060020a038135169060200135610499565b604080519115158252519081900360200190f35b6101f26104af565b60408051918252519081900360200190f35b6101d66004803603606081101561021a57600080fd5b50600160a060020a038135811691602081013590911690604001356104b5565b61024261050c565b6040805160ff9092168252519081900360200190f35b6101d66004803603604081101561026e57600080fd5b50600160a060020a038135169060200135610515565b6101d66004803603604081101561029a57600080fd5b50600160a060020a038135169060200135610551565b6102cd600480360360208110156102c657600080fd5b5035610571565b005b6101f2600480360360208110156102e557600080fd5b5035600160a060020a031661057e565b6102cd6004803603604081101561030b57600080fd5b50600160a060020a038135169060200135610599565b6101356105a7565b6102cd6004803603602081101561033f57600080fd5b5035600160a060020a0316610608565b6102cd610625565b6101d66004803603604081101561036d57600080fd5b50600160a060020a038135169060200135610630565b6101d66004803603604081101561039957600080fd5b50600160a060020a03813516906020013561066c565b6101d6600480360360208110156103c557600080fd5b5035600160a060020a0316610679565b6101f2600480360360408110156103eb57600080fd5b50600160a060020a0381358116916020013516610692565b60048054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561048f5780601f106104645761010080835404028352916020019161048f565b820191906000526020600020905b81548152906001019060200180831161047257829003601f168201915b5050505050905090565b60006104a63384846106bd565b50600192915050565b60025490565b60006104c2848484610749565b600160a060020a0384166000908152600160209081526040808320338085529252909120546105029186916104fd908663ffffffff61081616565b6106bd565b5060019392505050565b60065460ff1690565b336000818152600160209081526040808320600160a060020a038716845290915281205490916104a69185906104fd908663ffffffff61082b16565b600061055c33610679565b151561056757600080fd5b6104a68383610844565b61057b33826108ee565b50565b600160a060020a031660009081526020819052604090205490565b6105a38282610997565b5050565b60058054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281526060939092909183018282801561048f5780601f106104645761010080835404028352916020019161048f565b61061133610679565b151561061c57600080fd5b61057b816109dc565b61062e33610a24565b565b336000818152600160209081526040808320600160a060020a038716845290915281205490916104a69185906104fd908663ffffffff61081616565b60006104a6338484610749565b600061068c60038363ffffffff610a6c16565b92915050565b600160a060020a03918216600090815260016020908152604080832093909416825291909152205490565b600160a060020a03821615156106d257600080fd5b600160a060020a03831615156106e757600080fd5b600160a060020a03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b600160a060020a038216151561075e57600080fd5b600160a060020a038316600090815260208190526040902054610787908263ffffffff61081616565b600160a060020a0380851660009081526020819052604080822093909355908416815220546107bc908263ffffffff61082b16565b600160a060020a038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008282111561082557600080fd5b50900390565b60008282018381101561083d57600080fd5b9392505050565b600160a060020a038216151561085957600080fd5b60025461086c908263ffffffff61082b16565b600255600160a060020a038216600090815260208190526040902054610898908263ffffffff61082b16565b600160a060020a0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b600160a060020a038216151561090357600080fd5b600254610916908263ffffffff61081616565b600255600160a060020a038216600090815260208190526040902054610942908263ffffffff61081616565b600160a060020a038316600081815260208181526040808320949094558351858152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a35050565b6109a182826108ee565b600160a060020a0382166000908152600160209081526040808320338085529252909120546105a39184916104fd908563ffffffff61081616565b6109ed60038263ffffffff610aa316565b604051600160a060020a038216907f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f690600090a250565b610a3560038263ffffffff610af116565b604051600160a060020a038216907fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb6669290600090a250565b6000600160a060020a0382161515610a8357600080fd5b50600160a060020a03166000908152602091909152604090205460ff1690565b600160a060020a0381161515610ab857600080fd5b610ac28282610a6c565b15610acc57600080fd5b600160a060020a0316600090815260209190915260409020805460ff19166001179055565b600160a060020a0381161515610b0657600080fd5b610b108282610a6c565b1515610b1b57600080fd5b600160a060020a0316600090815260209190915260409020805460ff1916905556fea165627a7a72305820179ccb07ea3c5ebc340c3129193586a183df005ebe6a3b11e2e2fa13a7e546b90029",
   },
   Utils: {
      abi: [
         {
            constant: true,
            inputs: [
               {
                  name: "",
                  type: "bytes32",
               },
            ],
            name: "executedTransactions",
            outputs: [
               {
                  name: "",
                  type: "bool",
               },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
         },
         {
            constant: true,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
            ],
            name: "getSigner",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "pure",
            type: "function",
         },
         {
            constant: false,
            inputs: [
               {
                  name: "paramHash",
                  type: "bytes32",
               },
               {
                  name: "v",
                  type: "uint8",
               },
               {
                  name: "r",
                  type: "bytes32",
               },
               {
                  name: "s",
                  type: "bytes32",
               },
               {
                  name: "authorizedSigner",
                  type: "address",
               },
            ],
            name: "verifySignature",
            outputs: [
               {
                  name: "",
                  type: "address",
               },
            ],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
         },
      ],
      bytecode: "0x608060405234801561001057600080fd5b50610426806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680638691d34c1461005c578063a044ed91146100af578063f96ddf7a1461016b575b600080fd5b34801561006857600080fd5b506100956004803603602081101561007f57600080fd5b8101908080359060200190929190505050610207565b604051808215151515815260200191505060405180910390f35b3480156100bb57600080fd5b50610129600480360360a08110156100d257600080fd5b8101908080359060200190929190803560ff1690602001909291908035906020019092919080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610227565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561017757600080fd5b506101c56004803603608081101561018e57600080fd5b8101908080359060200190929190803560ff16906020019092919080359060200190929190803590602001909291905050506102d7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006020528060005260406000206000915054906101000a900460ff1681565b600080600087815260200190815260200160002060009054906101000a900460ff1615151561025557600080fd5b600160008088815260200190815260200160002060006101000a81548160ff021916908315150217905550600061028e878787876102d7565b90508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415156102ca57600080fd5b8091505095945050505050565b600060016040805190810160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250866040516020018083805190602001908083835b60208310151561034a5780518252602082019150602081019050602083039250610325565b6001836020036101000a038019825116818451168082178552505050505050905001828152602001925050506040516020818303038152906040528051906020012085858560405160008152602001604052604051808581526020018460ff1660ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa1580156103e6573d6000803e3d6000fd5b50505060206040510351905094935050505056fea165627a7a723058206461ba78696320173ee3118f46507476e2039fb042ff988864a408f046fec7a70029",
   },
   Wallet: {
      abi: [
         {
            constant: false,
            inputs: [
               {
                  name: "token",
                  type: "address",
               },
               {
                  name: "to",
                  type: "address",
               },
               {
                  name: "amount",
                  type: "uint256",
               },
            ],
            name: "transfer",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
            signature: "0xbeabacc8",
         },
      ],
      bytecode: "0x608060405234801561001057600080fd5b506101d1806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063beabacc814610046575b600080fd5b34801561005257600080fd5b506100bf6004803603606081101561006957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506100c1565b005b8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050602060405180830381600087803b15801561016457600080fd5b505af1158015610178573d6000803e3d6000fd5b505050506040513d602081101561018e57600080fd5b81019080805190602001909291905050505050505056fea165627a7a72305820b181dae4e6856432d3525e01339ff69d3f8509d820cbb26d04b512010a8800590029",
   },
}
