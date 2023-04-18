import * as bip39 from '@scure/bip39';
import { Ed25519HdKey } from './hdkey';
import { decryptMnemonic } from '../crypto';
import { Buffer } from 'buffer';
import { UnsignedTx, SignedTx } from './types';
import { blake2b } from '@noble/hashes/blake2b';
import {
  SIGNATURE_SCHEME_TO_FLAG,
  SUI_ADDRESS_LENGTH,
  normalizeSuiAddress,
  SignedMessage,
  RawSigner,
  JsonRpcProvider,
  fromB64,
} from '@mysten/sui.js';
import { createKeypair } from '../utils/vault';

export class Vault {
  hdKey: Ed25519HdKey;

  constructor(hdKey: Ed25519HdKey) {
    this.hdKey = hdKey;
  }

  public static async create(
    path: string,
    token: Buffer,
    encryptedMnemonic: string
  ): Promise<Vault> {
    const mnemonic = decryptMnemonic(token, encryptedMnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = await Ed25519HdKey.fromMasterSeed(Buffer.from(seed));
    const hdKey = await master.derive(path);
    return new Vault(hdKey);
  }

  // Used for testing
  public static async fromMnemonic(
    path: string,
    mnemonic: string
  ): Promise<Vault> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = await Ed25519HdKey.fromMasterSeed(Buffer.from(seed));
    return new Vault(await master.derive(path));
  }

  public getAddress(): string {
    const keyWithPrefix = new Uint8Array(32 + 1);
    keyWithPrefix.set([SIGNATURE_SCHEME_TO_FLAG['ED25519']]);
    keyWithPrefix.set(this.hdKey.getPublicKey(), 1);
    const publicHash = blake2b(keyWithPrefix, { dkLen: 32 });
    return normalizeSuiAddress(
      Buffer.from(publicHash.slice(0, SUI_ADDRESS_LENGTH * 2)).toString('hex')
    );
  }

  public getPublicKey(): string {
    const pubKey = this.hdKey.getPublicHexString();
    return pubKey;
  }
}
