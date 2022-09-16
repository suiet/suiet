import { Storage } from '@suiet/core';
import { filter, lastValueFrom, map, race, Subject, tap } from 'rxjs';
import { ChromeStorage } from '../../../store/storage';
import { AppContextState } from '../../../store/app-context';
import { v4 as uuidv4 } from 'uuid';
import { PopupWindow } from '../popup-window';
import { StorageKeys } from '../../../store/enum';

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

export const PermResponseEventEmitter: Subject<PermResponse> = new Subject();

export class DappBgApi {
  storage: Storage;
  chromeStorage: ChromeStorage;

  constructor(storage: Storage) {
    this.storage = storage;
    this.chromeStorage = new ChromeStorage();
  }

  public async connect(
    payload: DappMessage<{
      permissions: string[];
    }>
  ): Promise<boolean> {
    const { params, context } = payload;
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
    const reqPermWindow = this.createPopupWindow('/dapp/connect', {
      permReqId: permRequest.id,
    });
    const onWindowCloseObservable = await reqPermWindow.show();
    const onResponseObservable = PermResponseEventEmitter.pipe(
      filter((res) => res.id === permRequest.id),
      map((res) => {
        permRequest.status = res.status;
        permRequest.updatedAt = res.updatedAt;
        return permRequest;
      }),
      tap(() => {
        reqPermWindow.close();
      })
    );
    const permReqResult = await lastValueFrom(
      race(
        onResponseObservable,
        onWindowCloseObservable.pipe(
          map(() => {
            permRequest.status = 'rejected';
            permRequest.updatedAt = new Date().toISOString();
            return permRequest;
          })
        )
      )
    );
    await this.storePermRequest(permReqResult);
    return permRequest.status === 'passed';
  }

  createPopupWindow(url: string, params: Record<string, any>) {
    const queryStr = new URLSearchParams(params).toString();
    return new PopupWindow(
      chrome.runtime.getURL('index.html' + url) +
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
    await this.storePermRequest(permRequest);
    return permRequest;
  }

  private async storePermRequest(data: PermRequest) {
    const permRequests = await this.getPermRequestStoreMap();
    permRequests[data.id] = data;
    return await this.chromeStorage.setItem(
      StorageKeys.PERM_REQUESTS,
      JSON.stringify(permRequests)
    );
  }

  private async getPermRequest(
    permId: string
  ): Promise<PermRequest | undefined> {
    const permRequests = await this.getPermRequestStoreMap();
    return permRequests[permId];
  }

  private async getPermRequestStoreMap(): Promise<Record<string, PermRequest>> {
    const result = await this.chromeStorage.getItem(StorageKeys.PERM_REQUESTS);
    if (!result) {
      await this.chromeStorage.setItem(
        StorageKeys.PERM_REQUESTS,
        JSON.stringify({})
      );
      return {};
    }
    return JSON.parse(result);
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
