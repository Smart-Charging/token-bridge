/*
    Copyright 2019-2020 eMobilify GmbH

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
pragma solidity >=0.5.0<0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "./BridgeHead.sol";

contract ChildBridgeHead is BridgeHead {

    constructor(address _oracle) BridgeHead(_oracle) public {}

    function burn(uint256 amount, address token, uint256 nonce, uint8 v, bytes32 r, bytes32 s) public {
        // compute the hash of the parameters to avoid double execution
        bytes32 paramHash = keccak256(abi.encodePacked(amount, token, nonce));
        verifySignature(paramHash, v, r, s, oracle);

        ERC20Burnable(token).burn(amount);
    }

    /**
    * the oracle can transfer tokens to any address
    * #sender is the address in the parent chain for which the tokens were locked
    * #recipient is the address which will get the tokens on the child chain
    */
    function mint(address from, address to, uint256 amount, address token, uint256 nonce, uint8 v, bytes32 r, bytes32 s) public {
        // compute the hash of the parameters to avoid double execution
        bytes32 paramHash = keccak256(abi.encodePacked(from, to, amount, token, nonce));
        verifySignature(paramHash, v, r, s, oracle);

        ERC20Mintable(token).mint(to, amount);
    }

}
