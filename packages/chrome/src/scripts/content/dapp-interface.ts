import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';

export interface WalletCapabilities {
  // Metadata
  name: string;
  connected: boolean;
  connecting: boolean;
  // Connection Management
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  // DappInterfaces
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
    this.name = '';
    this.connected = false;
    this.connecting = false;
  }

  async connect(): Promise<void> {
    return await Promise.resolve(undefined);
  }

  async disconnect(): Promise<void> {
    return await Promise.resolve(undefined);
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
