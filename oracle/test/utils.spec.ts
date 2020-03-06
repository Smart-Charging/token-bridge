import { assert } from "chai"
import * as path from 'path'
import { Wallet } from 'ethers'
const crypto = require('crypto')
const EthCrypto = require('eth-crypto');

describe('fake tests', function () {
  it('gets random bytes', function () {
    console.log(crypto.randomBytes(16).toString('hex'))
  })
  it('outputs the current directory', function () {
    console.log(path.resolve(__dirname))
  })

  it('can encrypt and decrypt using an ETH key-pair', async function () {
    const alice: any = {
      privateKey: '011CE6A10DFED82F2A9BC0B906224DBAFC1E2554A2D56943733366F7D5F09C73'
    };
    alice.publicKey = EthCrypto.publicKeyByPrivateKey(alice.privateKey)

    const bob: any = {
      privateKey: '06ED0616BB794FA8D0E4FF16EB8C2E2C282E7721909E30C8A4C720944B9E8944'
    };
    bob.publicKey = EthCrypto.publicKeyByPrivateKey(bob.privateKey)

    const secretMessage = 'Encrypted message';

    const signature = EthCrypto.sign(
      alice.privateKey,
      EthCrypto.hash.keccak256(secretMessage)
    );
    const payload = {
      message: secretMessage,
      signature
    };
    const encrypted = await EthCrypto.encryptWithPublicKey(
      bob.publicKey, // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
      JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
    );

// we convert the object into a smaller string-representation
    const encryptedString = EthCrypto.cipher.stringify(encrypted);

// we parse the string into the object again
    const encryptedObject = EthCrypto.cipher.parse(encryptedString);

    const decrypted = await EthCrypto.decryptWithPrivateKey(
      bob.privateKey,
      encryptedObject
    );
    const decryptedPayload = JSON.parse(decrypted);

// check signature
    const senderAddress = EthCrypto.recover(
      decryptedPayload.signature,
      EthCrypto.hash.keccak256(decryptedPayload.message)
    );

    assert.equal(senderAddress, (new Wallet(alice.privateKey)).address)
    assert.equal(decryptedPayload.message, 'Encrypted message')

  })
})
