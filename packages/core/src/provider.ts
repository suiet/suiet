import {
  getObjectExistsResponse,
  JsonRpcProvider,
  SuiMoveObject,
  SuiObject,
  getTransferObjectTransaction,
  getTransferSuiTransaction,
  getTransactionData,
  getExecutionStatusType,
  getMoveObject,
  MoveCallTransaction,
  SuiTransactionKind,
  getMoveCallTransaction,
  getTransactionKindName,
  SUI_TYPE_ARG,
  getPublishTransaction,
  PaySui,
  PayAllSui,
  OwnedObjectRef,
  RpcTxnDataSerializer,
  Coin as CoinAPI,
  getPayTransaction,
  SuiObjectRef,
  ObjectId,
  RawSigner,
  SignableTransaction,
  SuiExecuteTransactionResponse,
  ExecuteTransactionRequestType,
  Connection,
} from '@mysten/sui.js';
import { Coin, CoinObject, Nft, NftObject } from './object';
import { TxnHistoryEntry, TxObject } from './storage/types';
import { Vault } from './vault/Vault';
import { isNonEmptyArray } from './utils';
import { JsonRpcClient } from './client';
import { createKeypair } from './utils/vault';
import {
  literal,
  object,
  union,
  string,
  number,
  tuple,
  Infer,
} from 'superstruct';

export const SUI_SYSTEM_STATE_OBJECT_ID =
  '0x0000000000000000000000000000000000000005';

export function getPaySuiTransaction(
  data: SuiTransactionKind
): PaySui | undefined {
  return 'PaySui' in data ? data.PaySui : undefined;
}

export function getPayAllSuiTransaction(
  data: SuiTransactionKind
): PayAllSui | undefined {
  return 'PayAllSui' in data ? data.PayAllSui : undefined;
}

export function getVersionFoundResponse(
  resp: GetPastObjectDataResponseType
): SuiObject | undefined {
  return resp.status === 'VersionFound'
    ? (resp.details as SuiObject)
    : undefined;
}

export function getObjectNotExistsResponse(
  resp: GetPastObjectDataResponseType
): ObjectId | undefined {
  return resp.status === 'ObjectNotExists'
    ? (resp.details as ObjectId)
    : undefined;
}

export function getObjectDeletedResponse(
  resp: GetPastObjectDataResponseType
): SuiObjectRef | undefined {
  return resp.status === 'ObjectDeleted'
    ? (resp.details as SuiObjectRef)
    : undefined;
}

export function getVersionNotFoundResponse(
  resp: GetPastObjectDataResponseType
): [string, number] | undefined {
  return resp.status === 'VersionNotFound'
    ? (resp.details as [string, number])
    : undefined;
}

export function getVersionTooHighResponse(
  resp: GetPastObjectDataResponseType
): SuiPastVersionTooHighType | undefined {
  return resp.status === 'VersionTooHigh'
    ? (resp.details as SuiPastVersionTooHighType)
    : undefined;
}

type SuiPastVersionTooHighType = {
  object_id: string;
  asked_version: number;
  latest_version: number;
};

export function isSuiPastVersionTooHigh(
  obj: any,
  _argumentName?: string
): obj is SuiPastVersionTooHighType {
  return (
    ((obj !== null && typeof obj === 'object') || typeof obj === 'function') &&
    typeof obj.object_id === 'string' &&
    typeof obj.asked_version === 'number' &&
    typeof obj.latest_version === 'number'
  );
}

const PastObjectStatus = union([
  literal('VersionFound'),
  literal('ObjectNotExists'),
  literal('ObjectDeleted'),
  literal('VersionNotFound'),
  literal('VersionTooHigh'),
]);

type PastObjectStatusType = Infer<typeof PastObjectStatus>;

const SuiPastVersionTooHigh = object({
  object_id: string(),
  asked_version: number(),
  latest_version: number(),
});

const GetPastObjectDataResponse = object({
  status: PastObjectStatus,
  details: union([
    SuiObject,
    string(),
    SuiObjectRef,
    tuple([string(), number()]),
    SuiPastVersionTooHigh,
  ]),
});

type GetPastObjectDataResponseType = Infer<typeof GetPastObjectDataResponse>;

export const DEFAULT_GAS_BUDGET = 2000;

