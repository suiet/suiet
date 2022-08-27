import elliptic from 'elliptic';
import BN from 'bn.js';
import { keccak256 } from "@ethersproject/keccak256"
import { computeHmac, SupportedAlgorithm } from "@ethersproject/sha2"
import { Buffer } from "buffer"

const MASTER_SECRET = "ed25519 seed"

export class Ed25519HdKey {
    keyPair: elliptic.eddsa.KeyPair
    chainCode: Buffer

    constructor(key: Buffer, chainCode: Buffer) {
        this.keyPair = new elliptic.eddsa('ed25519').keyFromSecret(key)
        this.chainCode = chainCode;
    }

    public static fromMasterSeed(seed: Buffer): Ed25519HdKey {
        const hash = computeHmac(SupportedAlgorithm.sha512, MASTER_SECRET, seed)
        const keyBytes = new BN(hash, 16).toArray(undefined, 64);
        return new Ed25519HdKey(
            Buffer.from(keyBytes.slice(0, 32)),
            Buffer.from(keyBytes.slice(32)),
        );
    }

    public getPublicKey(): Buffer {
        return this.keyPair.getPublic()
    }

    public getPrivateKey(): Buffer {
        return this.keyPair.getSecret()
    }

    public static publicKeyToString(publicKey: Buffer): String {
        return "00" + publicKey.toString('hex')
    }

    public getAddress(): string {
        const publicKey = this.getPublicKey()
        const hash = keccak256(publicKey)
        const keyBytes = new BN(hash, 16).toArray(undefined, 32);
        const addressBytes = keyBytes.slice(0, 20);
        return toHexString(addressBytes);
    }

    public sign(message: Buffer): Buffer {
        return Buffer.from(this.keyPair.sign(message).toBytes())
    }

    public verify(digest: Buffer, signature: Buffer): boolean {
        return this.keyPair.verify(digest, signature);
    }

    public derive(path: string): Ed25519HdKey {
        if (!/^[mM]'?/.test(path)) {
            throw new Error('Path must start with "m" or "M"');
        }
        if (/^[mM]'?$/.test(path)) {
            return this;
        }
        const parts = path.replace(/^[mM]'?\//, '').split('/');
        let key: Ed25519HdKey = this;

        parts.forEach((part) => {
            const m = /^(\d+)('?)$/.exec(part);
            if (!m || m.length !== 3) {
                throw new Error(`Invalid child index: ${part}`);
            }
            const idx = m[2] == "'"
                ? parseInt(m[1]) + 2 ** 31
                : parseInt(m[1]);
            key = key.deriveChild(idx);
        })

        return key;
    }

    public deriveChild(index: number): Ed25519HdKey {
        if (!this.keyPair || !this.chainCode) {
            throw new Error('No publicKey or chainCode set');
        }
        if (!isHardenedIndex(index)) {
            throw Error('Only hardened CKDPriv is supported for ed25519.');
        }

        const data: Buffer = Buffer.alloc(37);
        data.fill(this.keyPair.getSecret(), 1, 33);
        data.fill(ser32(index), 33, 37);

        const hash = computeHmac(SupportedAlgorithm.sha512, this.chainCode, data)
        const keyBytes = new BN(hash, 16).toArray(undefined, 64);
        return new Ed25519HdKey(
            Buffer.from(keyBytes.slice(0, 32)),
            Buffer.from(keyBytes.slice(32)),
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

    return Buffer.from(index.toString(16).padStart(32 / 8 * 2, '0'), 'hex');
}

function toHexString(byteArray: number[]) {
    return byteArray.reduce(
        (output, elem) => output + ('0' + elem.toString(16)).slice(-2),
        ''
    );
}
