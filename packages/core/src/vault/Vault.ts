import * as bip39 from "bip39"
import { Ed25519HdKey } from "./hdkey";
import { decryptMnemonic } from "../crypto"
import { SHA3 } from "sha3"
import { Buffer } from "buffer"

export class Vault {
    hdKey: Ed25519HdKey;

    constructor(hdKey: Ed25519HdKey) {
        this.hdKey = hdKey;
    }

    public static async create(path: string, token: Buffer, encryptedMnemonic: string): Promise<Vault> {
        const mnemonic = decryptMnemonic(token, encryptedMnemonic);
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const master = await Ed25519HdKey.fromMasterSeed(seed);
        const hdKey = await master.derive(path)
        return new Vault(hdKey)
    }

    public getAddress(): string {
        const publicHash = new SHA3(256).update(this.hdKey.getPublicKey()).digest()
        return Buffer.from(publicHash.slice(0, 20)).toString('hex')
    }

    public getPublicKey(): string {
        return this.hdKey.getPublicHexString()
    }
}