export interface ExampleNftMetadata {
  name: string;
  desc: string;
  imageUrl: string;
}
// use getter to avoid variable be modified somewhere
export const createMintExampleNftMoveCall = (metadata: ExampleNftMetadata) => ({
  packageObjectId: '0x2',
  module: 'devnet_nft',
  function: 'mint',
  typeArguments: [],
  arguments: [metadata?.name, metadata?.desc, metadata?.imageUrl],
  gasBudget: DEFAULT_GAS_BUDGET,
});

export class Provider {
  query: QueryProvider;
  tx: TxProvider;

  constructor(
    queryEndpoint: string,
    txEndpoint: string,
    versionCacheTimoutInSeconds: number
  ) {
    this.query = new QueryProvider(queryEndpoint, versionCacheTimoutInSeconds);
    this.tx = new TxProvider(txEndpoint, versionCacheTimoutInSeconds);
  }

  async transferCoin(
    coinType: string,
    amount: bigint,
    recipient: string,
    vault: Vault,
    gasBudgetForPay?: number
  ) {
    const coins = (await this.query.getOwnedCoins(vault.getAddress())).filter(
      (coin) => CoinAPI.getCoinTypeArg(coin.object) === coinType
    );
    if (coins.length === 0) {
      throw new Error('No coin to transfer');
    }
    return await this.tx.transferCoin(
      coins,
      coinType,
      amount,
      recipient,
      vault,
      gasBudgetForPay
    );
  }

  async transferObject(
    objectId: string,
    recipient: string,
    vault: Vault,
    gasBudget?: number
  ) {
    const object = (await this.query.getOwnedObjects(vault.getAddress())).find(
      (object) => object.reference.objectId === objectId
    );
    if (!object) {
      throw new Error('No object to transfer');
    }
    await this.tx.transferObject(objectId, recipient, vault, gasBudget);
  }

  async executeMoveCall(tx: MoveCallTransaction, vault: Vault) {
    const gasObject = await this.query.getGasObject(
      vault.getAddress(),
      DEFAULT_GAS_BUDGET // FIXME: hard coded
    );
    return await this.tx.executeMoveCall(
      tx,
      vault,
      gasObject ? gasObject.objectId : undefined
    );
  }

  async mintExampleNft(metadata: ExampleNftMetadata, vault: Vault) {
    await this.executeMoveCall(createMintExampleNftMoveCall(metadata), vault);
  }
}

export class QueryProvider {
  provider: JsonRpcProvider;
  client: JsonRpcClient;

  constructor(queryEndpoint: string, versionCacheTimeoutInSeconds: number) {
    this.provider = new JsonRpcProvider(
      new Connection({ fullnode: queryEndpoint }),
      {
        skipDataValidation: true,
        // TODO: add socket options
        // socketOptions?: WebsocketClientOptions.
        versionCacheTimeoutInSeconds,
      }
    );
    this.client = new JsonRpcClient(queryEndpoint);
  }

  public async getActiveValidators(): Promise<SuiMoveObject[]> {
    const contents = await this.provider.getObject(SUI_SYSTEM_STATE_OBJECT_ID);
    const data = (contents.details as SuiObject).data;
    const validators = (data as SuiMoveObject).fields.validators;
    const activeValidators = (validators as SuiMoveObject).fields
      .active_validators;
    return activeValidators as SuiMoveObject[];
  }

  public async getOwnedObjects(address: string): Promise<SuiObject[]> {
    const objectInfos = await this.provider.getObjectsOwnedByAddress(address);
    const objectIds = objectInfos.map((obj) => obj.objectId);
    if (objectIds.length === 0) {
      return [];
    }
    const resps = await this.provider.getObjectBatch(objectIds);
    return resps
      .filter((resp) => resp.status === 'Exists')
      .map((resp) => getObjectExistsResponse(resp) as SuiObject);
  }

  public async getOwnedCoins(address: string): Promise<CoinObject[]> {
    const objects = await this.getOwnedObjects(address);
    const res = objects
      .map((item) => ({
        id: item.reference.objectId,
        object: getMoveObject(item),
      }))
      .filter((item) => item.object && Coin.isCoin(item.object))
      .map((item) => Coin.getCoinObject(item.object as SuiMoveObject));
    return res;
  }

