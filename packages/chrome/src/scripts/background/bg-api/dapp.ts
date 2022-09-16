import { firstValueFrom, map, race, Subject, take } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { PopupWindow } from '../popup-window';
import { Storage } from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';
import { PermissionManager } from '../permission';

interface DappMessage<T> {
  params: T;
  context: {
    origin: string;
    favicon: string;
  };
}

export interface PermResponse {
  id: string;
  status: string;
  updatedAt: string;
}

const closeWindowSubject: Subject<PermResponse> = new Subject<PermResponse>();

export class DappBgApi {
  storage: Storage;
  chromeStorage: ChromeStorage;
  permManager: PermissionManager;

  constructor(storage: Storage) {
    this.storage = storage;
    this.chromeStorage = new ChromeStorage();
    this.permManager = new PermissionManager();
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
    const account = await this.storage.getAccount(appContext.accountId);

    const checkRes = await this.permManager.checkPermissions(
      params.permissions,
      {
        origin: context.origin,
        address: account.address,
        networkId: appContext.networkId,
      }
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
        closeWindowSubject.asObservable().pipe(
          map((result) => {
            return {
              ...permRequest,
              status: result.status,
              updatedAt: result.updatedAt,
            };
          })
        ),
        onWindowCloseObservable.pipe(
          map(async () => {
            return {
              ...permRequest,
              status: 'rejected',
              updatedAt: new Date().toISOString(),
            };
          })
        )
      ).pipe(take(1))
    );
    await this.permManager.setPermission(finalResult);
    await reqPermWindow.close();
    return finalResult.status === 'passed';
  }

  public async callbackPermRequestResult(payload: PermResponse) {
    if (!payload) {
      throw new Error('params result should not be empty');
    }
    closeWindowSubject.next(payload); // send data to event listener so that the connect function can go on
  }

  createPopupWindow(url: string, params: Record<string, any>) {
    const queryStr = new URLSearchParams(params).toString();
    return new PopupWindow(
      chrome.runtime.getURL('index.html#' + url) +
        (queryStr ? '?' + queryStr : '')
    );
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
    console.log('key deserialized result', appContext);
    return appContext;
  }
}
