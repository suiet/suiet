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
  RPCError as SuiRpcError,
  RPCValidationError as SuiRpcValidationError,
} from '@mysten/sui.js';
import { CoinObject, Nft, NftObject } from './object';
import { Vault } from './vault/Vault';
import { createKeypair } from './utils/vault';
import { RpcError } from './errors';
import { SignedTransaction } from '@mysten/sui.js/src/signers/types';
import { SuiTransactionBlockResponseOptions } from '@mysten/sui.js/src/types';

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

  async transferCoin(
    coinType: string,
    amount: bigint,
    recipient: string,
    vault: Vault
  ) {
    const coins = await this.query.getOwnedCoin(vault.getAddress(), coinType);
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

  async buildTransferCoinTx(
    coinType: string,
    amount: bigint,
    recipient: string,
    address: string
  ) {
    const coins = await this.query.getOwnedCoin(address, coinType);
    if (coins.length === 0) {
      throw new Error('No coin to transfer');
    }
    return await this.tx.buildTransferCoinTx(
      coins,
      coinType,
      amount,
      recipient
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
    console.log('objectId', objectId);
    console.log('object', object);
    if (!object) {
      throw new Error('No object to transfer');
    }
    await this.tx.transferObject(objectId, recipient, vault, gasBudget);
  }
}

export class QueryProvider {
  provider: JsonRpcProvider;

  constructor(queryEndpoint: string, versionCacheTimeoutInSeconds: number) {
    this.provider = new JsonRpcProvider(
      new Connection({ fullnode: queryEndpoint }),
      {
        skipDataValidation: true,
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

  public async getOwnedObjects(address: string): Promise<SuiObjectData[]> {
    let hasNextPage = true;
    let nextCursor = null;
    const objects: SuiObjectData[] = [];
    while (hasNextPage) {
      const resp: any = await this.provider.getOwnedObjects({
        owner: address,
        cursor: nextCursor,
        options: {
          showType: true,
          showDisplay: true,
          showContent: true,
          showOwner: true,
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
        });
      });
      hasNextPage = resp.hasNextPage;
      nextCursor = resp.nextCursor;
    }
    return coins;
  }

  public async getOwnedCoin(
    address: string,
    coinType: string
  ): Promise<CoinObject[]> {
    const coins: CoinObject[] = [];
    let hasNextPage = true;
    let nextCursor = null;
    while (hasNextPage) {
      const resp: any = await this.provider.getCoins({
        owner: address,
        coinType,
        cursor: nextCursor,
      });
      resp.data.forEach((item: CoinStruct) => {
        coins.push({
          type: item.coinType,
          objectId: item.coinObjectId,
          symbol: CoinAPI.getCoinSymbol(item.coinType),
          balance: BigInt(item.balance),
          lockedUntilEpoch: item.lockedUntilEpoch,
          previousTransaction: item.previousTransaction,
        });
      });
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
}

function handleSuiRpcError(e: unknown): never {
  if (e instanceof SuiRpcError) {
    throw new RpcError((e?.cause as any)?.message ?? e.message, {
      code: e.code,
      data: e.data,
      cause: e.cause,
    });
  }
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
        skipDataValidation: true,
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
    const tx = new TransactionBlock();
    const [primaryCoin, ...mergeCoins] = coins.filter(
      (coin) => coin.type === coinType
    );

    if (coinType === SUI_TYPE_ARG) {
      const coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
      tx.transferObjects([coin], tx.pure(recipient));
    } else {
      const primaryCoinInput = tx.object(primaryCoin.objectId);
      if (mergeCoins.length) {
        // TODO: This could just merge a subset of coins that meet the balance requirements instead of all of them.
        tx.mergeCoins(
          primaryCoinInput,
          mergeCoins.map((coin) => tx.object(coin.objectId))
        );
      }
      const coin = tx.splitCoins(primaryCoinInput, [tx.pure(coins)]);
      tx.transferObjects([coin], tx.pure(recipient));
    }

    return await this.signAndExecuteTransactionBlock(tx, vault);
  }

  public async buildTransferCoinTx(
    coins: CoinObject[],
    coinType: string, // such as 0x2::sui::SUI
    amount: bigint,
    recipient: string
  ) {
    const tx = new TransactionBlock();
    const [primaryCoin, ...mergeCoins] = coins.filter(
      (coin) => coin.type === coinType
    );

    if (coinType === SUI_TYPE_ARG) {
      const coin = tx.splitCoins(tx.gas, [tx.pure(amount)]);
      tx.transferObjects([coin], tx.pure(recipient));
    } else {
      const primaryCoinInput = tx.object(primaryCoin.objectId);
      if (mergeCoins.length) {
        // TODO: This could just merge a subset of coins that meet the balance requirements instead of all of them.
        tx.mergeCoins(
          primaryCoinInput,
          mergeCoins.map((coin) => tx.object(coin.objectId))
        );
      }
      const coin = tx.splitCoins(primaryCoinInput, [tx.pure(coins)]);
      tx.transferObjects([coin], tx.pure(recipient));
    }

    return tx;
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
