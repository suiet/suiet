import elliptic from 'elliptic';
import * as hmac from 'js-crypto-hmac';
import { Buffer } from 'buffer';

const MASTER_SECRET = 'ed25519 seed';

export class Ed25519HdKey {
  keyPair: elliptic.eddsa.KeyPair;
  chainCode: Buffer;

  constructor(key: Buffer, chainCode: Buffer) {
    this.keyPair = new elliptic.eddsa('ed25519').keyFromSecret(key);
    this.chainCode = chainCode;
  }

  public static async fromMasterSeed(seed: Buffer): Promise<Ed25519HdKey> {
    const key = await hmac.compute(Buffer.from(MASTER_SECRET), seed, 'SHA-512');
    return new Ed25519HdKey(
      Buffer.from(key.slice(0, 32)),
      Buffer.from(key.slice(32))
    );
  }

  public getPublicKey(): Buffer {
    return Buffer.from(this.keyPair.getPublic());
  }

  public getPublicHexString(): string {
    return '00' + this.keyPair.getPublic('hex');
  }

  public getPrivateKey(): Buffer {
    return this.keyPair.getSecret();
  }

  public sign(message: Buffer): Buffer {
    return Buffer.from(this.keyPair.sign(message).toBytes());
  }

  public verify(digest: Buffer, signature: Buffer): boolean {
    return this.keyPair.verify(digest, signature);
  }

  public async derive(path: string): Promise<Ed25519HdKey> {
    if (!/^[mM]'?/.test(path)) {
      throw new Error('Path must start with "m" or "M"');
    }
    if (/^[mM]'?$/.test(path)) {
      return this;
    }
    const parts = path.replace(/^[mM]'?\//, '').split('/');
    let key: Ed25519HdKey = this;

    for (const part of parts) {
      const m = /^(\d+)('?)$/.exec(part);
      if (!m || m.length !== 3) {
        throw new Error(`Invalid child index: ${part}`);
      }
      const idx = m[2] === "'" ? parseInt(m[1]) + 2 ** 31 : parseInt(m[1]);
      key = await key.deriveChild(idx);
    }

    return key;
  }

  public async deriveChild(index: number): Promise<Ed25519HdKey> {
    if (!this.keyPair || !this.chainCode) {
      throw new Error('No publicKey or chainCode set');
    }
    if (!isHardenedIndex(index)) {
      throw Error('Only hardened CKDPriv is supported for ed25519.');
    }

    const data: Buffer = Buffer.alloc(37);
    data.fill(this.keyPair.getSecret(), 1, 33);
    data.fill(ser32(index), 33, 37);

    const key = await hmac.compute(this.chainCode, data, 'SHA-512');
    return new Ed25519HdKey(
      Buffer.from(key.slice(0, 32)),
      Buffer.from(key.slice(32))
    );
  }
}

function isHardenedIndex(index: number): boolean {
  if (!Number.isInteger(index) || index < 0 || index >= 2 ** 32) {
    throw Error('Invalid index.');
  }
  return index >= 2 ** 31;
}

function ser32(index: number): Buffer {
  if (!Number.isInteger(index)) {
    throw Error('Invalid index.');
  }

  if (index < 0 || index >= 2 ** 32) {
    throw Error('Overflowed.');
  }

  return Buffer.from(index.toString(16).padStart((32 / 8) * 2, '0'), 'hex');
}
