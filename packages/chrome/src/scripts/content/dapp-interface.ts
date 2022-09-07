import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { PortName } from '../shared';

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
  chromePort: chrome.runtime.Port;

  constructor() {
    this.name = '';
    this.connected = false;
    this.connecting = false;

    this.chromePort = chrome.runtime.connect({
      name: PortName.SUIET_CONTENT_BACKGROUND,
    });
    this.setupMessageListener(this.chromePort);
  }

  setupMessageListener(port: chrome.runtime.Port) {
    port.onMessage.addListener(function (msg) {
      if (msg.question === "Who's there?") {
        port.postMessage({ answer: 'Madame' });
        console.log('interface answer', 'Madame');
      }
    });
  }

  async connect(): Promise<void> {
    this.chromePort.postMessage({ joke: 'Knock knock' });
    console.log('interface plays a joke', 'Knock knock');
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
