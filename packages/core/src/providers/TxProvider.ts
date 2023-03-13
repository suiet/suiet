import {
  Coin as CoinAPI,
  Connection,
  ExecuteTransactionRequestType,
  is,
  JsonRpcProvider,
  MoveCallTransaction,
  RawSigner,
  RpcTxnDataSerializer,
  SignableTransaction,
  SuiExecuteTransactionResponse,
  TransactionEffects,
  getTotalGasUsed,
  UnserializedSignableTransaction,
  SuiFinalizedEffects,
} from '@mysten/sui.js';
import { Vault } from '../vault/Vault';
import { Coin, CoinObject } from '../object';
import { createKeypair } from '../utils/vault';
import { number } from 'superstruct';
import { RpcError } from '../errors';

const DEFAULT_GAS_BUDGET_FOR_PAY = 150;
const DEFAULT_GAS_BUDGET = 2000;

function getDefaultGasBudgetByKind(kind: string) {
  switch (kind) {
    case 'paySui':
      return DEFAULT_GAS_BUDGET_FOR_PAY;
    default:
      return DEFAULT_GAS_BUDGET;
  }
}

class TxProvider {
  provider: JsonRpcProvider;
  serializer: RpcTxnDataSerializer;
  vault: Vault;

  constructor(
    txEndpoint: string,
    vault: Vault,
    versionCacheTimeoutInSeconds: number
  ) {
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
    this.vault = vault;
  }

  async transferObject(
    objectId: string,
    recipient: string,
    gasBudget?: number
  ) {
    return await this.signAndExecuteTransaction({
      kind: 'transferObject',
      data: {
        objectId,
        recipient,
        gasBudget,
      },
    });
  }

  public async transferCoin(
    coins: CoinObject[],
    coinType: string, // such as 0x2::sui::SUI
    amount: bigint,
    recipient: string,
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
    return await this.signAndExecuteTransaction(payTx);
  }

  public async executeMoveCall(
    tx: MoveCallTransaction,
    gasObjectId: string | undefined
  ) {
    const _tx = { ...tx };
    if (!_tx.gasPayment) {
      _tx.gasPayment = gasObjectId;
    }

    return await this.signAndExecuteTransaction({
      kind: 'moveCall',
      data: tx,
    });
  }

  public async executeSerializedMoveCall(txBytes: Uint8Array) {
    return await this.signAndExecuteTransaction({
      kind: 'bytes',
      data: txBytes,
    });
  }

  public async signAndExecuteTransaction(
    tx: SignableTransaction,
    requestType: ExecuteTransactionRequestType = 'WaitForLocalExecution'
  ): Promise<SuiExecuteTransactionResponse> {
    const keypair = createKeypair(this.vault);
    const signer = new RawSigner(keypair, this.provider, this.serializer);

    // only try estimating gasBudget for unserialized tx
    if (tx.kind !== 'bytes') {
      const estimatedGasBudget = await this.getEstimatedGasBudget(tx);
      console.log('before estimatedGasBudget', JSON.parse(JSON.stringify(tx)));
      Object.assign(tx.data, { gasBudget: estimatedGasBudget });
      console.log('after estimatedGasBudget', JSON.parse(JSON.stringify(tx)));
    }
    const res = await signer.signAndExecuteTransaction(tx, requestType);
    if (
      is(res, SuiExecuteTransactionResponse) &&
      is((res as any).effects, SuiFinalizedEffects) &&
      ((res as any).effects as SuiFinalizedEffects).effects.status.status ===
        'failure'
    ) {
      const { error, status } = (res as any).effects.effects.status;
      throw new RpcError(error || status, res);
    }
    return res;
  }

  /**
   * simulate transaction execution
   * can be used to estimate gas fee
   * @param tx
   */
  public async dryRunTransaction(
    tx: SignableTransaction
  ): Promise<TransactionEffects> {
    const keypair = createKeypair(this.vault);
    const signer = new RawSigner(keypair, this.provider, this.serializer);
    let res: TransactionEffects;
    try {
      res = await signer.dryRunTransaction(tx);
    } catch (e) {
      throw e;
    }
    if (res.status.status === 'failure') {
      throw new RpcError(res.status.error || res.status.status, res);
    }
    return res;
  }

  /**
   * try to calculate estimated gas budget from dryRun API
   * @param tx
   */
  async getEstimatedGasBudget(
    tx: UnserializedSignableTransaction
  ): Promise<number> {
    // if already specified non-zero gasBudget, return it
    if (typeof tx.data?.gasBudget === 'number' && tx.data.gasBudget > 0) {
      return tx.data.gasBudget;
    }

    const MAX_RETRY = 3;
    let retryCount = 1;
    const defaultGasBudget = getDefaultGasBudgetByKind(tx.kind);

    let effects: TransactionEffects;
    while (retryCount <= MAX_RETRY) {
      // try 3 times with linear increasing budget
      Object.assign(tx.data, { gasBudget: retryCount * defaultGasBudget });
      try {
        effects = await this.dryRunTransaction(tx);
        break;
      } catch (e) {
        retryCount++;
        if (retryCount > MAX_RETRY) {
          throw e;
        }
      }
    }

    const RATIO = 1.5;
    // @ts-expect-error
    const res = getTotalGasUsed(effects); // infer est budget from dryRun result
    return is(res, number()) ? Math.ceil(res * RATIO) : DEFAULT_GAS_BUDGET;
  }
}

export default TxProvider;
