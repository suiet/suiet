import { TxnHistoryEntry } from '../storage/types';
import { Network } from './network';
import { Provider, QueryProvider, TxProvider } from '../provider';
import { validateToken } from '../utils/token';
import { IStorage } from '../storage';
import { Vault } from '../vault/Vault';
import { Buffer } from 'buffer';
import {
  ExecuteTransactionRequestType,
  SignedMessage,
  SuiMoveNormalizedFunction,
  SuiTransactionBlockResponse,
  TransactionBlock,
  SignedTransaction,
  toB64,
  SUI_SYSTEM_STATE_OBJECT_ID,
  DryRunTransactionBlockResponse,
} from '@mysten/sui.js';
import { RpcError } from '../errors';
import { SuiTransactionBlockResponseOptions } from '@mysten/sui.js/src/types';

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

export type DryRunTXBParams<T, E = TxEssentials> = {
  context: E;
  transactionBlock: T;
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
  message: Uint8Array;
  token: string;
};

export interface TxEssentials {
  network: Network;
  walletId: string;
  accountId: string;
  token: string;
}

export type SendAndExecuteTxParams<T, E = TxEssentials> = {
  context: E;
  transactionBlock: T;
  requestType?: ExecuteTransactionRequestType;
  options?: SuiTransactionBlockResponseOptions;
};

export type SendTxParams<T> = {
  transactionBlock: T;
  context: TxEssentials;
};

export type StakeCoinParams = {
  walletId: string;
  accountId: string;
  token: string;
  network: Network;
  amount: string;
  validator: string; // address
  gasBudgetForStake: number;
};

export type UnStakeCoinParams = {
  walletId: string;
  accountId: string;
  token: string;
  network: Network;
  delegation: string;
  stakedSuiId: string;
  vault: Vault;
  gasBudgetForStake: number;
};

export interface ITransactionApi {
  supportedCoins: () => Promise<CoinPackageIdPair[]>;
  transferCoin: (
    params: TransferCoinParams
  ) => Promise<SuiTransactionBlockResponse>;
  transferObject: (params: TransferObjectParams) => Promise<void>;
  // getTransactionHistory: (
  //   params: GetTxHistoryParams
  // ) => Promise<Array<TxnHistoryEntry<ObjectDto>>>;
  getOwnedCoins: (params: GetOwnedObjParams) => Promise<CoinObjectDto[]>;
  getOwnedNfts: (params: GetOwnedObjParams) => Promise<NftObjectDto[]>;
  getCoinsBalance: (
    params: GetOwnedObjParams
  ) => Promise<Array<{ symbol: string; type: string; balance: string }>>;

  getNormalizedMoveFunction: (
    params: GetNormalizedMoveFunctionParams
  ) => Promise<SuiMoveNormalizedFunction>;

  signMessage: (params: SignMessageParams) => Promise<SignedMessage>;

  signAndExecuteTransactionBlock: (
    params: SendAndExecuteTxParams<TransactionBlock>
  ) => Promise<SuiTransactionBlockResponse>;

  signTransactionBlock: (
    params: SendTxParams<TransactionBlock>
  ) => Promise<SignedTransaction>;

  // getEstimatedGasBudget: (
  //   params: GetEstimatedGasBudgetParams
  // ) => Promise<number>;
  stakeCoin: (params: StakeCoinParams) => Promise<SuiTransactionBlockResponse>;

  // unStakeCoin: (
  //   params: UnStakeCoinParams
  // ) => Promise<SuiExecuteTransactionResponse>;
}

export class TransactionApi implements ITransactionApi {
  storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async supportedCoins(): Promise<CoinPackageIdPair[]> {
    return Array.from(DEFAULT_SUPPORTED_COINS.values());
  }

  async transferCoin(
    params: TransferCoinParams
  ): Promise<SuiTransactionBlockResponse> {
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
    console.log('transferCoin response: ', res);
    if (!res) {
      throw new RpcError('no response');
    }
    const statusResult = res?.effects?.status;
    if (!statusResult) {
      throw new RpcError('invalid transaction status response');
    }
    if (statusResult.status === 'failure') {
      throw new RpcError(statusResult.error ?? 'Unknown transaction error');
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
      params.network?.moveCallGasBudget
    );
  }

