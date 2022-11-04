import { Vault } from '../src/vault/Vault';
import * as crypto from '../src/crypto';
import * as tweetnacl from 'tweetnacl';

// const RPC_URL = 'http://127.0.0.1:5001';
const RPC_URL = 'https://fullnode.devnet.sui.io';
const ADDRESS = '0x497c0b76ad06f09bd85012fe6a6e22f55f77eea0';
const OBJECT_ID = '0xe76fdca766fb603f3188ab88f0a9b4b799d54c37';
const MNEMONIC =
  'galaxy buyer grab update result comfort example budget word frog teach mask';
test('generateMnemonic', async () => {
  const mnemonic = crypto.generateMnemonic();
  expect(typeof mnemonic === 'string').toBeTruthy();
  expect(mnemonic.split(' ').length).toEqual(12);
});

describe('signMessage', async () => {
  test('input uint8array as message', async () => {
    const vault = await Vault.fromMnemonic(MNEMONIC);
    const signedMsg = await vault.signMessage(
      new TextEncoder().encode('hello world')
    );
    expect(vault.hdKey.getPublicKey().length).toEqual(32);
    expect(
      tweetnacl.sign.detached.verify(
        Buffer.from('hello world'),
        Buffer.from(signedMsg.signature),
        vault.hdKey.getPublicKey()
      )
    ).toBeTruthy();
  });
});
