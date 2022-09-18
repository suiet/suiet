import { filter, firstValueFrom, map, race, Subject, take, tap } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { PopupWindow } from '../popup-window';
import { NetworkApi, Storage, TransactionApi } from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';
import { Permission, PermissionManager } from '../permission';
import { MoveCallTransaction, SuiTransactionResponse } from '@mysten/sui.js';
import { TxRequestManager, TxRequestType } from '../transaction';
import { data } from 'autoprefixer';

interface DappMessage<T> {
  params: T;
  context: {
    origin: string;
    favicon: string;
  };
}

export enum ApprovalType {
  PERMISSION = 'PERMISSION',
  TRANSACTION = 'TRANSACTION',
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
  txApi: TransactionApi;
  networkApi: NetworkApi;

  constructor(storage: Storage) {
    this.storage = storage;
    this.txApi = new TransactionApi(storage);
    this.networkApi = new NetworkApi();
    this.chromeStorage = new ChromeStorage();
    this.permManager = new PermissionManager();
    this.txManager = new TxRequestManager();
  }

  public async connect(
    payload: DappMessage<{
      permissions: string[];
    }>
  ): Promise<boolean> {
    const { params, context } = payload;
    if (!isNonEmptyArray(params?.permissions)) {
      throw new Error('permissions are required for params when connecting');
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
    // monitor the window close event & user action
    const finalResult = await firstValueFrom(
      race(
        approvalSubject.asObservable().pipe(
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
        ),
        onWindowCloseObservable.pipe(
          map(async () => {
            return {
              ...permRequest,
              approved: false,
              updatedAt: new Date().toISOString(),
            };
          })
        )
      ).pipe(take(1))
    );
    await this.permManager.setPermission(finalResult);
    await reqPermWindow.close();
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
      throw new Error('Transaction params required');
    }
    const checkRes = await this.checkPermissions(context.origin, [
      Permission.VIEW_ACCOUNT,
      Permission.SUGGEST_TX,
    ]);
    if (!checkRes.result) {
      // TODO: launch request permission window
      console.warn('TODO: launch request permission window');
      return null;
    }
    const txReq = await this.txManager.createTxRequest({
      origin: context.origin,
      favicon: context.favicon,
      type: params.type,
      data: params.data,
    });
    const txReqWindow = this.createPopupWindow('/dapp/tx-approval', {
      txReqId: txReq.id,
    });
    const windowObservable = await txReqWindow.show();
    const onWindowCloseObservable = windowObservable.pipe(
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
      race(onWindowCloseObservable, onApprovalObservable).pipe(
        take(1),
        tap(async () => {
          await txReqWindow.close();
        })
      )
    );
    if (!finalResult.approved) {
      throw new Error('User rejected');
    }

    const appContext = await this.getAppContext();
    const network = await this.networkApi.getNetwork(appContext.networkId);
    if (!network) {
      throw new Error(
        `network metadata is not found, id=${appContext.networkId}`
      );
    }
    try {
      const response = await this.txApi.executeMoveCall({
        network,
        token: appContext.token,
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
      console.error(e);
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

  async getAccounts(payload: DappMessage<{}>) {
    const checkRes = await this.checkPermissions(payload.context.origin, [
      Permission.VIEW_ACCOUNT,
    ]);
    if (!checkRes.result) {
      throw new Error('no permission to getAccounts info');
    }
    const appContext = await this.getAppContext();
    const result = await this.storage.getAccounts(appContext.walletId);
    return result.map((ac) => ac.address);
  }

  createPopupWindow(url: string, params: Record<string, any>) {
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

  private async getActiveAccount(accountId: string) {
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
