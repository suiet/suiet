// compile by vite-rollup individually, see configuration in vite.config.ts
// dynamically load by browser getURL in the content script of extension

import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { WalletCapabilities } from '@mysten/wallet-adapter-base';

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'];
type AllPermissionsType = typeof ALL_PERMISSION_TYPES;
type PermissionType = AllPermissionsType[number];

export interface SuietWallet extends WalletCapabilities {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasPermissions: (permissions: readonly PermissionType[]) => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
}

export class DAppInterface implements SuietWallet {
  name: string;
  connected: boolean;
  connecting: boolean;

  constructor() {
    this.name = '';
    this.connected = false;
    this.connecting = false;
  }

  async connect() {
    console.log('fake connected');
  }

  async disconnect() {
    console.log('fake disconnected');
  }

  async hasPermissions(permissions: readonly string[]) {
    console.log('permissions', permissions);
    return true;
  }

  async requestPermissions() {
    // window.postMessage({
    //   target: 'suiet_content-script',
    //   payload: {
    //     joke: 'Knock knock',
    //   },
    // });
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
