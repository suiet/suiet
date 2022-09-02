import { TxnHistroyEntry } from '../storage/types';
import { Network } from './network';
import { Provider } from '../provider';
import { isMergeCoinTransaction } from '@mysten/sui.js';

export type TransferCoinParams = {
  name: string;
  symbol: string;
  amount: bigint;
  decimals: number;
};

export type TransferObjectParams = {
  name: string;
  objectId: string;
};

export type TxHistroyEntry = {
  status: 'pending' | 'completed' | 'failed';
  from: string;
  to: string;
  object: Object;
};

export type CoinObject = {
  id: string;
  type: 'coin';
  symbol: string;
  balance: bigint;
};

export type Object = CoinObject;

export interface ITransactionApi {
  transferCoin: (params: TransferCoinParams) => Promise<void>;
  transferObject: (params: TransferObjectParams) => Promise<void>;
  getTransactionHistory: (
    network: Network,
    address: string
  ) => Promise<TxnHistroyEntry[]>;
  getOwnedObjects: (network: Network, address: string) => Promise<Object[]>;
}

export class TransactionApi implements ITransactionApi {
  async transferCoin(params: TransferCoinParams): Promise<void> {}
  async transferObject(params: TransferObjectParams): Promise<void> {}
  async getTransactionHistory(
    network: Network,
    address: string
  ): Promise<TxnHistroyEntry[]> {
    const provider = new Provider(network);
    const histroy = await provider.getTransactionsForAddress(address);
    return histroy;
  }

  async getOwnedObjects(network: Network, address: string): Promise<Object[]> {
    const provider = new Provider(network);
    const coins = await provider.getOwnedCoins(address);
    return coins.map((coin) => {
      return {
        type: 'coin',
        id: coin.objectId,
        symbol: coin.symbol,
        balance: coin.balance,
      };
    });
  }
}
