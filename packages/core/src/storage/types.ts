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
    txStatus: 'success' | 'failure',
    from: string,
    to: string,
    object: TxObject,
    timestamp_ms: number | null,
}


export type TxObject = | CoinObject | NftObject;

export type CoinObject = {
    type: "coin",
    symbol: string,
    balance: bigint,
}

export type NftObject = {
    type: "nft",
    name: string,
    id: string,
}
