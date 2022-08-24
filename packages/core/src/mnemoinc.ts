import "fast-text-encoding"
import * as bip39 from "bip39"
import { pbkdf2Sync } from "pbkdf2"
import { ModeOfOperation } from "aes-js"
import * as randomBytes from "randombytes"
import { EncryptedMnemonic } from "./storage/types";
import { Buffer } from "buffer";

export function generateMnemonic(): string {
    return bip39.generateMnemonic()
}

export function encryptMnemonic(password: string, mnemonic: string): EncryptedMnemonic {
    const salt = randomBytes.default(32)
    const key = pbkdf2Sync(password, salt, 10000, 256 / 8, "sha512");
    let aesCtr = new ModeOfOperation.ctr(key);
    const mnemonicBytes = new fastTextEncoding.TextEncoderClass().encode(mnemonic);
    return {
        encryptedHex: Buffer.from(aesCtr.encrypt(mnemonicBytes)).toString("hex"),
        saltHex: salt.toString("hex")
    }
}

export function decryptMnemonic(password: string, encryptedMnemonic: EncryptedMnemonic): string {
    const salt = Buffer.from(encryptedMnemonic.saltHex, "hex")
    const key = pbkdf2Sync(password, salt, 10000, 256 / 8, "sha512");
    let aesCtr = new ModeOfOperation.ctr(key);
    const encryptedBytes = Buffer.from(encryptedMnemonic.encryptedHex, "hex")
    const mnemonicBytes = aesCtr.decrypt(encryptedBytes);
    const mnemonic = new fastTextEncoding.TextDecoderClass().decode(mnemonicBytes);
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid password")
    }
    return mnemonic
}
