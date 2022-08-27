export const WALLET_PREFIX = "wallet-"

export type Wallet = {
    id: string,
    name: string,
    accounts: Array<string>,
    nextAccountId: number,
    encryptedMnemonic: EncryptedMnemonic,
}

export type EncryptedMnemonic = {
    encryptedHex: string,
    saltHex: string,
}

export type Account = {
    id: string,
    name: string,
    pubkey: string,
    hdPath: string,
}

export type GlobalMeta = {
    nextWalletId: number,
}

export type TxnHistroyEntry = {
    from: string,
    to: string,
    object: TxnObject,
}

export type TxnObject = {
    id: string,
}

export type CoinTxnObject = {
    id: "coin",
    name: string,
    symbol: string,
    number: number,
    decimals: number,
}

export function toWalletIdString(id: number): string {
    return `wallet-${id}`
}

export function toWalletNameString(id: number): string {
    return `Wallet #${id}`
}

export function toAccountIdString(walletId: string, id: number): string {
    return `${walletId}--${id}`
}

export function toAccountNameString(walletName: string, id: number): string {
    return `${walletName} Account #${id}`
}
