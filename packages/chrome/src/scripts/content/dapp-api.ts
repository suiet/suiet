// compile by vite-rollup individually, see configuration in vite.config.ts
// dynamically load by browser getURL in the content script of extension

import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { reqData, ResData, WindowMsgTarget } from '../shared';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'] as const;
type AllPermissionsType = typeof ALL_PERMISSION_TYPES;
type PermissionType = AllPermissionsType[number];

enum Permission {
  VIEW_ACCOUNT = 'viewAccount',
  SUGGEST_TX = 'suggestTransactions',
}

export interface ISuietWallet {
  connect: (perms: Permission[]) => Promise<ResData>;
  disconnect: () => Promise<ResData>;
  getAccounts: () => Promise<SuiAddress[]>;
  executeMoveCall: (
    transaction: MoveCallTransaction
  ) => Promise<SuiTransactionResponse>;
  executeSerializedMoveCall: (
    transactionBytes: Uint8Array
  ) => Promise<SuiTransactionResponse>;
  hasPermissions: (permissions: readonly PermissionType[]) => Promise<boolean>;
  requestPermissions: () => Promise<ResData>;
}

export class DAppInterface implements ISuietWallet {
  name: string;
  connected: boolean;
  connecting: boolean;
  windowMsgStream: WindowMsgStream;

  constructor() {
    this.name = 'Suiet';
    this.connected = false;
    this.connecting = false;
    this.windowMsgStream = new WindowMsgStream(
      WindowMsgTarget.DAPP,
      WindowMsgTarget.SUIET_CONTENT
    );
  }

  async connect(permissions: Permission[]) {
    console.log('[dappapi] handshake');
    await this.windowMsgStream.post(reqData('handshake', null));
    console.log('[dappapi] connect');
    return await this.windowMsgStream.post(
      reqData('dapp.connect', { permissions })
    );
  }

  async disconnect() {
    await this.windowMsgStream.post(reqData('dapp.disconnect', null));
    return await this.windowMsgStream.post(reqData('dhandwave', null));
  }

  async hasPermissions(permissions: readonly string[]) {
    console.log('permissions', permissions);
    return true;
  }

  async requestPermissions() {
    return await this.windowMsgStream.post(reqData('requestPermissions', null));
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
