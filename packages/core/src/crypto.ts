import "fast-text-encoding"
import * as bip39 from "bip39"
import { pbkdf2Sync } from "pbkdf2"
import { ModeOfOperation } from "aes-js"
import * as randomBytes from "randombytes"
import { Cipher } from "./storage/types";
import { Buffer } from "buffer";
import { Storage } from "./storage/Storage"

const WALLET_MASTER_SECRET = "suiet wallet";
const COIN_TYPE_SUI = '784'

type Token = {
    token: Buffer,
    cipher: Cipher,
}

export function generateMnemonic(): string {
    return bip39.generateMnemonic();
}

export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
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
    const token = password2Token(password, salt);
    let aesCtr = new ModeOfOperation.ctr(token);
    const secretBytes = new fastTextEncoding.TextEncoderClass().encode(WALLET_MASTER_SECRET);
    return {
        token: token,
        cipher: {
            data: Buffer.from(aesCtr.encrypt(secretBytes)).toString("hex"),
            salt: salt.toString("hex"),
        }
    }
}

export function password2Token(password: string, salt: Buffer) {
    return pbkdf2Sync(password, salt, 10000, 256 / 8, "sha512");
}

export function validateToken(token: Buffer, cipher: Cipher): boolean {
    let aesCtr = new ModeOfOperation.ctr(token);
    const data = Buffer.from(cipher.data, "hex");
    const secretBytes = aesCtr.decrypt(data);
    const secret = new fastTextEncoding.TextDecoderClass().decode(secretBytes);
    return secret === WALLET_MASTER_SECRET;
}

export function derivationHdPath(id: number) {
    return `m/44'/${COIN_TYPE_SUI}'/${id}'`
}