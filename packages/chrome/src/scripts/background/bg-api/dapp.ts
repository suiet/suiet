import { filter, firstValueFrom, map, race, Subject, take, tap } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { PopupWindow } from '../popup-window';
import {
  Account,
  AuthApi,
  NetworkApi,
  Storage,
  TransactionApi,
} from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';
import { Permission, PermissionManager } from '../permission';
import { MoveCallTransaction, SuiTransactionResponse } from '@mysten/sui.js';
import { TxRequestManager, TxRequestType } from '../transaction';
import {
  InvalidParamError,
  NoPermissionError,
  NotFoundError,
  UserRejectionError,
} from '../errors';
import { baseDecode, baseEncode } from 'borsh';
import { SignRequestManager } from '../sign-msg';

interface DappMessage<T> {
  params: T;
  context: {
    origin: string;
    name: string;
    favicon: string;
  };
}

export enum ApprovalType {
  PERMISSION = 'PERMISSION',
  TRANSACTION = 'TRANSACTION',
  SIGN_MSG = 'SIGN_MSG',
}

export interface Approval {
  id: string;
  type: ApprovalType;
  approved: boolean;
  updatedAt: string;
}

const approvalSubject: Subject<Approval> = new Subject<Approval>();

export class DappBgApi {
  storage: Storage;
  chromeStorage: ChromeStorage;
  permManager: PermissionManager;
  txManager: TxRequestManager;
  signManager: SignRequestManager;
  txApi: TransactionApi;
  networkApi: NetworkApi;
  authApi: AuthApi;

  constructor(
    storage: Storage,
    txApi: TransactionApi,
    networkApi: NetworkApi,
    authApi: AuthApi
  ) {
    this.storage = storage;
    this.txApi = txApi;
    this.networkApi = networkApi;
    this.authApi = authApi;
    this.chromeStorage = new ChromeStorage();
    this.permManager = new PermissionManager();
    this.txManager = new TxRequestManager();
    this.signManager = new SignRequestManager();
  }

  public async connect(
    payload: DappMessage<{
      permissions: string[];
    }>
  ): Promise<boolean> {
    const { params, context } = payload;
    if (!isNonEmptyArray(params?.permissions)) {
      throw new InvalidParamError(
        'permissions are required for params when connecting'
      );
    }
    const globalMeta = await this.storage.loadMeta();
    if (!globalMeta) {
      throw new Error('Wallet not initialized');
    }
    const appContext = await this.getAppContext();
    const account = await this.getActiveAccount(appContext.accountId);

    const checkRes = await this.checkPermissions(
      payload.context.origin,
      payload.params.permissions
    );
    if (checkRes.result) return true;

    const permRequest = await this.permManager.createPermRequest({
      permissions: params.permissions,
      name: context.name,
      origin: context.origin,
      favicon: context.favicon,
      address: account.address,
      networkId: appContext.networkId,
      walletId: appContext.walletId,
      accountId: appContext.accountId,
    });
    const reqPermWindow = this.createPopupWindow('/dapp/connect', {
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
    const checkRes = await this.checkPermissions(context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);
    if (!checkRes.result) {
      // TODO: launch request permission window
      throw new NoPermissionError('No permissions to requestTransaction', {
        missingPerms: checkRes.missingPerms,
      });
    }

    const appContext = await this.getAppContext();
    const account = await this.getActiveAccount(appContext.accountId);
    const network = await this.networkApi.getNetwork(appContext.networkId);
    if (!network) {
      throw new NotFoundError(
        `network metadata is not found, id=${appContext.networkId}`
      );
    }
    // load moveCall metadata
    const metadata = await this.txApi.getNormalizedMoveFunction({
      network,
      functionName: params.data.function,
      moduleName: params.data.module,
      objectId: params.data.packageObjectId,
    });
    console.log('metadata', metadata);

    const txReq = await this.txManager.createTxRequest({
      walletId: appContext.walletId,
      address: account.address,
      origin: context.origin,
      name: context.name,
      favicon: context.favicon,
      type: params.type,
      data: params.data,
      metadata,
    });
    const txReqWindow = this.createPopupWindow('/dapp/tx-approval', {
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
    if (!finalResult.approved) {
      throw new UserRejectionError();
    }
    const token = this.authApi.getToken();
    try {
      const response = await this.txApi.executeMoveCall({
        network,
        token,
        walletId: appContext.walletId,
        accountId: appContext.accountId,
        tx: params.data,
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

  public async hasPermissions(payload: DappMessage<{}>) {
    const { context } = payload;
    const appContext = await this.getAppContext();
    const account = await this.getActiveAccount(appContext.accountId);
    return await this.permManager.getAllPermissions({
      address: account.address,
      networkId: appContext.networkId,
      origin: context.origin,
    });
  }

  public async signMessage(payload: DappMessage<{ message: string }>): Promise<{
    signature: string;
    signedMessage: string;
  }> {
    const { params, context } = payload;
    if (!params?.message) {
      throw new InvalidParamError(`params 'message' required`);
    }
    const decodeMsg = baseDecode(params.message);
    const checkRes = await this.checkPermissions(context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);
    if (!checkRes.result) {
      // TODO: launch request permission window
      throw new NoPermissionError('No permissions to signMessage', {
        missingPerms: checkRes.missingPerms,
      });
    }

    const appContext = await this.getAppContext();
    const account = await this.getActiveAccount(appContext.accountId);
    const signReq = await this.signManager.createSignRequest({
      walletId: appContext.walletId,
      address: account.address,
      origin: context.origin,
      name: context.name,
      favicon: context.favicon,
      data: params.message,
    });
    const signReqWindow = this.createPopupWindow('/dapp/sign-msg', {
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
      message: decodeMsg,
      walletId: appContext.walletId,
      accountId: appContext.accountId,
    });
    return {
      signature: baseEncode(result.signature),
      signedMessage: params.message,
    };
  }

  public async getAccounts(payload: DappMessage<{}>) {
    const { context } = payload;
    const checkRes = await this.checkPermissions(context.origin, [
      Permission.VIEW_ACCOUNT,
    ]);
    if (!checkRes.result) {
      throw new NoPermissionError('No permission to getAccounts info', {
        missingPerms: checkRes.missingPerms,
      });
    }
    const appContext = await this.getAppContext();
    // get accounts under the active wallet
    const result = await this.storage.getAccounts(appContext.walletId);
    if (!result) {
      throw new NotFoundError(
        `Accounts not found in wallet (${appContext.walletId})`,
        {
          walletId: appContext.walletId,
        }
      );
    }
    return result.map((ac) => ac.address);
  }

  private createPopupWindow(url: string, params: Record<string, any>) {
    const queryStr = new URLSearchParams(params).toString();
    return new PopupWindow(
      chrome.runtime.getURL('index.html#' + url) +
        (queryStr ? '?' + queryStr : '')
    );
  }

  private async checkPermissions(origin: string, perms: string[]) {
    const appContext = await this.getAppContext();
    const account = await this.getActiveAccount(appContext.accountId);
    return await this.permManager.checkPermissions(perms, {
      address: account.address,
      networkId: appContext.networkId,
      origin: origin,
    });
  }

  private async getActiveAccount(accountId: string): Promise<Account> {
    const account = await this.storage.getAccount(accountId);
    if (!account) {
      throw new Error(`cannot find account, id=${accountId}`);
    }
    return account;
  }

  private async getAppContext() {
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
}
