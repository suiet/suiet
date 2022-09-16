import { firstValueFrom, map, race, Subject, take } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { v4 as uuidv4 } from 'uuid';
import { PopupWindow } from '../popup-window';
import { StorageKeys } from '../../../store/enum';
import { Storage } from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';

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

export interface PermRequest {
  id: string;
  origin: string;
  favicon: string;
  address: string;
  networkId: string;
  walletId: string;
  accountId: string;
  permissions: string[];
  status: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export class PermReqStorage {
  storage: ChromeStorage;

  constructor() {
    this.storage = new ChromeStorage();
  }

  async getPermRequestStoreMap() {
    const result = await this.storage.getItem(StorageKeys.PERM_REQUESTS);
    if (!result) {
      await this.storage.setItem(StorageKeys.PERM_REQUESTS, JSON.stringify({}));
      return {};
    }
    return JSON.parse(result);
  }

  async getItem(permId: string): Promise<PermRequest | undefined> {
    const permRequests = await this.getPermRequestStoreMap();
    return permRequests[permId];
  }

  async setItem(data: PermRequest) {
    const permRequests = await this.getPermRequestStoreMap();
    permRequests[data.id] = data;
    return await this.storage.setItem(
      StorageKeys.PERM_REQUESTS,
      JSON.stringify(permRequests)
    );
  }
}

const closeWindowSubject: Subject<PermResponse> = new Subject<PermResponse>();

export class DappBgApi {
  storage: Storage;
  chromeStorage: ChromeStorage;
  permReqStorage: PermReqStorage;

  constructor(storage: Storage) {
    this.storage = storage;
    this.chromeStorage = new ChromeStorage();
    this.permReqStorage = new PermReqStorage();
  }

  public async callbackPermRequestResult(payload: PermResponse) {
    if (!payload) {
      throw new Error('params result should not be empty');
    }
    closeWindowSubject.next(payload); // send data to event listener so that the connect function can go on
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
    // const checkRes = await this.checkPermissions(params.permissions, {
    //   origin: context.origin,
    //   address: account.address,
    //   networkId: appContext.networkId,
    // });
    // if (checkRes.result) return true;

    const permRequest = await this.createPermRequest({
      permissions: params.permissions,
      origin: context.origin,
      favicon: context.favicon,
      address: account.address,
      networkId: appContext.networkId,
      walletId: appContext.walletId,
      accountId: appContext.accountId,
    });
    // if (!checkRes.existedId) {
    //
    // } else {
    //   permRequest = (await this.getPermRequest(
    //     checkRes.existedId
    //   )) as PermRequest;
    // }
    // closeWindowSubject = new Subject<PermResponse>();
    // console.log('assign closeWindowSubject', closeWindowSubject);
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
    await this.permReqStorage.setItem(finalResult);
    await reqPermWindow.close();
    return finalResult.status === 'passed';
  }

  createPopupWindow(url: string, params: Record<string, any>) {
    const queryStr = new URLSearchParams(params).toString();
    return new PopupWindow(
      chrome.runtime.getURL('index.html#' + url) +
        (queryStr ? '?' + queryStr : '')
    );
  }

  // private async checkPermissions(
  //   perms: string[],
  //   authInfo: {
  //     origin: string;
  //     address: string;
  //     networkId: string;
  //   }
  // ): Promise<{
  //   result: boolean;
  //   existedId: string | null;
  //   missingPerms: string[];
  // }> {
  //   const storeMap = await this.getPermRequestStoreMap();
  //   const keys = Object.keys(storeMap);
  //   const permReqKey = keys.find((key) => key.endsWith(metaKey));
  //   const resData = {
  //     result: false,
  //     existedId: null as string | null,
  //     missingPerms: [] as string[],
  //   };
  //   if (!permReqKey) return resData;
  //
  //   const existedPermReq = storeMap[permReqKey];
  //   resData.existedId = existedPermReq.id;
  //   perms.forEach((perm) => {
  //     if (!existedPermReq.permissions.includes(perm)) {
  //       resData.result = true;
  //       resData.missingPerms.push(perm);
  //     }
  //   });
  //   return resData;
  // }

  private async createPermRequest(params: {
    origin: string;
    favicon: string;
    address: string;
    networkId: string;
    walletId: string;
    accountId: string;
    permissions: string[];
  }): Promise<PermRequest> {
    const permRequest = {
      ...params,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: null,
      updatedAt: null,
    };
    await this.permReqStorage.setItem(permRequest);
    return permRequest;
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
