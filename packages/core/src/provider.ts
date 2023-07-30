import {
  JsonRpcProvider,
  SuiMoveObject,
  getMoveObject,
  Coin as CoinAPI,
  RawSigner,
  TransactionBlock,
  ExecuteTransactionRequestType,
  Connection,
  SuiObjectResponse,
  SuiObjectData,
  getSuiObjectData,
  SUI_TYPE_ARG,
  CoinStruct,
  PaginatedCoins,
  DryRunTransactionBlockResponse,
  SuiTransactionBlockResponse,
  getTotalGasUsed,
  is,
  RPCValidationError as SuiRpcValidationError,
  SuiObjectDataOptions,
  CoinMetadata,
} from '@mysten/sui.js';
import { CoinObject, Nft, NftObject } from './object';
import { Vault } from './vault/Vault';
import { createKeypair } from './utils/vault';
import { RpcError } from './errors';
import { SignedTransaction } from '@mysten/sui.js/src/signers/types';
import { SuiTransactionBlockResponseOptions } from '@mysten/sui.js/src/types';
import { createTransferCoinTxb } from './utils/txb-factory';

export const DEFAULT_GAS_BUDGET = 20_000_000;

export class Provider {
  query: QueryProvider;
  tx: TxProvider;

  constructor(
    queryEndpoint: string,
    txEndpoint: string,
    versionCacheTimoutInSeconds: number
  ) {
    this.query = new QueryProvider(queryEndpoint, versionCacheTimoutInSeconds);
    this.tx = TxProvider.create(txEndpoint, versionCacheTimoutInSeconds);
  }

  async getTransferCoinTxb(
    coinType: string,
    amount: bigint,
    recipient: string,
    address: string
  ) {
    // NOTE: only query coins with the exact amount
    // if user has a lot of coins, to avoid performance issues
    let filterAmount = amount;
    if (coinType === SUI_TYPE_ARG) {
      filterAmount += BigInt(DEFAULT_GAS_BUDGET); // plus gas budget as max limit for sui coin
    }
    const coins = await this.query.getOwnedCoin(address, coinType, {
      amount: filterAmount,
    });
    if (coins.length === 0) {
      throw new Error('No coin to transfer');
    }
    return createTransferCoinTxb(coins, coinType, amount, recipient);
  }

  /**
   * @deprecated Should use getTransferCoinTxb + signAndExecuteTransactionBlock for flexibility
   * @param coinType
   * @param amount
   * @param recipient
   * @param vault
   */
  async transferCoin(
    coinType: string,
    amount: bigint,
    recipient: string,
    vault: Vault
  ) {
    const coins = await this.query.getOwnedCoin(vault.getAddress(), coinType, {
      amount: amount + BigInt(DEFAULT_GAS_BUDGET),
    });
    if (coins.length === 0) {
      throw new Error('No coin to transfer');
    }
    return await this.tx.transferCoin(
      coins,
      coinType,
      amount,
      recipient,
      vault
    );
  }

  async transferObject(
    objectId: string,
    recipient: string,
    vault: Vault,
    gasBudget?: number
  ) {
    const object = await this.query.getOwnedObject(
      vault.getAddress(),
      objectId
    );
    if (!object) {
      throw new Error('No object to transfer');
    }
    await this.tx.transferObject(objectId, recipient, vault, gasBudget);
  }
}

export class QueryProvider {
  provider: JsonRpcProvider;
  // An amount of gas (in gas units) that is added to
  // transactions as an overhead to ensure transactions do not fail.
  private static readonly GAS_SAFE_OVERHEAD = 1000n;

  constructor(queryEndpoint: string, versionCacheTimeoutInSeconds: number) {
    this.provider = new JsonRpcProvider(
      new Connection({ fullnode: queryEndpoint }),
      {
        // TODO: add socket options
        // socketOptions?: WebsocketClientOptions.
        versionCacheTimeoutInSeconds,

        // React Native doesn't support WebSockets, so we need to use the
        websocketClient: {} as any,
      }
    );
  }

  // public async getActiveValidators(): Promise<any> {
  //   const systemState = await this.provider.getLatestSuiSystemState();
  //   return systemState.activeValidators;
  // }

