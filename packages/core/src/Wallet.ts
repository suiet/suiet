import * as bip39 from "bip39"
import { hdkey } from 'ethereumjs-wallet'
import * as crypto from "crypto-js"
import { Storage } from "./Storage"
import type { SuiAddress } from '@mysten/sui.js';

const ENCRYPTED_MNEMONIC_KEY = "encryptedMnemonic"


export class Wallet {
    private __hdpath: string
    private __hdwallet: hdkey
    private __storage: Storage

    constructor (password: string, encryptedMnemonic: EncryptedMnemonic, storage: Storage, hdpath="") {
        this.__hdpath = hdpath
        const mnemonic = this.decryptMnemonic(password, encryptedMnemonic.encrypted, encryptedMnemonic.salt)
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        this.__hdwallet = hdkey.fromMasterSeed(seed)
        this.__storage = storage
    }


    decryptMnemonic(password: string, encrypted: string, salt: string): string {
        var key = crypto.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 10000
          });
        return crypto.AES.decrypt(encrypted, key).toString(crypto.enc.Utf8);
    }

    getAddress(): SuiAddress {
        return this.__hdwallet.derivePath(this.__hdpath).getWallet().getAddress().toString()
    }
}

interface EncryptedMnemonic {
    encrypted: string
    salt: string
}

export async function readEncryptedMnemonic<S extends Storage>(storage: S): Promise<EncryptedMnemonic> {
    const value = await storage.get(ENCRYPTED_MNEMONIC_KEY)
    const encryptedMnemonic: EncryptedMnemonic = JSON.parse(value)
    return encryptedMnemonic
}

export async function createNewWallet(storage: Storage, password: string, hdpath=""): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic();
    const encryptedMnemonic = encryptMnemonic(password, mnemonic)
    await storage.set(ENCRYPTED_MNEMONIC_KEY, JSON.stringify(encryptedMnemonic))

    return new Wallet(password, encryptedMnemonic, storage, hdpath)
}

function encryptMnemonic(password: string, mnemonic: string): EncryptedMnemonic {
    const salt = crypto.lib.WordArray.random(128 / 8);
    var key = crypto.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000
        });
    return {
        encrypted: crypto.AES.encrypt(mnemonic, key).toString(),
        salt: salt.toString()
    }
}
