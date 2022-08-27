import * as bip39 from "bip39"
import { Context } from "./types"
import { Ed25519HdKey } from "./HdKey";
import { decryptMnemonic } from "../mnemoinc"

export class Keychain {
    context: Context;
    hdKey?: Ed25519HdKey;

    constructor(context: Context) {
        this.context = context;
    }

    async getHdKey(password: string): Promise<Ed25519HdKey> {
        if (!this.hdKey) {
            const encryptedMnemonic = this.context.wallet.encryptedMnemonic;
            const mnemonic = decryptMnemonic(password, encryptedMnemonic);
            const seed = await bip39.mnemonicToSeed(mnemonic);
            const master = await Ed25519HdKey.fromMasterSeed(seed);
            this.hdKey = await master.derive(this.context.acount.hdPath)
        }
        return this.hdKey
    }
}
