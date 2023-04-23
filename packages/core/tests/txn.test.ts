import { Vault } from '../src/vault/Vault';
import * as crypto from '../src/crypto';
import * as tweetnacl from 'tweetnacl';
import {
  IntentScope,
  JsonRpcProvider,
  fromSerializedSignature,
  messageWithIntent,
  fromB64,
} from '@mysten/sui.js';
import { TxProvider } from '../src/provider';
import { blake2b } from '@noble/hashes/blake2b';

test('generateMnemonic', async () => {
  const mnemonic = crypto.generateMnemonic();
  expect(typeof mnemonic === 'string').toBeTruthy();
  expect(mnemonic.split(' ').length).toEqual(12);
});

describe('signMessage', () => {
  test('input uint8array as message', async () => {
    const MNEMONIC =
      'galaxy buyer grab update result comfort example budget word frog teach mask';
    const vault = await Vault.fromMnemonic(
      crypto.derivationHdPath(0),
      MNEMONIC
    );
    const provider = new TxProvider(new JsonRpcProvider());
    const signedMsg = await provider.signMessage(
      new TextEncoder().encode('hello world'),
      vault
    );
    const signature = fromSerializedSignature(signedMsg.signature);
    const message = messageWithIntent(
      IntentScope.PersonalMessage,
      fromB64(signedMsg.messageBytes)
    );

    expect(
      tweetnacl.sign.detached.verify(
        blake2b(message, { dkLen: 32 }),
        signature.signature,
        signature.pubKey.toBytes()
      )
    ).toBeTruthy();
  });
});

describe('address', () => {
  test('address generation', async () => {
    const TEST_CASES = [
      [
        'film crazy soon outside stand loop subway crumble thrive popular green nuclear struggle pistol arm wife phrase warfare march wheat nephew ask sunny firm',
        '0xa2d14fad60c56049ecf75246a481934691214ce413e6a8ae2fe6834c173a6133',
      ],
      [
        'require decline left thought grid priority false tiny gasp angle royal system attack beef setup reward aunt skill wasp tray vital bounce inflict level',
        '0x1ada6e6f3f3e4055096f606c746690f1108fcc2ca479055cc434a3e1d3f758aa',
      ],
      [
        'organ crash swim stick traffic remember army arctic mesh slice swear summer police vast chaos cradle squirrel hood useless evidence pet hub soap lake',
        '0xe69e896ca10f5a77732769803cc2b5707f0ab9d4407afb5e4b4464b89769af14',
      ],
    ];

    for (const [mnemonic, address] of TEST_CASES) {
      const vault = await Vault.fromMnemonic(
        crypto.derivationHdPath(0),
        mnemonic
      );
      expect(vault.getAddress()).toEqual(address);
    }
  });
});
