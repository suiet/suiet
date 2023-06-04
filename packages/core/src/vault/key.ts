import elliptic from 'elliptic';

export class Ed25519Key {
  keyPair: elliptic.eddsa.KeyPair;

  constructor(keyPair: elliptic.eddsa.KeyPair) {
    this.keyPair = keyPair;
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
}
