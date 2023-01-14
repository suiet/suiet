import { TxnHistoryEntry } from '../storage/types';
import { Network } from './network';
import {
  ExampleNftMetadata,
  Provider,
  QueryProvider,
  TxProvider,
} from '../provider';
import { validateToken } from '../utils/token';
import { Storage } from '../storage/Storage';
import { Vault } from '../vault/Vault';
import { Buffer } from 'buffer';
import {
  CertifiedTransaction,
  getCertifiedTransaction,
  getTransactionEffects,
  MoveCallTransaction,
  PayAllSuiTransaction,
  PaySuiTransaction,
  PayTransaction,
  SignableTransaction,
  SuiExecuteTransactionResponse,
  SuiMoveNormalizedFunction,
  SuiTransactionResponse,
  TransactionEffects,
} from '@mysten/sui.js';
import { SignedMessage } from '../vault/types';
import { RpcError } from '../errors';

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
  coinType: string;
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
  metadata: ExampleNftMetadata;
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
  id: string;
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
  fields: Record<string, any>;
  hasPublicTransfer: boolean;
};

export type ObjectDto = CoinObjectDto | NftObjectDto;

export type GetNormalizedMoveFunctionParams = {
  network: Network;
  objectId: string;
  moduleName: string;
  functionName: string;
};

export type SignMessageParams = {
  walletId: string;
  accountId: string;
  message: Uint8Array | string;
  token: string;
};

export interface TxEssentials {
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
}

export type SendAndExecuteTxParams<T> = {
  transaction: T;
  context: TxEssentials;
};
export type MoveCallParams = SendAndExecuteTxParams<MoveCallTransaction>;

export interface ITransactionApi {
  supportedCoins: () => Promise<CoinPackageIdPair[]>;
  transferCoin: (
    params: TransferCoinParams
  ) => Promise<SuiExecuteTransactionResponse>;
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

  executeMoveCall: (params: MoveCallParams) => Promise<SuiTransactionResponse>;

  executeSerializedMoveCall: (
    params: SerializedMoveCallParams
  ) => Promise<void>;

  getNormalizedMoveFunction: (
    params: GetNormalizedMoveFunctionParams
  ) => Promise<SuiMoveNormalizedFunction>;

  signMessage: (params: SignMessageParams) => Promise<SignedMessage>;

  signAndExecuteTransaction: (
    params: SendAndExecuteTxParams<SignableTransaction>
  ) => Promise<SuiExecuteTransactionResponse>;
}

export class TransactionApi implements ITransactionApi {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  async supportedCoins(): Promise<CoinPackageIdPair[]> {
    return Array.from(DEFAULT_SUPPORTED_COINS.values());
  }

  async transferCoin(
    params: TransferCoinParams
  ): Promise<SuiExecuteTransactionResponse> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    const res = await provider.transferCoin(
      params.coinType,
      BigInt(params.amount),
      params.recipient,
      vault
      // params.network.payCoinGasBudget  // NOTE: let sdk auto-compute gas
    );
    if (!res) {
      throw new RpcError('no response');
    }
    const statusResult = (res as any)?.EffectsCert?.effects?.effects?.status;
    if (!statusResult) {
      throw new RpcError('invalid transaction status response');
    }
    if (statusResult.status === 'failure') {
      throw new RpcError(statusResult.error || 'Unknown transaction error');
    }
    return res;
  }

  async transferObject(params: TransferObjectParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.transferObject(
      params.objectId,
      params.recipient,
      vault,
      params.network.transferObjectGasBudget
    );
  }

  async getTransactionHistory(
    params: GetTxHistoryParams
  ): Promise<Array<TxnHistoryEntry<ObjectDto>>> {
    const { network, address } = params;
    const provider = new Provider(
      network.queryRpcUrl,
      network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
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
    const provider = new Provider(
      network.queryRpcUrl,
      network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
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
    const provider = new Provider(
      network.queryRpcUrl,
      network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
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
    const provider = new Provider(
      network.queryRpcUrl,
      network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const nfts = await provider.query.getOwnedNfts(address);
    return nfts.map((nft) => ({
      type: 'nft',
      id: nft.objectId,
      name: nft.name,
      description: nft.description,
      url: nft.url,
      previousTransaction: nft.previousTransaction,
      objectType: nft.objectType,
      fields: nft.fields,
      hasPublicTransfer: nft.hasPublicTransfer,
    }));
  }

  async mintExampleNft(params: MintNftParams): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.mintExampleNft(params.metadata, vault);
  }

  async executeMoveCall(
    params: MoveCallParams
  ): Promise<SuiTransactionResponse> {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    const response = await provider.signAndExecuteTransaction(
      {
        kind: 'moveCall',
        data: params.transaction,
      },
      vault
    );
    return {
      certificate: getCertifiedTransaction(response) as CertifiedTransaction,
      effects: getTransactionEffects(response) as TransactionEffects,
      timestamp_ms: null,
      parsed_data: null,
    };
  }

  async executeSerializedMoveCall(
    params: SerializedMoveCallParams
  ): Promise<void> {
    await validateToken(this.storage, params.token);
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      params.walletId,
      params.accountId,
      params.token
    );
    await provider.tx.executeSerializedMoveCall(params.txBytes, vault);
  }

  async signMessage(params: SignMessageParams) {
    const { walletId, accountId, message, token } = params;
    const vault = await this.prepareVault(walletId, accountId, token);
    const signedMsg = await vault.signMessage(message);
    return signedMsg;
  }

  async signAndExecuteTransaction(
    params: SendAndExecuteTxParams<SignableTransaction>
  ) {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    return await provider.signAndExecuteTransaction(params.transaction, vault);
  }

  private async prepareVault(
    walletId: string,
    accountId: string,
    token: string
  ) {
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

  private async prepareTxEssentials(context: TxEssentials) {
    await validateToken(this.storage, context.token);
    const provider = new TxProvider(
      context.network.queryRpcUrl,
      context.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      context.walletId,
      context.accountId,
      context.token
    );
    return {
      provider,
      vault,
    };
  }

  async getNormalizedMoveFunction(params: GetNormalizedMoveFunctionParams) {
    const { network, objectId, moduleName, functionName } = params;
    const queryProvider = new QueryProvider(
      network.queryRpcUrl,
      network.versionCacheTimoutInSeconds
    );
    return await queryProvider.getNormalizedMoveFunction(
      objectId,
      moduleName,
      functionName
    );
  }
}
