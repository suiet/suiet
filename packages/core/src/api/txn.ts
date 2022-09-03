import { TxnHistroyEntry } from '../storage/types';
import { Network } from './network';
import { Provider } from '../provider';
import { validateToken } from './util';
import { Storage } from '../storage/Storage';
import { Vault } from '../vault/Vault';
import { Buffer } from 'buffer';

export const DEFAULT_SUPPORTED_COINS = new Map<string, CoinPackageIdPair>([
  [
    'SUI',
    {
      symbol: 'SUI',
      packageId: '0x2',
    },
  ],
]);

export type CoinPackageIdPair = {
  symbol: string;
  packageId: string;
};

export type TransferCoinParams = {
  symbol: string;
  amount: bigint;
  recipient: string;
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
};

export type TransferObjectParams = {
  name: string;
  objectId: string;
  token: string;
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
  supportedCoins: () => Promise<CoinPackageIdPair[]>;
  transferCoin: (params: TransferCoinParams) => Promise<void>;
  transferObject: (params: TransferObjectParams) => Promise<void>;
  getTransactionHistory: (
    network: Network,
    address: string
  ) => Promise<TxnHistroyEntry[]>;
  getOwnedObjects: (network: Network, address: string) => Promise<Object[]>;
  getCoinsBalance: (
    network: Network,
    address: string
  ) => Promise<Array<{ symbol: string; balance: bigint }>>;
}

export class TransactionApi implements ITransactionApi {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  async supportedCoins(): Promise<CoinPackageIdPair[]> {
    return Array.from(DEFAULT_SUPPORTED_COINS.values());
  }

  async transferCoin(params: TransferCoinParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(params.network.rpcURL);
    const wallet = await this.storage.getWallet(params.walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    const account = await this.storage.getAccount(params.accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const token = Buffer.from(params.token, 'hex');
    const vault = await Vault.create(
      account.hdPath,
      token,
      wallet.encryptedMnemonic
    );
    await provider.transferCoin(
      params.symbol,
      params.amount,
      params.recipient,
      vault
    );
  }

  async transferObject(params: TransferObjectParams): Promise<void> {}

  async getTransactionHistory(
    network: Network,
    address: string
  ): Promise<TxnHistroyEntry[]> {
    const provider = new Provider(network.rpcURL);
    const histroy = await provider.getTransactionsForAddress(address);
    return histroy;
  }

  async getCoinsBalance(
    network: Network,
    address: string
  ): Promise<Array<{ symbol: string; balance: bigint }>> {
    const provider = new Provider(network.rpcURL);
    const objects = await provider.getOwnedCoins(address);
    const result = new Map();
    for (const object of objects) {
      result.has(object.symbol)
        ? result.set(object.symbol, result.get(object.symbol) + object.balance)
        : result.set(object.symbol, object.balance);
    }
    return Array.from(result.entries()).map((item) => ({
      symbol: item[0] as string,
      balance: item[1] as bigint,
    }));
  }

  async getOwnedObjects(network: Network, address: string): Promise<Object[]> {
    const provider = new Provider(network.rpcURL);
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
