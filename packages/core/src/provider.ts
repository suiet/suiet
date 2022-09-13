import {
  getObjectExistsResponse,
  JsonRpcProvider,
  RpcTxnDataSerializer,
  SuiMoveObject,
  SuiObject,
  getTransferObjectTransaction,
  getTransferSuiTransaction,
  getTransactionData,
  getExecutionStatusType,
  getMoveObject,
  getCoinAfterMerge,
  getCoinAfterSplit,
  MoveCallTransaction,
  Base64DataBuffer,
  getMoveCallTransaction,
} from '@mysten/sui.js';
import { Coin, CoinObject, Nft, NftObject } from './object';
import { TxnHistoryEntry, TxObject } from './storage/types';
import { SignedTx } from './vault/types';
import { Vault } from './vault/Vault';

export const SUI_SYSTEM_STATE_OBJECT_ID =
  '0x0000000000000000000000000000000000000005';

export class Provider {
  query: QueryProvider;
  tx: TxProvider;

  constructor(queryEndpoint: string, gatewayEndpoint: string) {
    this.query = new QueryProvider(queryEndpoint);
    this.tx = new TxProvider(gatewayEndpoint);
  }

  async transferCoin(
    symbol: string,
    amount: number,
    recipient: string,
    vault: Vault
  ) {
    const coins = (await this.query.getOwnedCoins(vault.getAddress())).filter(
      (coin) => coin.symbol === symbol
    );
    if (coins.length === 0) {
      throw new Error('no coin to transfer');
    }

    if (symbol === GAS_SYMBOL) {
      await this.tx.transferSui(coins, amount, recipient, vault);
    } else {
      await this.tx.transferCoin(coins, amount, recipient, vault);
    }
  }

  async transferObject(objectId: string, recipient: string, vault: Vault) {
    const object = (await this.query.getOwnedObjects(vault.getAddress())).find(
      (object) => object.reference.objectId === objectId
    );
    if (!object) {
      throw new Error('no object to transfer');
    }
    await this.tx.transferObject(objectId, recipient, vault);
  }
}

export class QueryProvider {
  provider: JsonRpcProvider;

  constructor(queryEndpoint: string) {
    this.provider = new JsonRpcProvider(queryEndpoint);
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
    trySyncAccountState(this.provider, address);
    const objectInfos = await this.provider.getObjectsOwnedByAddress(address);
    const objectIds = objectInfos.map((obj) => obj.objectId);
    const resps = await this.provider.getObjectBatch(objectIds);
    return resps
      .filter((resp) => resp.status === 'Exists')
      .map((resp) => getObjectExistsResponse(resp) as SuiObject);
  }

