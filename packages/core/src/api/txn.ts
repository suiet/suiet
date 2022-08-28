import { TxnHistroyEntry } from "../storage/types";

export type TransferCoinParams = {
    name: string,
    symbol: string,
    amount: bigint,
    decimals: number,
};

export type TransferObjectParams = {
    name: string,
    objectId: string,
};

export type TxHistroyEntry = {
    status: "pending" | "completed" | "failed",
    from: string,
    to: string,
    object: Object,
}

export type Object = {
    id: string,
} & (
        | {
            type: "coin",
            name: string,
            symbol: string,
            amount: bigint,
            decimals: number,
        }
        | {
            type: "nft",
            objectId: string,
        }
    );

export interface ITransactionApi {
    transferCoin: (params: TransferCoinParams) => Promise<void>;
    transferObject: (params: TransferObjectParams) => Promise<void>;
    getTransactionHistory: () => Promise<Array<TxnHistroyEntry>>;
    getOwnedObjects: () => Promise<Object>;
}