  // async getTransactionHistory(
  //   params: GetTxHistoryParams
  // ): Promise<Array<TxnHistoryEntry<ObjectDto>>> {
  //   const { network, address } = params;
  //   const provider = new Provider(
  //     network.queryRpcUrl,
  //     network.txRpcUrl,
  //     params.network.versionCacheTimoutInSeconds
  //   );
  //   let result: any = await provider.query.getTransactionsForAddress(address);

  //   // transform the balance of coin obj from bigint to string
  //   result = result.map((item: TxnHistoryEntry) => {
  //     if (item.object.type !== 'coin') return item;
  //     return {
  //       ...item,
  //       object: {
  //         ...item.object,
  //         balance: String(item.object.balance),
  //       },
  //     };
  //   });
  //   return result;
  // }

  async getCoinsBalance(
    params: GetOwnedObjParams
  ): Promise<Array<{ symbol: string; type: string; balance: string }>> {
    const { network, address } = params;
    const provider = new Provider(
      network.queryRpcUrl,
      network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const objects = await provider.query.getOwnedCoins(address);
    const result = new Map();

    // using type to agg
    for (const object of objects) {
      result.has(object.type)
        ? result.set(object.type, result.get(object.type) + object.balance)
        : result.set(object.type, object.balance);
    }
    return Array.from(result.entries()).map((item) => ({
      symbol: item[0].substring(item[0].lastIndexOf(':') + 1),
      type: item[0],
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

  // TODO: check signMessage with intent signMessage mechanism
  async signMessage(params: SignMessageParams) {
    const { walletId, accountId, message, token } = params;
    const vault = await this.prepareVault(walletId, accountId, token);
    const signedMsg = await vault.signMessage(message);
    return {
      signature: toB64(signedMsg.signature),
      messageBytes: toB64(message),
    };
  }

  async signAndExecuteTransactionBlock(
    params: SendAndExecuteTxParams<string | TransactionBlock>
  ) {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    const txb = this.getTransactionBlock(params.transactionBlock);
    return await provider.signAndExecuteTransactionBlock(
      txb,
      vault,
      params.requestType,
      params.options
    );
  }

  async signTransactionBlock(params: SendTxParams<string | TransactionBlock>) {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    return await provider.signTransactionBlock(
      this.getTransactionBlock(params.transactionBlock),
      vault
    );
  }

  async dryRunTransactionBlock(
    params: DryRunTXBParams<string | TransactionBlock>
  ): Promise<DryRunTransactionBlockResponse> {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    const res = await provider.dryRunTransactionBlock(
      this.getTransactionBlock(params.transactionBlock),
      vault
    );
    return res;
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

  async stakeCoin(params: StakeCoinParams) {
    const { network, amount, validator, gasBudgetForStake } = params;
    // const vault = await this.prepareVault(
    //   params.walletId,
    //   params.accountId,
    //   params.token
    // );

    // const provider = new Provider(
    //   network.queryRpcUrl,
    //   network.txRpcUrl,
    //   network.versionCacheTimoutInSeconds
    // );

    const { provider, vault } = await this.prepareTxEssentials(params.context);
    // const coins = await provider.query.getOwnedCoins(vault.getAddress());
    // console.log('coins', coins);

    // console.log(params);

    const tx = new TransactionBlock();
    const stakeCoin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
    tx.moveCall({
      target: '0x3::sui_system::request_add_stake',
      arguments: [
        tx.object(SUI_SYSTEM_STATE_OBJECT_ID),
        stakeCoin,
        tx.pure(validator),
      ],
    });

    return await provider.signAndExecuteTransactionBlock(
      tx,
      vault
      // params.requestType,
      // params.options
    );
  }

  private getTransactionBlock(input: string | TransactionBlock) {
    if (typeof input === 'string') {
      // deserialize transaction block string
      return TransactionBlock.from(input);
    } else {
      return input;
    }
  }

  // async unStakeCoin(params: UnStakeCoinParams) {
  //   const {
  //     network,
  //     gasBudgetForStake,
  //     walletId,
  //     accountId,
  //     token,
  //     delegation,
  //     stakedSuiId,
  //   } = params;

  //   //   const { network, coins, gasCoins, amount, validator, gasBudgetForStake } =
  //   //   params;
  //   const vault = await this.prepareVault(walletId, accountId, token);
  //   const provider = new Provider(
  //     network.queryRpcUrl,
  //     network.txRpcUrl,
  //     network.versionCacheTimoutInSeconds
  //   );
  //   return await provider.tx.unStakeCoin(
  //     delegation,
  //     stakedSuiId,
  //     vault,
  //     gasBudgetForStake
  //   );
  // }
}