  public async getOwnedObjects(
    address: string,
    options?: {
      showType?: boolean;
      showDisplay?: boolean;
      showContent?: boolean;
      showOwner?: boolean;
    }
  ): Promise<SuiObjectData[]> {
    const {
      showType = true,
      showDisplay = true,
      showContent = true,
      showOwner = true,
    } = options ?? {};

    let hasNextPage = true;
    let nextCursor = null;
    const objects: SuiObjectData[] = [];
    while (hasNextPage) {
      const resp: any = await this.provider.getOwnedObjects({
        owner: address,
        cursor: nextCursor,
        options: {
          showType,
          showDisplay,
          showContent,
          showOwner,
        },
      });
      const suiObjectResponses = resp.data as SuiObjectResponse[];

      suiObjectResponses?.forEach((r) => {
        const obj = getSuiObjectData(r);
        if (obj) {
          objects.push(obj);
        }
      });
      hasNextPage = resp.hasNextPage;
      nextCursor = resp.nextCursor;
    }
    return objects;
  }

  public async getOwnedObject(
    address: string,
    objectId: string
  ): Promise<SuiObjectData | undefined> {
    const resp = await this.provider.getObject({
      id: objectId,
      options: {
        showOwner: true,
      },
    });
    const object = getSuiObjectData(resp);
    if (object && (object.owner as any)?.AddressOwner === address) {
      return object;
    }
    return undefined;
  }

  public async getOwnedCoins(address: string): Promise<CoinObject[]> {
    const coins: CoinObject[] = [];
    let hasNextPage = true;
    let nextCursor = null;
    while (hasNextPage) {
      const resp: PaginatedCoins = await this.provider.getAllCoins({
        owner: address,
        cursor: nextCursor,
      });
      const data = resp.data as CoinStruct[];
      data.forEach((item) => {
        coins.push({
          type: item.coinType,
          objectId: item.coinObjectId,
          symbol: CoinAPI.getCoinSymbol(item.coinType),
          balance: BigInt(item.balance),
          lockedUntilEpoch: item.lockedUntilEpoch,
          previousTransaction: item.previousTransaction,
          object: item,
        });
      });
      hasNextPage = resp.hasNextPage;
      nextCursor = resp.nextCursor;
    }
    return coins;
  }

  public async getOwnedCoin(
    address: string,
    coinType: string,
    filterOptions?: {
      amount?: bigint;
    }
  ): Promise<CoinObject[]> {
    const coins: CoinObject[] = [];
    let hasNextPage = true;
    let nextCursor = null;

    // NOTE: potential performance issue if there are too many coins
    // only fetch coins until the amount is enough
    let currentAmount = BigInt(0);
    // solution: add an amount parameter to determine how many coin objects should be fetch
    while (hasNextPage) {
      const resp: any = await this.provider.getCoins({
        owner: address,
        coinType,
        cursor: nextCursor,
      });

      resp.data.forEach((item: CoinStruct) => {
        const coinBalance = BigInt(item.balance);
        coins.push({
          type: item.coinType,
          objectId: item.coinObjectId,
          symbol: CoinAPI.getCoinSymbol(item.coinType),
          balance: coinBalance,
          lockedUntilEpoch: item.lockedUntilEpoch,
          previousTransaction: item.previousTransaction,
          object: item,
        });
        currentAmount += coinBalance;
      });

      if (
        typeof filterOptions?.amount === 'bigint' &&
        currentAmount >= filterOptions.amount
      ) {
        break;
      }

      hasNextPage = resp.hasNextPage;
      nextCursor = resp.nextCursor;
    }
    return coins;
  }

  public async getOwnedNfts(address: string): Promise<NftObject[]> {
    const objects = await this.getOwnedObjects(address);
    const res = objects
      .map((item) => ({
        id: item.objectId,
        object: getMoveObject(item),
        previousTransaction: item.previousTransaction,
      }))
      .filter((item) => item.object && Nft.isNft(item.object))
      .map((item) => {
        const obj = item.object as SuiMoveObject;
        return Nft.getNftObject(obj, item.previousTransaction);
      });
    return res;
  }

