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
  Base64DataBuffer,
  getMoveCallTransaction,
  getObjectId,
  OwnedObjectRef,
  LocalTxnDataSerializer,
  ExecuteTransactionRequestType,
  Coin as CoinAPI,
  SUI_TYPE_ARG,
  getPayTransaction,
} from '@mysten/sui.js';
import { Coin, CoinObject, Nft, NftObject } from './object';
import { TxnHistoryEntry, TxObject } from './storage/types';
import { SignedTx } from './vault/types';
import { Vault } from './vault/Vault';
import { RpcError } from './errors';

export const SUI_SYSTEM_STATE_OBJECT_ID =
  '0x0000000000000000000000000000000000000005';

export class Provider {
  query: QueryProvider;
  tx: TxProvider;

  constructor(queryEndpoint: string, txEndpoint: string, rpcVersion: string) {
    this.query = new QueryProvider(queryEndpoint, rpcVersion);
    this.tx = new TxProvider(txEndpoint, rpcVersion);
  }

  async transferCoin(
    symbol: string,
    amount: number,
    recipient: string,
    vault: Vault,
    gasBudgetForPay?: number
  ) {
    const coins = (await this.query.getOwnedCoins(vault.getAddress())).filter(
      (coin) => coin.symbol === symbol
    );
    if (coins.length === 0) {
      throw new Error('No coin to transfer');
    }

    if (symbol === GAS_SYMBOL) {
      await this.tx.transferSui(
        coins,
        amount,
        recipient,
        vault,
        gasBudgetForPay
      );
    } else {
      await this.tx.transferCoin(
        coins,
        amount,
        recipient,
        vault,
        gasBudgetForPay
      );
    }
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

  async mintExampleNft(vault: Vault, gasBudget?: number) {
    const moveCall = MINT_EXAMPLE_NFT_MOVE_CALL;
    moveCall.gasBudget = gasBudget ?? moveCall.gasBudget;
    const gasObject = await this.query.getGasObject(
      vault.getAddress(),
      moveCall.gasBudget
    );
    await this.tx.mintExampleNft(
      vault,
      gasObject ? gasObject.objectId : undefined
    );
  }

  async executeMoveCall(tx: MoveCallTransaction, vault: Vault) {
    const gasObject = await this.query.getGasObject(
      vault.getAddress(),
      MINT_EXAMPLE_NFT_MOVE_CALL.gasBudget
    );
    return await this.tx.executeMoveCall(
      tx,
      vault,
      gasObject ? gasObject.objectId : undefined
    );
  }
}

export class QueryProvider {
  provider: JsonRpcProvider;

