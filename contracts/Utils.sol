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

contract Utils {
    // each transaction gets logged in order to avoid repeats
    mapping(bytes32 => bool) public executedTransactions;

    string constant private prefix = "\u0019Ethereum Signed Message:\n32";
    function getSigner(bytes32 paramHash, uint8 v, bytes32 r, bytes32 s) public pure returns(address) {
        return ecrecover(keccak256(abi.encodePacked(prefix, paramHash)), v, r, s);
    }

    function verifySignature (bytes32 paramHash, uint8 v, bytes32 r, bytes32 s, address authorizedSigner) public returns (address) {
        // check double execution
        require(!executedTransactions[paramHash]);
        // store executed hash
        executedTransactions[paramHash] = true;

        address signer = getSigner(paramHash, v, r, s);
        // only the oracle is allowed to sign
        require(signer == authorizedSigner);
        return signer;
    }
}
