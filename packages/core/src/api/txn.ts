import { TxnHistroyEntry } from "../storage/types";
import { Network } from "./network"
import { Provider } from "../provider";

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
    getTransactionHistory: (network: Network, address: string) => Promise<Array<TxnHistroyEntry>>;
    getOwnedObjects: () => Promise<Object>;
}

export class TransactionApi implements ITransactionApi {
    async transferCoin(params: TransferCoinParams): Promise<void> {

    }
    async transferObject(params: TransferObjectParams): Promise<void> { }
    async getTransactionHistory(network: Network, address: string): Promise<TxnHistroyEntry[]> {
        const provider = new Provider(network);
        const histroy = await provider.getTransactionsForAddress(address);
        return histroy;
    }
    async getOwnedObjects(): Promise<Object> { throw new Error("Unimplemented") }
}
