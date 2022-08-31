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

export type TxStatus = 'success' | 'failure';

export type TxnHistroyEntry = {
    txStatus: TxStatus,
    from: string,
    to: string,
    object: TxObject,
    timestamp_ms: number | null,
}


export type TxObjectType = 'sui' | 'coin' | 'nft';

export type TxObject = {
    type: TxObjectType,
} & (
        | SuiObject
        | CoinObject
        | NftObject
    )

export type SuiObject = {
    amount: number | null,
}

export type CoinObject = {
    symbol: string,
    amount: number | null,
    decimals: number,
}

export type NftObject = {
    name: string,
    id: string,
}
