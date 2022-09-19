import {
  MoveCallTransaction,
  SuiMoveNormalizedFunction,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { ChromeStorage } from '../../store/storage';
import { StorageKeys } from '../../store/enum';
import { v4 as uuidv4 } from 'uuid';

export enum TxRequestType {
  MOVE_CALL = 'MOVE_CALL',
  SERIALIZED_MOVE_CALL = 'SERIALIZED_MOVE_CALL',
}

export interface TxRequest {
  id: string;
  origin: string;
  favicon: string;
  accountAddress: string;
  approved: boolean | null;
  metadata: SuiMoveNormalizedFunction | null;
  type: TxRequestType;
  data: MoveCallTransaction | string; // depends on the type
  response: SuiTransactionResponse | null;
  responseError: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export class TxRequestStorage {
  private readonly storage: ChromeStorage;
  constructor() {
    this.storage = new ChromeStorage();
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

  async createTxRequest(params: {
    type: TxRequestType;
    origin: string;
    favicon: string;
    accountAddress: string;
    data: MoveCallTransaction | string;
    metadata: SuiMoveNormalizedFunction;
  }): Promise<TxRequest> {
    const data = {
      ...params,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      approved: null,
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
