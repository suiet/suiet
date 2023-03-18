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

export function getDefaultGasBudgetByKind(kind: string) {
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

    if (tx.kind !== 'bytes') {
      // only try estimating gasBudget for unserializable tx
      const estimatedGasBudget = await this.getEstimatedGasBudget(tx);
      Object.assign(tx.data, { gasBudget: estimatedGasBudget });
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
    const res: TransactionEffects = await signer.dryRunTransaction(tx);
    if (res.status.status === 'failure') {
      throw new RpcError(res.status.error ?? res.status.status, res);
    }
    return res;
  }

  /**
   * try to calculate estimated gas budget from dryRun API
   * @param tx
   */
  async getEstimatedGasBudget(tx: SignableTransaction): Promise<number> {
    const defaultGasBudget = getDefaultGasBudgetByKind(tx.kind);
    if (tx.kind !== 'bytes') {
      if (typeof tx.data?.gasBudget === 'number' && tx.data.gasBudget > 0) {
        // if already specified non-zero gasBudget, return it
        return tx.data.gasBudget;
      }
      // else, assign a default budget
      Object.assign(tx.data, { gasBudget: defaultGasBudget });
    }

    let effects: TransactionEffects;
    try {
      effects = await this.dryRunTransaction(tx);
      const RATIO = 1.5;
      const res = getTotalGasUsed(effects); // infer est budget from dryRun result
      // return estimated budget based on the response of dryRun
      return is(res, number()) ? Math.ceil(res * RATIO) : DEFAULT_GAS_BUDGET;
    } catch (e) {
      // if failed, return default gas budget
      return defaultGasBudget;
    }
  }
}

export default TxProvider;