  public async getOwnedCoins(address: string): Promise<CoinObject[]> {
    trySyncAccountState(this.provider, address);
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

  public async getOwnedNfts(address: string): Promise<NftObject[]> {
    trySyncAccountState(this.provider, address);
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
    trySyncAccountState(this.provider, address);
    const txs = await this.provider.getTransactionsForAddress(address);
    if (txs.length === 0 || !txs[0]) {
      return [];
    }
    const digests = txs
      .map((tx) => tx[1])
      .filter((value, index, self) => self.indexOf(value) === index);

    const effects = await this.provider.getTransactionWithEffectsBatch(digests);
    const results = [];
    for (const effect of effects) {
      const data = getTransactionData(effect.certificate);
      for (const tx of data.transactions) {
        const transferSui = getTransferSuiTransaction(tx);
        const transferObject = getTransferObjectTransaction(tx);
        const moveCall = getMoveCallTransaction(tx);
        if (transferSui) {
          results.push({
            timestamp_ms: effect.timestamp_ms,
            txStatus: getExecutionStatusType(effect),
            transactionDigest: effect.certificate.transactionDigest,
            gasUsed: effect.effects.gasUsed.computationCost,
            from: data.sender,
            to: transferSui.recipient,
            object: {
              type: 'coin' as 'coin',
              balance: transferSui.amount
                ? BigInt(transferSui.amount)
                : BigInt(0),
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
            const coinObject = Coin.getCoinObject(obj);
            txObj = {
              type: 'coin' as 'coin',
              ...coinObject,
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
              gasUsed: effect.effects.gasUsed.computationCost,
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
            gasUsed: effect.effects.gasUsed.computationCost,
            from: data.sender,
            to: moveCall.package.objectId,
            object: {
              type: 'move_call' as 'move_call',
              packageObjectId: moveCall.package.objectId,
              module: moveCall.module,
              function: moveCall.function,
              arguments: moveCall.arguments?.map((arg) => JSON.stringify(arg)),
            },
          });
        }
      }
    }
    return results;
  }
}

export const DEFAULT_GAS_BUDGET_FOR_SPLIT = 1000;
export const DEFAULT_GAS_BUDGET_FOR_MERGE = 500;
export const DEFAULT_GAS_BUDGET_FOR_TRANSFER = 100;
export const DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI = 100;
export const DEFAULT_GAS_BUDGET_FOR_STAKE = 1000;
export const GAS_TYPE_ARG = '0x2::sui::SUI';
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
  serializer: RpcTxnDataSerializer;

  constructor(gatewayEndpoint: string) {
    this.provider = new JsonRpcProvider(gatewayEndpoint);
    this.serializer = new RpcTxnDataSerializer(gatewayEndpoint);
  }

  async transferObject(objectId: string, recipient: string, vault: Vault) {
    const data = await this.serializer.newTransferObject(vault.getAddress(), {
      objectId,
      gasBudget: DEFAULT_GAS_BUDGET_FOR_TRANSFER,
      recipient,
    });
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  async mergeCoinsForBalance(
    coins: CoinObject[],
    amount: bigint,
    vault: Vault
  ): Promise<CoinObject> {
    coins.sort((a, b) => (a.balance - b.balance > 0 ? 1 : -1));
    const coinWithSufficientBalance = coins.find(
      (coin) => coin.balance >= amount
    );
    if (coinWithSufficientBalance) {
      return coinWithSufficientBalance;
    }
    // merge coins with sufficient balance.
    const primaryCoin = coins[coins.length - 1];
    let expectedBalance = primaryCoin.balance;
    const coinsToMerge = [];
    for (let i = coins.length - 2; i > 0; i--) {
      expectedBalance += coins[i].balance;
      coinsToMerge.push(coins[i].objectId);
      if (expectedBalance >= amount) {
        break;
      }
    }
    if (expectedBalance < amount) {
      throw new Error('Insufficient balance');
    }
    const address = vault.getAddress();
    trySyncAccountState(this.provider, address);
    for (const coin of coinsToMerge) {
      const data = await this.serializer.newMergeCoin(address, {
        primaryCoin: primaryCoin.objectId,
        coinToMerge: coin,
        gasBudget: DEFAULT_GAS_BUDGET_FOR_MERGE,
      });
      const signedTx = await vault.signTransaction({ data });
      const resp = await executeTransaction(this.provider, signedTx);
      const obj = getCoinAfterMerge(resp) as SuiObject;
      primaryCoin.objectId = obj.reference.objectId;
      primaryCoin.balance = Coin.getBalance(
        getMoveObject(obj) as SuiMoveObject
      );
    }
    if (primaryCoin.balance !== expectedBalance) {
      throw new Error('Merge coins failed caused by transactions conflicted');
    }
    return primaryCoin;
  }

  async splitCoinForBalance(coin: CoinObject, amount: bigint, vault: Vault) {
    const address = vault.getAddress();
    const data = await this.serializer.newSplitCoin(address, {
      coinObjectId: coin.objectId,
      splitAmounts: [Number(coin.balance - amount)],
      gasBudget: DEFAULT_GAS_BUDGET_FOR_SPLIT,
    });
    const signedTx = await vault.signTransaction({ data });
    const resp = await executeTransaction(this.provider, signedTx);
    const obj = getCoinAfterSplit(resp) as SuiObject;
    const balance = Coin.getBalance(getMoveObject(obj) as SuiMoveObject);
    if (balance !== amount) {
      throw new Error('Split coin failed caused by transactions conflicted');
    }
    coin.balance = amount;
    return coin;
  }

  public async transferCoin(
    coins: CoinObject[],
    amount: number,
    recipient: string,
    vault: Vault
  ) {
    const address = vault.getAddress();
    trySyncAccountState(this.provider, address);
    const mergedCoin = await this.mergeCoinsForBalance(
      coins,
      BigInt(amount),
      vault
    );
    const coin = await this.splitCoinForBalance(
      mergedCoin,
      BigInt(amount),
      vault
    );
    await this.transferObject(coin.objectId, recipient, vault);
  }

  public async transferSui(
    coins: CoinObject[],
    amount: number,
    recipient: string,
    vault: Vault
  ) {
    const address = vault.getAddress();
    trySyncAccountState(this.provider, address);
    const actualAmount = BigInt(amount + DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI);
    const coin = await this.mergeCoinsForBalance(
      coins,
      BigInt(actualAmount),
      vault
    );
    console.log(
      coin.objectId,
      DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI,
      recipient,
      amount
    );
    const data = await this.serializer.newTransferSui(address, {
      suiObjectId: coin.objectId,
      gasBudget: DEFAULT_GAS_BUDGET_FOR_TRANSFER_SUI,
      recipient,
      amount,
    });
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async executeMoveCall(tx: MoveCallTransaction, vault: Vault) {
    const address = vault.getAddress();
    const data = await this.serializer.newMoveCall(address, tx);
    const signedTx = await vault.signTransaction({ data });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async executeSerializedMoveCall(txBytes: Uint8Array, vault: Vault) {
    const signedTx = await vault.signTransaction({
      data: new Base64DataBuffer(txBytes),
    });
    // TODO: handle response
    await executeTransaction(this.provider, signedTx);
  }

  public async mintExampleNft(vault: Vault) {
    const address = vault.getAddress();
    trySyncAccountState(this.provider, address);

    await this.executeMoveCall(MINT_EXAMPLE_NFT_MOVE_CALL, vault);
  }
}

async function trySyncAccountState(provider: JsonRpcProvider, address: string) {
  try {
    await provider.syncAccountState(address);
  } catch (err) {
    console.log('sync account state failed', err);
  }
}

async function executeTransaction(provider: JsonRpcProvider, txn: SignedTx) {
  return await provider.executeTransaction(
    txn.data.toString(),
    'ED25519',
    txn.signature.toString('base64'),
    txn.pubKey.toString('base64')
  );
}