  public async getNormalizedMoveFunction(
    objectId: string,
    moduleName: string,
    functionName: string
  ) {
    return await this.provider.getNormalizedMoveFunction({
      package: objectId,
      module: moduleName,
      function: functionName,
    });
  }

  public async getDataOfObjects(
    objectIds: string[],
    options?: SuiObjectDataOptions
  ) {
    return await this.provider.multiGetObjects({
      ids: objectIds,
      options,
    });
  }

  public async getCoinMetadata(coinTypes: string[]): Promise<
    Array<{
      data: CoinMetadata | null;
      error: string | null;
    }>
  > {
    const requests = coinTypes.map(async (coinType) => {
      return await this.provider.getCoinMetadata({
        coinType,
      });
    });
    const responses = await Promise.allSettled(requests);
    return responses.map((resp) => {
      if (resp.status === 'fulfilled') {
        return {
          data: resp.value,
          error: null,
        };
      } else {
        return {
          data: null,
          error: resp.reason.message,
        };
      }
    });
  }

  public async getReferenceGasPrice() {
    return await this.provider.getReferenceGasPrice();
  }

  public async getGasBudgetFromDryRun(
    dryRunResult: DryRunTransactionBlockResponse
  ): Promise<string> {
    if (!dryRunResult.effects.gasUsed) {
      throw new Error('dry run result does not have gas used');
    }
    // const refPrice = await this.getReferenceGasPrice();
    const refPrice =
      dryRunResult.input?.gasData.price ?? (await this.getReferenceGasPrice());
    const safeOverhead =
      QueryProvider.GAS_SAFE_OVERHEAD * BigInt(refPrice || 1n);

    const baseComputationCostWithOverhead =
      BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;
    const gasBudget =
      baseComputationCostWithOverhead +
      BigInt(dryRunResult.effects.gasUsed.storageCost) -
      BigInt(dryRunResult.effects.gasUsed.storageRebate);

    return gasBudget > baseComputationCostWithOverhead
      ? String(gasBudget)
      : String(baseComputationCostWithOverhead);
  }
}

function handleSuiRpcError(e: unknown): never {
  if (e instanceof SuiRpcValidationError) {
    throw new RpcError(e.message, {
      result: e.result,
    });
  }
  throw e;
}

export class TxProvider {
  provider: JsonRpcProvider;

  constructor(provider: JsonRpcProvider) {
    this.provider = provider;
  }

  static create(txEndpoint: string, versionCacheTimeoutInSeconds: number) {
    const provider = new JsonRpcProvider(
      new Connection({ fullnode: txEndpoint }),
      {
        // TODO: add socket options
        // socketOptions?: WebsocketClientOptions.
        versionCacheTimeoutInSeconds,

        // React Native doesn't support WebSockets, so we need to use the
        websocketClient: {} as any,
      }
    );
    return new TxProvider(provider);
  }

  async transferObject(
    objectId: string,
    recipient: string,
    vault: Vault,
    gasBudgest?: number
  ) {
    const tx = new TransactionBlock();
    tx.transferObjects([tx.object(objectId)], tx.pure(recipient));
    return await this.signAndExecuteTransactionBlock(tx, vault);
  }

  public async transferCoin(
    coins: CoinObject[],
    coinType: string, // such as 0x2::sui::SUI
    amount: bigint,
    recipient: string,
    vault: Vault
  ) {
    const txb = createTransferCoinTxb(coins, coinType, amount, recipient);
    return await this.signAndExecuteTransactionBlock(txb, vault);
  }

