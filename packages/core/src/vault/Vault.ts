import * as bip39 from "bip39"
import { Context } from "./types"
import { Ed25519HdKey } from "./HdKey";
import { decryptMnemonic } from "../crypto"
import { SHA3 } from "sha3"
import { Buffer } from "buffer"

export class Vault {
    context: Context;
    hdKey?: Ed25519HdKey;

    constructor(context: Context) {
        this.context = context;
    }

    async getHdKey(): Promise<Ed25519HdKey> {
        if (!this.hdKey) {
            const encryptedMnemonic = this.context.wallet.encryptedMnemonic;
            const mnemonic = decryptMnemonic(this.context.token, encryptedMnemonic);
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const master = await Ed25519HdKey.fromMasterSeed(seed);
            this.hdKey = await master.derive(this.context.acount.hdPath)
        }
        return this.hdKey
    }

    public async getAddress(): Promise<string> {
        const hdKey = await this.getHdKey();
        const publicHash = new SHA3(256).update(hdKey.getPublicKey()).digest()
        return Buffer.from(publicHash.slice(0, 20)).toString('hex')
    }
}
