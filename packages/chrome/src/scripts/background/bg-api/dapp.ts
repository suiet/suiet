import { filter, firstValueFrom, map, race, Subject, take, tap } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { PopupWindow } from '../popup-window';
import {
  Account,
  AccountApi,
  AuthApi,
  Network,
  NetworkApi,
  TransactionApi,
} from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';
import { Permission, PermissionManager } from '../permission';
import {
  MoveCallTransaction,
  SignableTransaction,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { TxRequestManager, TxRequestType } from '../transaction';
import {
  InvalidParamError,
  NoPermissionError,
  NotFoundError,
  UserRejectionError,
} from '../errors';
import { SignRequestManager } from '../sign-msg';
import { FeatureFlagRes } from '../../../api';
import { fetchFeatureFlags } from '../utils/api';
import {
  arrayToUint8array,
  uint8arrayToArray,
} from '../../shared/msg-passing/uint8array-passing';
import { Buffer } from 'buffer';
import type { WalletAccount } from '@mysten/wallet-standard';
import { BackgroundApiContext } from '../api-proxy';
import { BackendEventId } from '../../shared';
import {
  AccountInfo,
  Approval,
  DappConnectionContext,
  DappMessage,
  DappSourceContext,
} from '../types';

export enum CoinSymbol {
  SUI = 'SUI',
}
export enum ApprovalType {
  PERMISSION = 'PERMISSION',
  TRANSACTION = 'TRANSACTION',
  SIGN_MSG = 'SIGN_MSG',
}

const approvalSubject: Subject<Approval> = new Subject<Approval>();

export class DappBgApi {
  private readonly ctx: BackgroundApiContext;
  chromeStorage: ChromeStorage;
  permManager: PermissionManager;
  txManager: TxRequestManager;
  signManager: SignRequestManager;
  txApi: TransactionApi;
  accountApi: AccountApi;
  networkApi: NetworkApi;
  authApi: AuthApi;
  featureFlags: FeatureFlagRes | undefined;

  constructor(
    context: BackgroundApiContext,
    txApi: TransactionApi,
    networkApi: NetworkApi,
    authApi: AuthApi,
    accountApi: AccountApi
  ) {
    this.ctx = context;
    this.txApi = txApi;
    this.networkApi = networkApi;
    this.authApi = authApi;
    this.accountApi = accountApi;
    this.chromeStorage = new ChromeStorage();
    this.permManager = new PermissionManager();
    this.txManager = new TxRequestManager();
    this.signManager = new SignRequestManager();
    fetchFeatureFlags().then((data) => {
      this.featureFlags = data;
    });
  }

  public async connect(
    payload: DappMessage<{
      permissions: string[];
    }>
  ): Promise<boolean> {
    if (!isNonEmptyArray(payload.params?.permissions)) {
      throw new InvalidParamError(
        'permissions are required for params when connecting'
      );
    }
    const globalMeta = await this.ctx.storage.loadMeta();
    if (!globalMeta) {
      const createWalletWindow = this._createPopupWindow('/onboard/welcome');
      await createWalletWindow.show();
      throw new Error('Wallet not initialized');
    }
    try {
      await this._permissionGuard(
        payload.context.origin,
        payload.params.permissions
      );
      return true;
    } catch {}

    const connectionContext = await this._prepareConnectionContext(
      payload.context
    );
    const permRequest = await this.permManager.createPermRequest(
      {
        permissions: payload.params.permissions,
      },
      connectionContext
    );
    const reqPermWindow = this._createPopupWindow('/dapp/connect', {
      permReqId: permRequest.id,
    });
    const onWindowCloseObservable = await reqPermWindow.show();
    const onFallbackDenyObservable = onWindowCloseObservable.pipe(
      map(async () => {
        return {
          ...permRequest,
          approved: false,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    const onApprovalObservable = approvalSubject.asObservable().pipe(
      filter((result) => {
        return (
          result.type === ApprovalType.PERMISSION &&
          result.id === permRequest.id
        );
      }),
      map((result) => {
        return {
          ...permRequest,
          approved: result.approved,
          updatedAt: result.updatedAt,
        };
      })
    );

    // monitor the window close event & user action
    const finalResult = await firstValueFrom(
      race(onFallbackDenyObservable, onApprovalObservable).pipe(
        take(1),
        tap(async () => {
          await reqPermWindow.close();
        })
      )
    );
    await this.permManager.setPermission(finalResult);
    return finalResult.approved;
  }

  // get callback from ui extension
  public async callbackApproval(payload: Approval) {
    if (!payload) {
      throw new Error('params result should not be empty');
    }
    approvalSubject.next(payload); // send data to event listener so that the connect function can go on
  }

  public async getAccountsInfo(
    payload: DappMessage<{}>
  ): Promise<AccountInfo[]> {
    await this._permissionGuard(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
    ]);
    const result = await this._getAccounts(payload);
    return result.map((ac: Account) => ({
      address: ac.address,
      publicKey: ac.pubkey,
    }));
  }

  public async getActiveNetwork(payload: DappMessage<{}>): Promise<string> {
    await this._permissionGuard(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
    ]);
    const { networkId } = await this._getAppContext();
    return networkId;
  }

  // TODO: verify permission for wanted account
  public async signMessage(
    payload: DappMessage<{ message: number[]; account: WalletAccount }>
  ): Promise<{
    signature: number[];
    signedMessage: number[];
  }> {
    if (!payload.params?.message) {
      throw new InvalidParamError(`params 'message' required`);
    }
    await this._permissionGuard(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);

    const connectionContext = await this._prepareConnectionContext(
      payload.context
    );
    const signReq = await this.signManager.createSignRequest(
      {
        data: payload.params.message,
      },
      connectionContext
    );
    const signReqWindow = this._createPopupWindow('/dapp/sign-msg', {
      reqId: signReq.id,
    });
    const onWindowCloseObservable = await signReqWindow.show();
    const onFallbackDenyObservable = onWindowCloseObservable.pipe(
      map(async () => {
        return {
          ...signReq,
          approved: false,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    const onApprovalObservable = approvalSubject.asObservable().pipe(
      filter((result) => {
        return (
          result.type === ApprovalType.SIGN_MSG && result.id === signReq.id
        );
      }),
      map((result) => {
        return {
          ...signReq,
          approved: result.approved,
          updatedAt: result.updatedAt,
        };
      })
    );
    const finalResult = await firstValueFrom(
      race(onFallbackDenyObservable, onApprovalObservable).pipe(
        take(1),
        tap(async () => {
          await signReqWindow.close();
          // remove localstorage record after signed for safety purpose
          await this.signManager.removeSignRequest(signReq.id);
        })
      )
    );
    if (!finalResult.approved) {
      throw new UserRejectionError();
    }

    const token = this.authApi.getToken();
    const result = await this.txApi.signMessage({
      token,
      message: arrayToUint8array(payload.params.message),
      walletId: connectionContext.target.walletId,
      accountId: connectionContext.target.accountId,
    });
    return {
      signature: uint8arrayToArray(result.signature),
      signedMessage: payload.params.message,
    };
  }

  public async signAndExecuteTransaction(
    payload: DappMessage<{ transaction: SignableTransaction }>
  ) {
    if (!payload.params?.transaction) {
      throw new InvalidParamError('params transaction is required');
    }
    await this._permissionGuard(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);

    const connectionCtx = await this._prepareConnectionContext(payload.context);
    await this._transactionGuard(payload.params.transaction, connectionCtx);

    const { transaction } = payload.params;
    const network = await this._getNetwork(connectionCtx.networkId);
    const txMetadata = await this._transactionMetadata(
      transaction,
      connectionCtx
    );
    const { finalResult } = await this.promptForTxApproval(
      {
        txType: transaction.kind,
        txData: transaction.data,
        metadata: txMetadata,
      },
      connectionCtx
    );
    if (!finalResult.approved) {
      throw new UserRejectionError();
    }

    const token = this.authApi.getToken();
    const txContext = {
      token,
      network,
      walletId: connectionCtx.target.walletId,
      accountId: connectionCtx.target.accountId,
    };
    return await this.txApi.signAndExecuteTransaction({
      transaction,
      context: txContext,
    });
  }

  /**
   * @deprecated use getAccountsInfo instead
   * @param payload
   */
  public async getAccounts(payload: DappMessage<{}>) {
    const result = await this._getAccounts(payload);
    return result.map((ac: Account) => ac.address);
  }

  /**
   * @deprecated use signAndExecuteTransaction instead
   * @param payload
   */
  public async requestTransaction(
    payload: DappMessage<{
      type: TxRequestType;
      data: MoveCallTransaction;
    }>
  ): Promise<SuiTransactionResponse | null> {
    const { params, context } = payload;
    if (!params?.data) {
      throw new InvalidParamError('Transaction params required');
    }
    await this._permissionGuard(context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);

    const connectionCtx = await this._prepareConnectionContext(payload.context);
    const network = await this._getNetwork(connectionCtx.networkId);
    const { txReq, finalResult } = await this.promptForTxApproval(
      {
        txType: params.type,
        txData: params.data,
      },
      connectionCtx
    );
    if (!finalResult.approved) {
      throw new UserRejectionError();
    }
    const token = this.authApi.getToken();
    const txContext = {
      token,
      network,
      walletId: connectionCtx.target.walletId,
      accountId: connectionCtx.target.accountId,
    };
    try {
      const response = await this.txApi.executeMoveCall({
        transaction: params.data,
        context: txContext,
      });
      await this.txManager.storeTxRequest({
        ...txReq,
        response,
      });
      return response;
    } catch (e: any) {
      await this.txManager.storeTxRequest({
        ...txReq,
        responseError: e.message,
      });
      throw e;
    }
  }

  // called from ui
  public async notifyNetworkSwitch(payload: { networkId: string }) {
    const { networkId } = payload;
    if (!networkId) return;

    this.ctx.broadcast({
      id: BackendEventId.NETWORK_SWITCH,
      networkId,
    });
  }

  private async promptForTxApproval(
    params: {
      txType: string;
      txData: any;
      metadata?: any;
    },
    connectionContext: DappConnectionContext
  ) {
    const txReq = await this.txManager.createTxRequest(
      {
        type: params.txType,
        data: params.txData,
        metadata: params.metadata ?? null, // TODO: need to analysis
      },
      connectionContext
    );
    const txReqWindow = this._createPopupWindow('/dapp/tx-approval', {
      txReqId: txReq.id,
    });
    const onWindowCloseObservable = await txReqWindow.show();
    const onFallbackDenyObservable = onWindowCloseObservable.pipe(
      map(async () => {
        return {
          ...txReq,
          approved: false,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    const onApprovalObservable = approvalSubject.asObservable().pipe(
      filter((result) => {
        return (
          result.type === ApprovalType.TRANSACTION && result.id === txReq.id
        );
      }),
      map((result) => {
        return {
          ...txReq,
          approved: result.approved,
          updatedAt: result.updatedAt,
        };
      })
    );
    const finalResult = await firstValueFrom(
      race(onFallbackDenyObservable, onApprovalObservable).pipe(
        take(1),
        tap(async () => {
          await txReqWindow.close();
        })
      )
    );
    return { txReq, finalResult };
  }

  public async hasPermissions(payload: DappMessage<{}>) {
    const { context } = payload;
    const appContext = await this._getAppContext();
    const account = await this._getActiveAccount(appContext.accountId);
    return await this.permManager.getAllPermissions({
      address: account.address,
      networkId: appContext.networkId,
      origin: context.origin,
    });
  }

  public async getPublicKey(payload: DappMessage<{}>): Promise<number[]> {
    await this._permissionGuard(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
    ]);

    const appContext = await this._getAppContext();
    const publicKey = await this.accountApi.getPublicKey(appContext.accountId);
    return uint8arrayToArray(Buffer.from(publicKey.slice(2), 'hex'));
  }

  private async _getAccounts(payload: DappMessage<{}>) {
    const { context } = payload;
    await this._permissionGuard(context.origin, [Permission.VIEW_ACCOUNT]);
    const appContext = await this._getAppContext();
    // get accounts under the active wallet
    const result = await this.ctx.storage.getAccounts(appContext.walletId);
    if (!result) {
      throw new NotFoundError(
        `Accounts not found in wallet (${appContext.walletId})`,
        {
          walletId: appContext.walletId,
        }
      );
    }
    return result;
  }

  private _createPopupWindow(url: string, params?: Record<string, any>) {
    const queryStr = new URLSearchParams(params).toString();
    return new PopupWindow(
      chrome.runtime.getURL('index.html#' + url) +
        (queryStr ? '?' + queryStr : '')
    );
  }

  private async _permissionGuard(origin: string, perms: string[]) {
    const appContext = await this._getAppContext();
    const account = await this._getActiveAccount(appContext.accountId);
    const res = await this.permManager.checkPermissions(perms, {
      address: account.address,
      networkId: appContext.networkId,
      origin,
    });
    if (!res.result) {
      throw new NoPermissionError('No permission for the action', {
        missingPerms: res.missingPerms,
      });
    }
  }

  private async _transactionGuard(
    tx: SignableTransaction,
    context: DappConnectionContext
  ) {
    const network = await this._getNetwork(context.networkId);
    const coinBalanceList = await this.txApi.getCoinsBalance({
      network,
      address: context.target.address,
    });
    const sui = coinBalanceList.find((item) => item.symbol === CoinSymbol.SUI);
    if (!sui) {
      throw new Error('SUI balance is insufficient to pay for gasBudget');
    }
    if (tx.kind !== 'bytes') {
      if (+sui.balance < tx.data.gasBudget) {
        throw new Error('SUI balance is insufficient to pay for gasBudget');
      }
    }
    // TODO: set balance guard for pay & paySui & payAllSui
    // if (tx.kind === 'paySui') {
    //   if (
    //     +sui.balance <
    //     tx.data.gasBudget + tx.data.amounts.reduce((c, r) => c + r, 0)
    //   ) {
    //     throw new Error(
    //       'SUI balance is insufficient to pay for amount + gasBudget'
    //     );
    //   }
    // }
  }

  private async _transactionMetadata(
    tx: SignableTransaction,
    context: DappConnectionContext
  ) {
    if (tx.kind === 'payAllSui') {
      const network = await this._getNetwork(context.networkId);
      const coinObjList = await this.txApi.getOwnedCoins({
        network,
        address: context.target.address,
      });
      const suiToPayList = coinObjList.filter(
        (obj) =>
          obj.symbol === CoinSymbol.SUI && tx.data.inputCoins.includes(obj.id)
      );
      const payAllSuiAmount = suiToPayList.reduce(
        (p, c) => p + Number(c.balance),
        0
      );
      return {
        payAllSuiAmount,
      };
    }
    return null;
  }

  private async _getActiveAccount(accountId: string): Promise<Account> {
    const account = await this.ctx.storage.getAccount(accountId);
    if (!account) {
      throw new Error(`cannot find account, id=${accountId}`);
    }
    return account;
  }

  private async _getAppContext() {
    const storageKey = 'persist:root';
    const result = await this.chromeStorage.getItem(storageKey);
    if (!result) {
      throw new Error('failed to load appContext from local storage');
    }
    let appContext: AppContextState;
    try {
      const root = JSON.parse(result);
      appContext = JSON.parse(root.appContext);
    } catch (e) {
      console.error(e);
      throw new Error('failed to parse appContext data from local storage');
    }
    return appContext;
  }

  private async _getNetwork(networkId: string) {
    const defaultData = await this.networkApi.getNetwork(networkId);
    if (!defaultData) {
      throw new NotFoundError(`network metadata is not found, id=${networkId}`);
    }
    if (
      !this.featureFlags ||
      typeof this.featureFlags.networks !== 'object' ||
      !isNonEmptyArray(Object.keys(this.featureFlags.networks))
    )
      return defaultData;
    const currentNetworkConfig = this.featureFlags.networks[networkId];
    if (!currentNetworkConfig?.full_node_url) return defaultData;

    const overrideData: Network = {
      ...defaultData,
      queryRpcUrl: currentNetworkConfig.full_node_url,
      txRpcUrl: currentNetworkConfig.full_node_url,
      versionCacheTimoutInSeconds:
        currentNetworkConfig.version_cache_timout_in_seconds,
    };
    return overrideData;
  }

  private async _prepareConnectionContext(
    sourceCtx: DappSourceContext
  ): Promise<DappConnectionContext> {
    const appContext = await this._getAppContext();
    const account = await this._getActiveAccount(appContext.accountId);
    return {
      source: sourceCtx,
      target: {
        address: account.address,
        walletId: appContext.walletId,
        accountId: appContext.accountId,
      },
      networkId: appContext.networkId,
    };
  }
}
