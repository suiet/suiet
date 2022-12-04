import { ChromeStorage } from '../../store/storage';
import { StorageKeys } from '../../store/enum';
import { v4 as uuidv4 } from 'uuid';
import { has } from 'lodash-es';
import { DappBaseRequest, DappConnectionContext } from './types';

export interface SignRequest extends DappBaseRequest {
  data: number[];
}

export class SignRequestStorage {
  private readonly storage: ChromeStorage;
  constructor() {
    this.storage = new ChromeStorage();
  }

  async get(id: string): Promise<SignRequest | undefined> {
    const map = await this.getMap();
    return map[id];
  }

  async set(data: SignRequest) {
    const map = await this.getMap();
    map[data.id] = data;
    await this.storage.setItem(StorageKeys.SIGN_REQUESTS, JSON.stringify(map));
  }

  private async getMap(): Promise<Record<string, SignRequest>> {
    const map = await this.storage.getItem(StorageKeys.SIGN_REQUESTS);
    if (!map) {
      await this.reset();
      return {};
    }
    return JSON.parse(map);
  }

  async remove(id: string) {
    const map = await this.getMap();
    if (!has(map, id)) return;
    Reflect.deleteProperty(map, id);
    await this.storage.setItem(StorageKeys.SIGN_REQUESTS, JSON.stringify(map));
  }

  async reset() {
    return await this.storage.setItem(
      StorageKeys.SIGN_REQUESTS,
      JSON.stringify({})
    );
  }
}

export class SignRequestManager {
  storage: SignRequestStorage;
  constructor() {
    this.storage = new SignRequestStorage();
  }

  async createSignRequest(
    params: {
      data: number[];
    },
    connectionContext: DappConnectionContext
  ): Promise<SignRequest> {
    const data = {
      ...connectionContext,
      ...params,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      approved: null,
      updatedAt: null,
    };
    await this.storage.set(data);
    return data;
  }

  async storeSignRequest(data: SignRequest) {
    await this.storage.set(data);
  }

  async removeSignRequest(id: string) {
    return await this.storage.remove(id);
  }
}