  public async getGasObject(
    address: string,
    gasBudget: number
  ): Promise<CoinObject | undefined> {
    // TODO: Try to merge coins in this case if gas object is undefined.
    const coins = await this.getOwnedCoins(address);

    const coin = CoinAPI.selectCoinWithBalanceGreaterThanOrEqual(
      coins.map((c) => c.object),
      BigInt(gasBudget)
    );
    return Coin.getCoinObject(coin as SuiMoveObject);
  }

  public async getOwnedNfts(address: string): Promise<NftObject[]> {
    const objects = await this.getOwnedObjects(address);
    const res = objects
      .map((item) => ({
        id: item.reference.objectId,
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

  public async getTransactionsForAddress(
    address: string
  ): Promise<TxnHistoryEntry[]> {
    const txs = await this.provider.getTransactionsForAddress(address, true); // true for descending order, fix type issue of official sdk v0.15.0
    if (txs.length === 0 || !txs[0]) {
      return [];
    }
    const digests = txs.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    const effects = await this.provider.getTransactionWithEffectsBatch(digests);
    const results = [];
    for (const effect of effects) {
      if (!effect.certificate) {
        throw new Error(
          "response structure mismatch: effect doesn't contain certificate!"
        );
      }
      const data = getTransactionData(effect.certificate);
      for (const tx of data.transactions) {
        const transferSui = getTransferSuiTransaction(tx);
        const transferObject = getTransferObjectTransaction(tx);
        const moveCall = getMoveCallTransaction(tx);
        const pay = getPayTransaction(tx);
        const paySui = getPaySuiTransaction(tx);
        const payAllSui = getPayAllSuiTransaction(tx);
        const publish = getPublishTransaction(tx);
        const kind = getTransactionKindName(tx);
        // todo: add PayAllSui, PaySui
        // console.log(transferSui, transferObject, moveCall, pay, kind, tx);
        if (kind === 'TransferSui' && transferSui) {
          results.push({
            timestamp_ms: effect.timestamp_ms,
            txStatus: getExecutionStatusType(effect),
            transactionDigest: effect.certificate.transactionDigest,
            gasFee:
              effect.effects.gasUsed.computationCost +
              effect.effects.gasUsed.storageCost -
              effect.effects.gasUsed.storageRebate,
            from: data.sender,
            to: transferSui.recipient,
            object: {
              type: 'coin' as 'coin',
              balance: String(
                transferSui.amount ? BigInt(transferSui.amount) : BigInt(0)
              ),
              symbol: 'SUI',
            },
          });
        }

        if (kind === 'TransferObject' && transferObject) {
          const resp = await this.provider.getObject(
            transferObject.objectRef.objectId
          );
          const obj = getMoveObject(resp);
          let txObj: TxObject | undefined;
          // TODO: for now provider does not support to get histrorical object data,
          // so the record here may not be accurate.
          if (obj && Coin.isCoin(obj)) {
            const coinObj = Coin.getCoinObject(obj);
            txObj = {
              type: 'coin' as 'coin',
              symbol: coinObj.symbol,
              balance: String(coinObj.balance),
            };
          } else if (obj && Nft.isNft(obj)) {
            const nftObject = Nft.getNftObject(obj, undefined);
            txObj = {
              type: 'nft' as 'nft',
              ...nftObject,
            };
          }
          // TODO: handle more object types
          if (txObj) {
            results.push({
              timestamp_ms: effect.timestamp_ms,
              txStatus: getExecutionStatusType(effect),
              transactionDigest: effect.certificate.transactionDigest,
              gasFee:
                effect.effects.gasUsed.computationCost +
                effect.effects.gasUsed.storageCost -
                effect.effects.gasUsed.storageRebate,
              from: data.sender,
              to: transferObject.recipient,
              object: txObj,
            });
          }
        }
        if (kind === 'Call' && moveCall) {
          results.push({
            timestamp_ms: effect.timestamp_ms,
            txStatus: getExecutionStatusType(effect),
            transactionDigest: effect.certificate.transactionDigest,
            gasFee:
              effect.effects.gasUsed.computationCost +
              effect.effects.gasUsed.storageCost -
              effect.effects.gasUsed.storageRebate,
            from: data.sender,
            to:
              typeof moveCall.package === 'string'
                ? moveCall.package
                : moveCall.package.objectId,
            object: {
              type: 'move_call' as 'move_call',
              packageObjectId:
                typeof moveCall.package === 'string'
                  ? moveCall.package
                  : moveCall.package.objectId,
              module: moveCall.module,
              function: moveCall.function,
              arguments: moveCall.arguments?.map((arg) => JSON.stringify(arg)),

              // fixme: put in details page
              // created: await this.getCreatedTxObjects(effect.effects.created),
              // changedOrDeleted: await this.getMutatedTxObjects(
              //   effect.effects.mutated
              // ),

              // TODO: change to before and after
            },
          });
        }

        if (kind === 'Pay' && pay && isNonEmptyArray(pay.coins)) {
          // TODO: replace it to tryGetOldObject
          let coin: CoinObject | null = null;
          for (const _coin of pay.coins) {
            const resp = await this.provider.getObject(_coin.objectId);
            const obj = getMoveObject(resp);
            if (!obj) {
              continue;
            }
            coin = Coin.getCoinObject(obj);
          }
          if (coin === null) {
            continue;
          }

          const gasFee =
            effect.effects.gasUsed.computationCost +
            effect.effects.gasUsed.storageCost -
            effect.effects.gasUsed.storageRebate;
          for (let i = 0; i < pay.recipients.length; i++) {
            results.push({
              timestamp_ms: effect.timestamp_ms,
              txStatus: getExecutionStatusType(effect),
              transactionDigest: effect.certificate.transactionDigest,
              gasFee: gasFee / pay.recipients.length,
              from: data.sender,
              to: pay.recipients[i],
              object: {
                type: 'coin' as 'coin',
                balance: String(
                  pay.amounts[i] ? BigInt(pay.amounts[i]) : BigInt(0)
                ),
                symbol: coin.symbol,
              },
            });
          }
        }

        // TODO: add PayAllSui, PaySui, ChangeEpoch, Publish, TransferObject

        if (kind === 'PaySui' && paySui) {
          const gasFee =
            effect.effects.gasUsed.computationCost +
            effect.effects.gasUsed.storageCost -
            effect.effects.gasUsed.storageRebate;
          for (let i = 0; i < paySui.recipients.length; i++) {
            results.push({
              timestamp_ms: effect.timestamp_ms,
              txStatus: getExecutionStatusType(effect),
              transactionDigest: effect.certificate.transactionDigest,

              gasFee: gasFee / paySui.recipients.length,
              from: data.sender,
              to: paySui.recipients[i],
              object: {
                type: 'coin' as 'coin',
                balance: String(
                  paySui.amounts[i] ? BigInt(paySui.amounts[i]) : BigInt(0)
                ),
                symbol: 'SUI',
              },
            });
          }
        }

        if (kind === 'PayAllSui' && payAllSui) {
          let coin: CoinObject | null = null;
          const gasFee =
            effect.effects.gasUsed.computationCost +
            effect.effects.gasUsed.storageCost -
            effect.effects.gasUsed.storageRebate;
          for (const _coin of payAllSui.coins) {
            const resp = await this.provider.getObject(_coin.objectId);
            const obj = getMoveObject(resp);
            if (!obj) {
              continue;
            }

            coin = Coin.getCoinObject(obj);

            results.push({
              timestamp_ms: effect.timestamp_ms,
              txStatus: getExecutionStatusType(effect),
              transactionDigest: effect.certificate.transactionDigest,

              gasFee,
              from: data.sender,
              to: payAllSui.recipient,
              object: {
                type: 'coin' as 'coin',
                balance: String(coin.balance),
                symbol: coin.symbol,
              },
            });
          }
        }
      }
    }
    return results;
  }

  public async getCreatedTxObjects(
    objectRefs: OwnedObjectRef[] | undefined
  ): Promise<TxObject[]> {
    if (!objectRefs) {
      return [];
    }
    const objects = [];
    for (const objRef of objectRefs) {
      const pastObj = await this.getPastTxObject(
        objRef.reference.objectId,
        objRef.reference.version
      );
      if (pastObj) {
        objects.push(pastObj);
      }
      // TODO: What do we need to do if the object is not found?
    }
    // console.log('created', objects);
    return objects;
  }

  public async getMutatedTxObjects(
    objectRefs: OwnedObjectRef[] | undefined
  ): Promise<TxObject[]> {
    if (!objectRefs) {
      return [];
    }
    const objects = [];
    for (const objRef of objectRefs) {
      const obj = await this.getPastTxObject(
        objRef.reference.objectId,
        objRef.reference.version
      );
      if (obj) {
        // Currently we only care about the coin object.
        if (obj.type === 'coin') {
          const previousObj = await this.getPastTxObject(
            objRef.reference.objectId,
            objRef.reference.version - 1
          );
          if (previousObj && previousObj.type === 'coin') {
            objects.push({
              ...obj,
              balance: String(
                BigInt(obj.balance) - BigInt(previousObj.balance)
              ),
            });
          }
        } else if (obj.type === 'nft') {
          objects.push(obj);
        } else if (obj.type === 'object_id') {
          // Return Type is object_id means the object is deleted.
          const previousObj = await this.getPastTxObject(
            objRef.reference.objectId,
            objRef.reference.version - 1
          );
          if (previousObj) {
            if (previousObj.type === 'coin') {
              objects.push({
                ...previousObj,
                balance: String(BigInt(previousObj.balance) * BigInt(-1)),
              });
            } else if (previousObj.type === 'nft') {
              objects.push(previousObj);
            }
          }
        }
      }
    }
    // console.log('mutated', objects);
    return objects;
  }

  public async getPastTxObject(
    objectId: string,
    version: number
  ): Promise<TxObject | undefined> {
    const resp = await this.tryGetPastObject(objectId, version);
    const versionFoundResp = getVersionFoundResponse(resp);
    const objectDeleted = getObjectDeletedResponse(resp);
    if (versionFoundResp) {
      const obj = getMoveObject(versionFoundResp);
      if (obj) {
        if (Coin.isCoin(obj)) {
          const coinObj = Coin.getCoinObject(obj);
          return {
            type: 'coin' as 'coin',
            symbol: coinObj.symbol,
            balance: String(coinObj.balance),
          };
        } else if (Nft.isNft(obj)) {
          return {
            type: 'nft' as 'nft',
            ...Nft.getNftObject(obj),
          };
        }
      } else if (objectDeleted) {
        return {
          type: 'object_id' as 'object_id',
          id: objectId,
        };
      }
    }
    return undefined;
  }

  public async getNormalizedMoveFunction(
    objectId: string,
    moduleName: string,
    functionName: string
  ) {
    return await this.provider.getNormalizedMoveFunction(
      objectId,
      moduleName,
      functionName
    );
  }

  async tryGetPastObject(
    objectId: string,
    version: number
  ): Promise<GetPastObjectDataResponseType> {
    try {
      return await this.client.requestWithType(
        'sui_tryGetPastObject',
        [objectId, version],
        GetPastObjectDataResponse as any, // FIXME: type error
        true
      );
    } catch (err) {
      throw new Error(
        `Error fetching past object with object ID: ${objectId}, version: ${version}, error: ${err}`
      );
    }
  }
}

/**
 * @Deprecated use src/providers/TxProvider instead
 */
export class TxProvider {
  provider: JsonRpcProvider;
  serializer: RpcTxnDataSerializer;

  constructor(txEndpoint: string, versionCacheTimeoutInSeconds: number) {
    this.provider = new JsonRpcProvider(
      new Connection({ fullnode: txEndpoint }),
      {
        skipDataValidation: true,
        // TODO: add socket options
        // socketOptions?: WebsocketClientOptions.
        versionCacheTimeoutInSeconds,
      }
    );
    this.serializer = new RpcTxnDataSerializer(txEndpoint);
  }

  async transferObject(
    objectId: string,
    recipient: string,
    vault: Vault,
    gasBudgest?: number
  ) {
    return await this.signAndExecuteTransaction(
      {
        kind: 'transferObject',
        data: {
          objectId,
          gasBudget: gasBudgest ?? DEFAULT_GAS_BUDGET,
          recipient,
        },
      },
      vault
    );
  }

  public async transferCoin(
    coins: CoinObject[],
    coinType: string, // such as 0x2::sui::SUI
    amount: bigint,
    recipient: string,
    vault: Vault,
    gasBudgetForPay?: number
  ) {
    const allCoins = coins.map((c) => c.object);
    const allCoinsOfTransferType = allCoins.filter(
      (c) => CoinAPI.getCoinTypeArg(c) === coinType
    );
    const gasBudget =
      gasBudgetForPay ??
      Coin.computeGasBudgetForPay(allCoinsOfTransferType, amount);

    const payTx = await Coin.newPayTransaction(
      allCoins,
      coinType,
      amount,
      recipient,
      gasBudget
    );
    return await this.signAndExecuteTransaction(payTx, vault);
  }

  public async executeMoveCall(
    tx: MoveCallTransaction,
    vault: Vault,
    gasObjectId: string | undefined
  ) {
    const _tx = { ...tx };
    if (!_tx.gasPayment) {
      _tx.gasPayment = gasObjectId;
    }

    return await this.signAndExecuteTransaction(
      {
        kind: 'moveCall',
        data: tx,
      },
      vault
    );
  }

  public async executeSerializedMoveCall(txBytes: Uint8Array, vault: Vault) {
    return await this.signAndExecuteTransaction(
      {
        kind: 'bytes',
        data: txBytes,
      },
      vault
    );
  }

  public async signAndExecuteTransaction(
    tx: SignableTransaction,
    vault: Vault,
    requestType: ExecuteTransactionRequestType = 'WaitForLocalExecution'
  ): Promise<SuiExecuteTransactionResponse> {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider, this.serializer);
    return await signer.signAndExecuteTransaction(tx, requestType);
  }

  public async stakeCoin(
    coins: CoinObject[],
    amount: bigint,
    validator: string,
    vault: Vault,
    gasBudgetForStake: number
  ): Promise<SuiExecuteTransactionResponse> {
    // todo select inside core
    // coins: SuiMoveObject[],
    // gasCoins: SuiMoveObject[],

    // fixme: auto splite coin if coin appears in both coins and gas coins

    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider, this.serializer);

    // sort to get the smallest one for gas
    const sortedGasCoins = CoinAPI.sortByBalance(
      coins.filter((coin) => coin.symbol === 'SUI').map((coin) => coin.object)
    );

    const gasCoin = CoinAPI.selectCoinWithBalanceGreaterThanOrEqual(
      sortedGasCoins,
      BigInt(gasBudgetForStake)
    );
    if (!gasCoin) {
      throw new Error(
        'Insufficient funds, not enough funds to cover for gas fee.'
      );
    }
    if (!coins.length) {
      throw new Error('Insufficient funds, no coins found.');
    }
    const isSui = CoinAPI.getCoinTypeArg(coins[0].object) === SUI_TYPE_ARG;
    const stakeCoins =
      CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        coins.map((coin) => coin.object),
        amount,
        isSui ? [CoinAPI.getID(gasCoin)] : undefined
      ).map(CoinAPI.getID);
    if (!stakeCoins.length) {
      if (stakeCoins.length === 1 && isSui) {
        throw new Error(
          'Not enough coin objects, at least 2 coin objects are required.'
        );
      } else {
        throw new Error('Insufficient funds, try reducing the stake amount.');
      }
    }
    const txn = {
      packageObjectId: '0x2',
      module: 'sui_system',
      function: 'request_add_delegation_mul_coin',
      typeArguments: [],
      arguments: [
        SUI_SYSTEM_STATE_OBJECT_ID,
        stakeCoins,
        [String(amount)],
        validator,
      ],
      gasBudget: gasBudgetForStake,
    };
    console.log(txn);
    return await signer.executeMoveCall(txn);
  }

  public async unStakeCoin(
    delegation: ObjectId,
    stakedSuiId: ObjectId,
    vault: Vault,
    gasBudgetForStake: number
  ): Promise<SuiExecuteTransactionResponse> {
    const keypair = createKeypair(vault);
    const signer = new RawSigner(keypair, this.provider, this.serializer);
    const txn = {
      packageObjectId: '0x2',
      module: 'sui_system',
      function: 'request_withdraw_delegation',
      typeArguments: [],
      arguments: [SUI_SYSTEM_STATE_OBJECT_ID, delegation, stakedSuiId],
      gasBudget: gasBudgetForStake,
    };
    return await signer.executeMoveCall(txn);
  }
}
