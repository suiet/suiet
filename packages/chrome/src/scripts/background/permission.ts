import { ChromeStorage } from '../../store/storage';
import { StorageKeys } from '../../store/enum';
import { v4 as uuidv4 } from 'uuid';

export enum Permission {
  VIEW_ACCOUNT = 'viewAccount',
  SUGGEST_TX = 'suggestTransactions',
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
  approved: boolean | null;
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
      await this.reset();
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

  async reset() {
    return await this.storage.setItem(
      StorageKeys.PERM_REQUESTS,
      JSON.stringify({})
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
    const allPermissions = new Set<string>();
    const result = await this.getAllPermissions(authInfo);
    result.forEach((data) => {
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
      approved: null,
      updatedAt: null,
    };
    await this.permReqStorage.setItem(permRequest);
    return permRequest;
  }

  async getPermission(permId: string) {
    return await this.permReqStorage.getItem(permId);
  }

  async getAllPermissions(authInfo: {
    origin: string;
    address: string;
    networkId: string;
  }) {
    const storeMap = await this.permReqStorage.getPermRequestStoreMap();
    if (Object.keys(storeMap).length === 0) return [];

    return Object.values(storeMap).filter((permData) => {
      return (
        permData.approved === true &&
        permData.origin === authInfo.origin &&
        permData.address === authInfo.address &&
        permData.networkId === authInfo.networkId
      );
    });
  }

  async setPermission(permReq: PermRequest) {
    return await this.permReqStorage.setItem(permReq);
  }
}
