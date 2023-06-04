import * as bip39 from '@scure/bip39';
import { Ed25519HdKey } from './hdkey';
import { decryptMnemonic, decryptPrivate } from '../crypto';
import { Buffer } from 'buffer';
import { blake2b } from '@noble/hashes/blake2b';
import {
  SIGNATURE_SCHEME_TO_FLAG,
  SUI_ADDRESS_LENGTH,
  normalizeSuiAddress,
} from '@mysten/sui.js';
import { Ed25519Key } from './key';

export interface Key {
  getPublicKey(): Buffer;
  getPublicHexString(): string;
  getPrivateKey(): Buffer;
  sign(message: Buffer): Buffer;
  verify(digest: Buffer, signature: Buffer): boolean;
}

export class Vault {
  key: Key;

  constructor(key: Key) {
    this.key = key;
  }

  public static async fromEncryptedMnemonic(
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

  public static async fromEncryptedPrivateKey(
    token: Buffer,
    encryptedPrivate: string
  ): Promise<Vault> {
    const key = new Ed25519Key(decryptPrivate(token, encryptedPrivate));
    return new Vault(key);
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
    keyWithPrefix.set(this.key.getPublicKey(), 1);
    const publicHash = blake2b(keyWithPrefix, { dkLen: 32 });
    return normalizeSuiAddress(
      Buffer.from(publicHash.slice(0, SUI_ADDRESS_LENGTH * 2)).toString('hex')
    );
  }

  public getPublicKey(): string {
    const pubKey = this.key.getPublicHexString();
    return pubKey;
  }

  public getPrivateKey(): Buffer {
    return this.key.getPrivateKey();
  }
}