  constructor(queryEndpoint: string, rpcVersion: string) {
    this.provider = new JsonRpcProvider(queryEndpoint, true, rpcVersion);
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
    return coins
      .filter((coin) => coin.symbol === GAS_SYMBOL)
      .find((coin) => coin.balance >= gasBudget);
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
    const txs = await this.provider.getTransactionsForAddress(address);
    if (txs.length === 0 || !txs[0]) {
      return [];
    }
    const digests = txs.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    const effects = await this.provider.getTransactionWithEffectsBatch(digests);
    const results = [];
    for (const effect of effects) {
      const data = getTransactionData(effect.certificate);
      for (const tx of data.transactions) {
        const transferSui = getTransferSuiTransaction(tx);
        const transferObject = getTransferObjectTransaction(tx);
        const moveCall = getMoveCallTransaction(tx);
        const pay = getPayTransaction(tx);
        if (transferSui) {
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
        } else if (transferObject) {
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
        } else if (moveCall) {
          results.push({
            timestamp_ms: effect.timestamp_ms,
            txStatus: getExecutionStatusType(effect),
            transactionDigest: effect.certificate.transactionDigest,
            gasFee:
              effect.effects.gasUsed.computationCost +
              effect.effects.gasUsed.storageCost -
              effect.effects.gasUsed.storageRebate,
            from: data.sender,
            to: moveCall.package.objectId,
            object: {
              type: 'move_call' as 'move_call',
              packageObjectId: moveCall.package.objectId,
              module: moveCall.module,
              function: moveCall.function,
              arguments: moveCall.arguments?.map((arg) => JSON.stringify(arg)),
              created: [],
              mutated: [],
              // created: await this.getTxObjects(effect.effects.created),
              // mutated: await this.getTxObjects(effect.effects.mutated),
            },
          });
        } else if (pay) {
          // TODO: replace it to tryGetOldObject
          const resp = await this.provider.getObject(pay.coins[0].objectId);
          const obj = getMoveObject(resp);
          if (!obj) {
            continue;
          }
          const coinObj = Coin.getCoinObject(obj);
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
                symbol: coinObj.symbol,
              },
            });
          }
        }
      }
    }
    return results;
  }

  public async getTxObjects(
    objectRefs: OwnedObjectRef[] | undefined
  ): Promise<TxObject[]> {
    if (!objectRefs) {
      return [];
    }
    const objectIds = objectRefs.map((obj) => obj.reference.objectId);
    const resps = await this.provider.getObjectBatch(objectIds);
    const objects = resps.map((resp) => {
      const existResp = getObjectExistsResponse(resp);
      if (existResp) {
        const obj = getMoveObject(existResp);
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
        }
      }
      return {
        type: 'object_id' as 'object_id',
        id: getObjectId(resp),
      };
    });
    return objects;
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
}

export const DEFAULT_GAS_BUDGET_FOR_SPLIT = 2000;
export const DEFAULT_GAS_BUDGET_FOR_MERGE = 1000;
export const DEFAULT_GAS_BUDGET_FOR_TRANSFER = 100;
export const DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI = 100;
export const DEFAULT_GAS_BUDGET_FOR_STAKE = 1000;
export const GAS_SYMBOL = 'SUI';
export const DEFAULT_NFT_TRANSFER_GAS_FEE = 450;
export const MINT_EXAMPLE_NFT_MOVE_CALL = {
  packageObjectId: '0x2',
  module: 'devnet_nft',
  function: 'mint',
  typeArguments: [],
  arguments: [
    'Suiet NFT',
    'An NFT created by Suiet',
    'https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4',
  ],
  gasBudget: 10000,
};

export class TxProvider {
  provider: JsonRpcProvider;
  serializer: LocalTxnDataSerializer;

  constructor(txEndpoint: string, rpcVersion: string) {
    this.provider = new JsonRpcProvider(txEndpoint, true, rpcVersion);
    this.serializer = new LocalTxnDataSerializer(this.provider);
  }

