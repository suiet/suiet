// compile by vite-rollup individually, see configuration in vite.config.ts
// dynamically load by browser getURL in the content script of extension

import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { reqData, WindowMsgTarget } from '../shared';

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'] as const;
type AllPermissionsType = typeof ALL_PERMISSION_TYPES;
type PermissionType = AllPermissionsType[number];

export interface WalletCapabilities {
  hasPermissions: (permissions: readonly PermissionType[]) => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  getAccounts: () => Promise<SuiAddress[]>;
  executeMoveCall: (
    transaction: MoveCallTransaction
  ) => Promise<SuiTransactionResponse>;
  executeSerializedMoveCall: (
    transactionBytes: Uint8Array
  ) => Promise<SuiTransactionResponse>;
}

export class DAppInterface implements WalletCapabilities {
  name: string;
  connected: boolean;
  connecting: boolean;

  constructor() {
    this.name = 'Suiet';
    this.connected = false;
    this.connecting = false;
  }

  async connect() {
    window.postMessage({
      target: WindowMsgTarget.SUIET_CONTENT,
      payload: reqData('connect', null),
    });
  }

  async disconnect() {
    window.postMessage({
      target: WindowMsgTarget.SUIET_CONTENT,
      payload: reqData('disconnect', null),
    });
  }

  async hasPermissions(permissions: readonly string[]) {
    console.log('permissions', permissions);
    return true;
  }

  async requestPermissions() {
    return true;
  }

  async executeMoveCall(
    transaction: MoveCallTransaction
  ): Promise<SuiTransactionResponse> {
    return await Promise.resolve(undefined as any);
  }

  async executeSerializedMoveCall(
    transactionBytes: Uint8Array
  ): Promise<SuiTransactionResponse> {
    return await Promise.resolve(undefined as any);
  }

  async getAccounts(): Promise<SuiAddress[]> {
    return [];
  }
}

// mount __suiet__ object on DApp's window environment
Object.defineProperty(window, '__suiet__', {
  enumerable: false,
  configurable: false,
  value: new DAppInterface(),
});
