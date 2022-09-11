import { TxnHistoryEntry } from '../storage/types';
import { Network } from './network';
import { Provider } from '../provider';
import { validateToken } from '../utils/token';
import { Storage } from '../storage/Storage';
import { Vault } from '../vault/Vault';
import { Buffer } from 'buffer';
import { MoveCallTransaction } from '@mysten/sui.js';

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
  amount: number;
  recipient: string;
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
};

export type TransferObjectParams = {
  recipient: string;
  objectId: string;
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
};

export type MintNftParams = {
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
};

export type MoveCallParams = {
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
  tx: MoveCallTransaction;
};

export type SerializedMoveCallParams = {
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
  txBytes: Uint8Array;
};

export type GetOwnedObjParams = { network: Network; address: string };

export type GetTxHistoryParams = { network: Network; address: string };

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

export type NftObject = {
  id: string;
  type: 'nft';
  name: string;
  description: string;
  url: string;
};

export type Object = CoinObject | NftObject;

export interface ITransactionApi {
  supportedCoins: () => Promise<CoinPackageIdPair[]>;
  transferCoin: (params: TransferCoinParams) => Promise<void>;
  transferObject: (params: TransferObjectParams) => Promise<void>;
  getTransactionHistory: (
    params: GetTxHistoryParams
  ) => Promise<TxnHistoryEntry[]>;
  getOwnedObjects: (params: GetOwnedObjParams) => Promise<Object[]>;
  getOwnedNfts: (params: GetOwnedObjParams) => Promise<NftObject[]>;
  getCoinsBalance: (
    params: GetOwnedObjParams
  ) => Promise<Array<{ symbol: string; balance: bigint }>>;

  mintExampleNft: (params: MintNftParams) => Promise<void>;

  executeMoveCall: (params: MoveCallParams) => Promise<void>;

  executeSerializedMoveCall: (
    params: SerializedMoveCallParams
  ) => Promise<void>;
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
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.gatewayRpcUrl
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.transferCoin(
      params.symbol,
      params.amount,
      params.recipient,
      vault
    );
  }

  async transferObject(params: TransferObjectParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.gatewayRpcUrl
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.transferObject(params.objectId, params.recipient, vault);
  }

  async getTransactionHistory(
    params: GetTxHistoryParams
  ): Promise<TxnHistoryEntry[]> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const histroy = await provider.query.getTransactionsForAddress(address);
    return histroy;
  }

  async getCoinsBalance(
    params: GetOwnedObjParams
  ): Promise<Array<{ symbol: string; balance: bigint }>> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const objects = await provider.query.getOwnedCoins(address);
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

  async getOwnedObjects(params: GetOwnedObjParams): Promise<Object[]> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const coins = await provider.query.getOwnedCoins(address);
    return coins.map((coin) => {
      return {
        type: 'coin',
        id: coin.objectId,
        symbol: coin.symbol,
        balance: coin.balance,
      };
    });
  }

  async getOwnedNfts(params: GetOwnedObjParams): Promise<NftObject[]> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const nfts = await provider.query.getOwnedNfts(address);
    return nfts.map((nft) => ({
      type: 'nft',
      id: nft.objectId,
      name: nft.name,
      description: nft.description,
      url: nft.url,
    }));
  }

  async mintExampleNft(params: MintNftParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.gatewayRpcUrl
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.tx.mintExampleNft(vault);
  }

  async executeMoveCall(params: MoveCallParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.gatewayRpcUrl
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.tx.executeMoveCall(params.tx, vault);
  }

  async executeSerializedMoveCall(
    params: SerializedMoveCallParams
  ): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.gatewayRpcUrl
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.tx.executeSerializedMoveCall(params.txBytes, vault);
  }

  async prepareVault(walletId: string, accountId: string, token: string) {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    const account = await this.storage.getAccount(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const vault = await Vault.create(
      account.hdPath,
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic
    );
    return vault;
  }
}
