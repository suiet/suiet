import * as bip39 from '@scure/bip39';
import { Ed25519HdKey } from './hdkey';
import { decryptMnemonic } from '../crypto';
import { SHA3 } from 'sha3';
import { Buffer } from 'buffer';
import { UnsignedTx, SignedTx } from './types';
import * as crypto from '../crypto';

const ED25519_ADDRESS_PREFIX = 0x0;

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
  public static async generate(): Promise<Vault> {
    const mnemonic = crypto.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = await Ed25519HdKey.fromMasterSeed(Buffer.from(seed));
    return new Vault(master);
  }

  public getAddress(): string {
    const keyWithPrefix = new Uint8Array(32 + 1);
    keyWithPrefix.set([ED25519_ADDRESS_PREFIX]);
    keyWithPrefix.set(this.hdKey.getPrivateKey(), 1);
    const publicHash = new SHA3(256)
      .update(Buffer.from(keyWithPrefix))
      .digest();
    return '0x' + Buffer.from(publicHash.slice(0, 20)).toString('hex');
  }

  public getPublicKey(): string {
    return this.hdKey.getPublicHexString();
  }

  public async signTransaction(unsigned: UnsignedTx): Promise<SignedTx> {
    const signature = this.hdKey.sign(Buffer.from(unsigned.data.getData()));
    return {
      data: unsigned.data,
      signature,
      pubKey: this.hdKey.getPublicKey(),
    };
  }
}
