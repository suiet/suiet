import { Storage } from '../../store/storage';
import { StorageKeys } from '../../store/enum';
import { v4 as uuidv4 } from 'uuid';
import { DappBaseRequest, DappConnectionContext } from './types';
import { SuiTransactionBlockResponse } from '@mysten/sui.js';

export enum TxRequestType {
  MOVE_CALL = 'moveCall',
  SERIALIZED_MOVE_CALL = 'bytes',
}

export enum TxFailureReason {
  USER_REJECTION = 'USER_REJECTION',
  INSUFFICIENT_GAS = 'INSUFFICIENT_GAS',
}

export interface TxRequest extends DappBaseRequest {
  data: any; // depends on the type
  response: SuiTransactionBlockResponse | null;
  responseError: string | null;
}

export class TxRequestStorage {
  private readonly storage: Storage;
  constructor() {
    this.storage = new Storage();
  }

  async get(id: string): Promise<TxRequest | undefined> {
    const map = await this.getMap();
    return map[id];
  }

  async set(data: TxRequest) {
    const map = await this.getMap();
    map[data.id] = data;
    await this.storage.setItem(StorageKeys.TX_REQUESTS, JSON.stringify(map));
  }

  private async getMap(): Promise<Record<string, TxRequest>> {
    const map = await this.storage.getItem(StorageKeys.TX_REQUESTS);
    if (!map) {
      await this.reset();
      return {};
    }
    return JSON.parse(map);
  }

  async reset() {
    return await this.storage.setItem(
      StorageKeys.TX_REQUESTS,
      JSON.stringify({})
    );
  }
}

export class TxRequestManager {
  storage: TxRequestStorage;
  constructor() {
    this.storage = new TxRequestStorage();
  }

  async createTxRequest(
    params: {
      data: any;
    },
    connectionContext: DappConnectionContext
  ): Promise<TxRequest> {
    const data = {
      ...connectionContext,
      ...params,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      approved: null,
      reason: null,
      response: null,
      responseError: null,
      updatedAt: null,
    };
    await this.storage.set(data);
    return data;
  }

  async storeTxRequest(data: TxRequest) {
    await this.storage.set(data);
  }
}
