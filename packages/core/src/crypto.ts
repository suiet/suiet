import "fast-text-encoding"
import * as bip39 from "bip39"
import { pbkdf2Sync } from "pbkdf2"
import { ModeOfOperation } from "aes-js"
import * as randomBytes from "randombytes"
import { Cipher } from "./storage/types";
import { Buffer } from "buffer";

const WALLET_MASTER_SECRET = "suiet wallet";

type Token = {
    token: Buffer,
    cipher: Cipher,
}

export function encryptMnemonic(token: Buffer, mnemonic: string): Buffer {
    let aesCtr = new ModeOfOperation.ctr(token);
    const mnemonicBytes = new fastTextEncoding.TextEncoderClass().encode(mnemonic);
    return Buffer.from(aesCtr.encrypt(mnemonicBytes));

}

export function decryptMnemonic(token: Buffer, encryptedMnemonic: string): string {
    let aesCtr = new ModeOfOperation.ctr(token);
    const encryptedBytes = Buffer.from(encryptedMnemonic, "hex")
    const mnemonicBytes = aesCtr.decrypt(encryptedBytes);
    const mnemonic = new fastTextEncoding.TextDecoderClass().decode(mnemonicBytes);
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Invalid password")
    }
    return mnemonic
}

export function newToken(password: string): Token {
    const salt = randomBytes.default(32)
    const key = pbkdf2Sync(password, salt, 10000, 256 / 8, "sha512");
    let aesCtr = new ModeOfOperation.ctr(key);
    const secretBytes = new fastTextEncoding.TextEncoderClass().encode(WALLET_MASTER_SECRET);
    return {
        token: key,
        cipher: {
            data: Buffer.from(aesCtr.encrypt(secretBytes)).toString("hex"),
            salt: salt.toString("hex"),
        }
    }
}

export function verifyToken(password: string, cipher: Cipher): boolean {
    const salt = Buffer.from(cipher.salt, "hex");
    const key = pbkdf2Sync(password, salt, 10000, 256 / 8, "sha512");
    let aesCtr = new ModeOfOperation.ctr(key);
    const data = Buffer.from(cipher.data, "hex");
    const secretBytes = aesCtr.decrypt(data);
    const secret = new fastTextEncoding.TextDecoderClass().decode(secretBytes);
    return secret === WALLET_MASTER_SECRET;
}
