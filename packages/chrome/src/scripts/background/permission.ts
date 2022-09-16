import { ChromeStorage } from '../../store/storage';
import { StorageKeys } from '../../store/enum';
import { v4 as uuidv4 } from 'uuid';

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

  async getPermRequestStoreMap(): Promise<Record<string, PermRequest>> {
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

export class PermissionManager {
  private readonly permReqStorage: PermReqStorage;

  constructor() {
    this.permReqStorage = new PermReqStorage();
  }

  async checkPermissions(
    perms: string[],
    authInfo: {
      origin: string;
      address: string;
      networkId: string;
    }
  ): Promise<{
    result: boolean;
    missingPerms: string[];
  }> {
    const storeMap = await this.permReqStorage.getPermRequestStoreMap();
    const allPermissions = new Set<string>();
    Object.values(storeMap)
      .filter((permData) => {
        return (
          permData.origin === authInfo.origin &&
          permData.address === authInfo.address &&
          permData.networkId === authInfo.networkId
        );
      })
      .forEach((data) => {
        data.permissions.forEach((perm) => {
          allPermissions.add(perm);
        });
      });
    const resData: {
      result: boolean;
      missingPerms: string[];
    } = {
      result: true,
      missingPerms: [],
    };
    perms.forEach((perm) => {
      if (!allPermissions.has(perm)) {
        resData.result = false;
        resData.missingPerms.push(perm);
      }
    });
    return resData;
  }

  async createPermRequest(params: {
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

  async getPermission(permId: string) {
    return await this.permReqStorage.getItem(permId);
  }

  async setPermission(permReq: PermRequest) {
    return await this.permReqStorage.setItem(permReq);
  }
}
