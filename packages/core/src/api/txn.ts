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

export type CoinObjectDto = {
  type: 'coin';
  symbol: string;
  balance: string;
};

export type NftObjectDto = {
  id: string;
  type: 'nft';
  name: string;
  description: string;
  url: string;
  previousTransaction?: string;
  objectType: string;
};

export type ObjectDto = CoinObjectDto | NftObjectDto;

export interface ITransactionApi {
  supportedCoins: () => Promise<CoinPackageIdPair[]>;
  transferCoin: (params: TransferCoinParams) => Promise<void>;
  transferObject: (params: TransferObjectParams) => Promise<void>;
  getTransactionHistory: (
    params: GetTxHistoryParams
  ) => Promise<Array<TxnHistoryEntry<ObjectDto>>>;
  getOwnedCoins: (params: GetOwnedObjParams) => Promise<CoinObjectDto[]>;
  getOwnedNfts: (params: GetOwnedObjParams) => Promise<NftObjectDto[]>;
  getCoinsBalance: (
    params: GetOwnedObjParams
  ) => Promise<Array<{ symbol: string; balance: string }>>;

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
  ): Promise<Array<TxnHistoryEntry<ObjectDto>>> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    let result: any = await provider.query.getTransactionsForAddress(address);

    // transform the balance of coin obj from bigint to string
    result = result.map((item: TxnHistoryEntry) => {
      if (item.object.type !== 'coin') return item;
      return {
        ...item,
        object: {
          ...item.object,
          balance: String(item.object.balance),
        },
      };
    });
    return result;
  }

  async getCoinsBalance(
    params: GetOwnedObjParams
  ): Promise<Array<{ symbol: string; balance: string }>> {
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
      balance: String(item[1]),
    }));
  }

  async getOwnedCoins(params: GetOwnedObjParams): Promise<CoinObjectDto[]> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const coins = await provider.query.getOwnedCoins(address);
    return coins.map((coin) => {
      return {
        type: 'coin',
        id: coin.objectId,
        symbol: coin.symbol,
        balance: String(coin.balance),
      };
    });
  }

  async getOwnedNfts(params: GetOwnedObjParams): Promise<NftObjectDto[]> {
    const { network, address } = params;
    const provider = new Provider(network.queryRpcUrl, network.gatewayRpcUrl);
    const nfts = await provider.query.getOwnedNfts(address);
    return nfts.map((nft) => ({
      type: 'nft',
      id: nft.objectId,
      name: nft.name,
      description: nft.description,
      url: nft.url,
      previousTransaction: nft.previousTransaction,
      objectType: nft.objectType,
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
