import { Wallet as IWallet } from "../api/wallet"

export const WALLET_PREFIX = "wallet-"

export interface Wallet extends IWallet {
    encryptedMnemonic: string,
}

export type Account = {
    id: string,
    name: string,
    pubkey: string,
    address: string,
    hdPath: string,
}

export type GlobalMeta = {
    nextWalletId: number,
    cipher: Cipher,
}

export type Cipher = {
    data: string,
    salt: string,
}

export type TxnHistroyEntry = {
    status: "pending" | "completed" | "failed",
    from: string,
    to: string,
    object: TxnObject,
}

export type TxnObject = {
    id: string,
}

export type CoinTxnObject = {
    id: "coin",
    name: string, // sui
    symbol: string, // SUI
    number: number, // 12345 => 12.345
    decimals: number, // 3
}

export type NftTxnObject = {
    id: "coin",
    name: string, // sui
    symbol: string, // SUI
    number: number, // 12345 => 12.345
    decimals: number, // 3
}