  public async signAndExecuteTransactionBlock(
    transactionBlock: TransactionBlock,
    vault: Vault,
    requestType: ExecuteTransactionRequestType = 'WaitForLocalExecution',
    options?: SuiTransactionBlockResponseOptions
  ): Promise<SuiTransactionBlockResponse> {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider);
    const {
      showEffects = true,
      showEvents = true,
      showBalanceChanges = true,
      showInput = true,
      showObjectChanges = true,
    } = options ?? {};
    try {
      return await signer.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showEffects,
          showEvents,
          showBalanceChanges,
          showInput,
          showObjectChanges,
        },
        requestType,
      });
    } catch (e) {
      handleSuiRpcError(e);
    }
  }

  public async signTransactionBlock(
    tx: TransactionBlock,
    vault: Vault
  ): Promise<SignedTransaction> {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider);
    return await signer.signTransactionBlock({ transactionBlock: tx });
  }

  public async signMessage(message: Uint8Array, vault: Vault) {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider);
    return await signer.signMessage({ message });
  }

  // public async stakeCoin(
  //   coins: CoinObject[],
  //   amount: bigint,
  //   validator: string,
  //   vault: Vault,
  //   gasBudgetForStake: number
  // ): Promise<SuiTransactionBlockResponse> {
  //   // todo select inside core
  //   // coins: SuiMoveObject[],
  //   // gasCoins: SuiMoveObject[],
  //
  //   // fixme: auto splite coin if coin appears in both coins and gas coins
  //
  //   const keypair = createKeypair(vault);
  //   const signer = new RawSigner(keypair, this.provider, this.serializer);
  //
  //   // sort to get the smallest one for gas
  //   const sortedGasCoins = CoinAPI.sortByBalance(
  //     coins.filter((coin) => coin.symbol === 'SUI').map((coin) => coin.object)
  //   );
  //
  //   const gasCoin = CoinAPI.selectCoinWithBalanceGreaterThanOrEqual(
  //     sortedGasCoins,
  //     BigInt(gasBudgetForStake)
  //   );
  //   if (!gasCoin) {
  //     throw new Error(
  //       'Insufficient funds, not enough funds to cover for gas fee.'
  //     );
  //   }
  //   if (!coins.length) {
  //     throw new Error('Insufficient funds, no coins found.');
  //   }
  //   const isSui = CoinAPI.getCoinTypeArg(coins[0].object) === SUI_TYPE_ARG;
  //   const stakeCoins =
  //     CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
  //       coins.map((coin) => coin.object),
  //       amount,
  //       isSui ? [CoinAPI.getID(gasCoin)] : undefined
  //     ).map(CoinAPI.getID);
  //   if (!stakeCoins.length) {
  //     if (stakeCoins.length === 1 && isSui) {
  //       throw new Error(
  //         'Not enough coin objects, at least 2 coin objects are required.'
  //       );
  //     } else {
  //       throw new Error('Insufficient funds, try reducing the stake amount.');
  //     }
  //   }
  //   const txn = {
  //     packageObjectId: '0x2',
  //     module: 'sui_system',
  //     function: 'request_add_delegation_mul_coin',
  //     typeArguments: [],
  //     arguments: [
  //       SUI_SYSTEM_STATE_OBJECT_ID,
  //       stakeCoins,
  //       [String(amount)],
  //       validator,
  //     ],
  //     gasBudget: gasBudgetForStake,
  //   };
  //   console.log(txn);
  //   return await signer.executeMoveCall(txn);
  // }
  //
  // public async unStakeCoin(
  //   delegation: ObjectId,
  //   stakedSuiId: ObjectId,
  //   vault: Vault,
  //   gasBudgetForStake: number
  // ): Promise<SuiTransactionBlockResponse> {
  //   const keypair = createKeypair(vault);
  //   const signer = new RawSigner(keypair, this.provider, this.serializer);
  //   const txn = {
  //     packageObjectId: '0x2',
  //     module: 'sui_system',
  //     function: 'request_withdraw_delegation',
  //     typeArguments: [],
  //     arguments: [SUI_SYSTEM_STATE_OBJECT_ID, delegation, stakedSuiId],
  //     gasBudget: gasBudgetForStake,
  //   };
  //   return await signer.executeMoveCall(txn);
  // }

  /**
   * simulate transaction execution
   * can be used to estimate gas fee
   * @param tx
   * @param vault
   */
  public async dryRunTransactionBlock(
    tx: TransactionBlock,
    vault: Vault
  ): Promise<DryRunTransactionBlockResponse> {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider);
    let res: DryRunTransactionBlockResponse;
    try {
      res = await signer.dryRunTransactionBlock({
        transactionBlock: tx,
      });
    } catch (e: any) {
      handleSuiRpcError(e);
    }
    if (res?.effects?.status?.status === 'failure') {
      const { status } = res.effects;
      throw new RpcError(status.error ?? status.status, res);
    }
    return res;
  }
}
