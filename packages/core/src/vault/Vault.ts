import * as bip39 from '@scure/bip39';
import { Ed25519HdKey } from './hdkey';
import { decryptMnemonic } from '../crypto';
import { Buffer } from 'buffer';
import { UnsignedTx, SignedTx, SignedMessage } from './types';
import { blake2b } from '@noble/hashes/blake2b';
import {
  SIGNATURE_SCHEME_TO_FLAG,
  SUI_ADDRESS_LENGTH,
  normalizeSuiAddress,
} from '@mysten/sui.js';

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

  public async signTransaction(unsigned: UnsignedTx): Promise<SignedTx> {
    const signature = await this.hdKey.sign(Buffer.from(unsigned.data));
    const pubKey = await this.hdKey.getPublicKey();
    return {
      data: unsigned.data,
      signature,
      pubKey,
    };
  }

  public async signMessage(
    message: Uint8Array | string
  ): Promise<SignedMessage> {
    function Uint8ArrayToBuffer(bytes: Uint8Array) {
      const buffer = Buffer.alloc(bytes.byteLength);
      for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = bytes[i];
      }
      return buffer;
    }
    const buffer =
      message instanceof Uint8Array
        ? Uint8ArrayToBuffer(message)
        : Buffer.from(message);
    const signature = await this.hdKey.sign(buffer);
    const pubKey = await this.hdKey.getPublicKey();
    return {
      signature,
      pubKey,
    };
  }
}
