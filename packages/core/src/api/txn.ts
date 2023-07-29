import { Network } from './network';
import { Provider, QueryProvider, TxProvider } from '../provider';
import { validateAccount } from '../utils/token';
import { IStorage } from '../storage';
import { Vault } from '../vault/Vault';
import {
  CoinMetadata,
  DryRunTransactionBlockResponse,
  ExecuteTransactionRequestType,
  SignedMessage,
  SignedTransaction,
  SUI_SYSTEM_STATE_OBJECT_ID,
  SuiMoveNormalizedFunction,
  SuiObjectDataOptions,
  SuiObjectResponse,
  SuiTransactionBlockResponse,
  TransactionBlock,
} from '@mysten/sui.js';
import { RpcError } from '../errors';
import { SuiTransactionBlockResponseOptions } from '@mysten/sui.js/src/types';
import { getTransactionBlock } from '../utils/txb-factory';
import { prepareVault } from '../utils/vault';
import { HttpClient } from '../utils/http-client';
import serializeTransactionBlock from '../utils/txb-factory/serializeTransactionBlock';
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

export type TransferCoinParams<E = TxEssentials> = {
  context: E;
  coinType: string;
  amount: string;
  recipient: string;
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

export type SignMessageParams<E = TxEssentials> = {
  context: E;
  message: Uint8Array;
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

export type StakeCoinParams<E = TxEssentials> = {
  context: E;
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

export type GetDataOfObjectsParams = {
  network: Network;
  objectIds: string[];
  options?: SuiObjectDataOptions;
};

export type GetCoinMetadataParams = {
  network: Network;
  coinTypes: string[];
};

export type GetCoinMetadataResult = {
  data: CoinMetadata | null;
  error: string | null;
};

export type GetGasBudgetFromDryRunParams = {
  network: Network;
  dryRunResult: DryRunTransactionBlockResponse;
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

  getDataOfObjects: (
    params: GetDataOfObjectsParams
  ) => Promise<SuiObjectResponse[]>;
  getCoinMetadata: (
    params: GetCoinMetadataParams
  ) => Promise<GetCoinMetadataResult[]>;

  getGasBudgetFromDryRun: (
    params: GetGasBudgetFromDryRunParams
  ) => Promise<string>;

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
    const { context } = params;
    await validateAccount({
      walletId: context.walletId,
      accountId: context.accountId,
      storage: this.storage,
      token: context.token,
    });
    const provider = new Provider(
      context.network.queryRpcUrl,
      context.network.txRpcUrl,
      context.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      context.walletId,
      context.accountId,
      context.token
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
    const statusResult = res?.effects?.status;
    if (!statusResult) {
      throw new RpcError('invalid transaction status response');
    }
    if (statusResult.status === 'failure') {
      throw new RpcError(statusResult.error ?? 'Unknown transaction error');
    }
    return res;
  }

  /**
   * Return a serialized transaction block for transferring coin
   * @param params
   */
  async getSerializedTransferCoinTxb(
    params: TransferCoinParams
  ): Promise<string> {
    const { context } = params;
    await validateAccount({
      walletId: context.walletId,
      accountId: context.accountId,
      storage: this.storage,
      token: context.token,
    });
    const provider = new Provider(
      context.network.queryRpcUrl,
      context.network.txRpcUrl,
      context.network.versionCacheTimoutInSeconds
    );
    const vault = await this.prepareVault(
      context.walletId,
      context.accountId,
      context.token
    );
    const txb = await provider.getTransferCoinTxb(
      params.coinType,
      BigInt(params.amount),
      params.recipient,
      vault.getAddress()
    );
    // for bypassing the chrome messaging
    return txb.serialize();
  }

  async transferObject(params: TransferObjectParams): Promise<void> {
    await validateAccount({
      walletId: params.walletId,
      accountId: params.accountId,
      storage: this.storage,
      token: params.token,
    });
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

  async getDataOfObjects(params: GetDataOfObjectsParams) {
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const res = await provider.query.getDataOfObjects(
      params.objectIds,
      params.options
    );
    return res;
  }

  async getCoinMetadata(params: GetCoinMetadataParams) {
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    const res = await provider.query.getCoinMetadata(params.coinTypes);
    return res;
  }

  async getGasBudgetFromDryRun(params: GetGasBudgetFromDryRunParams) {
    const provider = new Provider(
      params.network.queryRpcUrl,
      params.network.txRpcUrl,
      params.network.versionCacheTimoutInSeconds
    );
    return await provider.query.getGasBudgetFromDryRun(params.dryRunResult);
  }

  async signMessage(params: SignMessageParams) {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    return await provider.signMessage(params.message, vault);
  }

  async signAndExecuteTransactionBlock(
    params: SendAndExecuteTxParams<string | TransactionBlock>
  ) {
    const { provider, vault } = await this.prepareTxEssentials(params.context);
    const txb = getTransactionBlock(params.transactionBlock);
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
      getTransactionBlock(params.transactionBlock),
      vault
    );
  }

  async dryRunTransactionBlock(
    params: DryRunTXBParams<string | TransactionBlock>
  ): Promise<DryRunTransactionBlockResponse> {
    const account = await this.storage.getAccount(params.context.accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    const fetchFromBffService = async () => {
      return await new HttpClient(params.context.network.txRpcUrl).post<
        any,
        DryRunTransactionBlockResponse
      >('/dry-run', {
        serializedTxn: serializeTransactionBlock(params.transactionBlock),
        senderAddress: account.address,
      });
    };
    const fetchFromSuiSdk = async () => {
      const { provider, vault } = await this.prepareTxEssentials(
        params.context
      );
      return await provider.dryRunTransactionBlock(
        getTransactionBlock(params.transactionBlock),
        vault
      );
    };

    try {
      const res = await fetchFromBffService();
      if (!res?.effects) {
        throw new Error('response is not valid');
      }
      return res;
    } catch {
      // as fallback
      return await fetchFromSuiSdk();
    }
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
    return await prepareVault(wallet, account, token);
  }

  private async prepareTxEssentials(context: TxEssentials) {
    await validateAccount({
      walletId: context.walletId,
      accountId: context.accountId,
      storage: this.storage,
      token: context.token,
    });
    const provider = TxProvider.create(
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