  async transferObject(
    objectId: string,
    recipient: string,
    vault: Vault,
    gasBudgest?: number
  ) {
    const data = await this.serializer.newTransferObject(vault.getAddress(), {
      objectId,
      gasBudget: gasBudgest ?? DEFAULT_GAS_BUDGET_FOR_TRANSFER,
      recipient,
    });
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async transferCoin(
    coins: CoinObject[],
    amount: number,
    recipient: string,
    vault: Vault,
    gasBudgetForPay?: number
  ) {
    const objects = coins.map((coin) => coin.object);
    const inputCoins =
      await CoinAPI.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        objects,
        BigInt(amount)
      );
    if (inputCoins.length === 0) {
      const totalBalance = CoinAPI.totalBalance(objects);
      throw new Error(
        `Coin balance ${totalBalance.toString()} is not sufficient to cover the transfer amount ` +
          `${amount.toString()}. Try reducing the transfer amount to ${totalBalance}.`
      );
    }
    const inputCoinIDs = inputCoins.map((c) => CoinAPI.getID(c));
    const gasBudget = Coin.estimatedGasCostForPay(
      inputCoins.length,
      gasBudgetForPay
    );
    const data = await this.serializer.newPay(vault.getAddress(), {
      inputCoins: inputCoinIDs,
      recipients: [recipient],
      amounts: [Number(amount)],
      gasBudget,
    });

    // TODO: select gas payment object?
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async transferSui(
    coins: CoinObject[],
    amount: number,
    recipient: string,
    vault: Vault,
    gasBudgetForPay?: number
  ) {
    const address = vault.getAddress();
    const actualAmount = BigInt(amount + DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI);
    const objects = coins.map((coin) => coin.object);
    const coinsWithSufficientAmount =
      await CoinAPI.selectCoinsWithBalanceGreaterThanOrEqual(
        objects,
        actualAmount
      );
    if (coinsWithSufficientAmount.length > 0) {
      const data = await this.serializer.newTransferSui(address, {
        suiObjectId: CoinAPI.getID(coinsWithSufficientAmount[0]),
        gasBudget: DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI,
        recipient,
        amount: Number(amount),
      });
      const signedTx = await vault.signTransaction({ data });
      // TODO: handle response
      await executeTransaction(this.provider, signedTx);
      return;
    }
    // If there is not a coin with sufficient balance, use the pay API
    const gasCostForPay = Coin.estimatedGasCostForPay(
      coins.length,
      gasBudgetForPay
    );
    let inputCoins = await Coin.assertAndGetSufficientCoins(
      objects,
      BigInt(amount),
      gasCostForPay
    );

    if (inputCoins.length === coins.length) {
      // We need to pay for an additional `transferSui` transaction now, assert that we have sufficient balance
      // to cover the additional cost
      await Coin.assertAndGetSufficientCoins(
        objects,
        BigInt(amount),
        gasCostForPay + DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI
      );

      // Split the gas budget from the coin with largest balance for simplicity. We can also use any coin
      // that has amount greater than or equal to `DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI * 2`
      const coinWithLargestBalance = inputCoins[inputCoins.length - 1];

      if (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        CoinAPI.getBalance(coinWithLargestBalance)! <
        gasCostForPay + DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI
      ) {
        throw new Error(
          `None of the coins has sufficient balance to cover gas fee`
        );
      }

      const data = await this.serializer.newTransferSui(address, {
        suiObjectId: CoinAPI.getID(coinWithLargestBalance),
        gasBudget: DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI,
        recipient,
        amount: gasCostForPay,
      });
      const signedTx = await vault.signTransaction({ data });
      // TODO: handle response
      await executeTransaction(this.provider, signedTx);

      inputCoins =
        await this.provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
          address,
          BigInt(amount),
          SUI_TYPE_ARG,
          []
        );
    }
    const data = await this.serializer.newPay(address, {
      inputCoins: inputCoins.map((c) => CoinAPI.getID(c)),
      recipients: [recipient],
      amounts: [Number(amount)],
      gasBudget: gasCostForPay,
    });
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async executeMoveCall(
    tx: MoveCallTransaction,
    vault: Vault,
    gasObjectId: string | undefined
  ) {
    const address = vault.getAddress();
    if (!tx.gasPayment) {
      tx.gasPayment = gasObjectId;
    }
    const data = await this.serializer.newMoveCall(address, tx);
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    return await executeTransaction(this.provider, signedTx);
  }

  public async executeSerializedMoveCall(txBytes: Uint8Array, vault: Vault) {
    const signedTx = await vault.signTransaction({
      data: new Base64DataBuffer(txBytes),
    });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async mintExampleNft(vault: Vault, gasObjectId: string | undefined) {
    await this.executeMoveCall(MINT_EXAMPLE_NFT_MOVE_CALL, vault, gasObjectId);
  }
}

async function executeTransaction(
  provider: JsonRpcProvider,
  txn: SignedTx,
  requestType: ExecuteTransactionRequestType = 'WaitForLocalExecution'
) {
  try {
    return await provider.executeTransactionWithRequestType(
      txn.data.toString(),
      'ED25519',
      txn.signature.toString('base64'),
      txn.pubKey.toString('base64'),
      requestType
    );
  } catch (e: any) {
    throw new RpcError(e.message);
  }
}
