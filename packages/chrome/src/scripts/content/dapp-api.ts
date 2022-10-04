// This file will be compiled by vite-rollup individually, see configuration in vite.config.ts
// dynamically load by browser getURL in the content script of extension
import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { reqData, WindowMsgTarget } from '../shared';
import { WindowMsgStream } from '../shared/msg-passing/window-msg-stream';
import { TxRequestType } from '../background/transaction';
import { IWindowSuietApi, Permission } from '@suiet/wallet-adapter';
import { baseDecode, baseEncode } from 'borsh';
import { Buffer } from 'buffer';

function injectPolyfill(window: Window) {
  // @ts-expect-error
  window.Buffer = Buffer;
}

/**
 * Script to be injected in each Dapp page
 * Provide Api connected to ext's service worker with window messaging mechanism
 */
export class DAppInterface implements IWindowSuietApi {
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
    await this.windowMsgStream.post(reqData('handshake', null));
    return await this.windowMsgStream.post(
      reqData('dapp.connect', { permissions })
    );
  }

  async disconnect() {
    return await this.windowMsgStream.post(reqData('handwave', null));
  }

  // @ts-expect-error
  async hasPermissions(permissions: readonly string[]) {
    throw new Error('function not implemented yet');
  }

  // @ts-expect-error
  async requestPermissions() {
    throw new Error('function not implemented yet');
  }

  async executeMoveCall(transaction: MoveCallTransaction) {
    return await this.windowMsgStream.post(
      reqData('dapp.requestTransaction', {
        type: TxRequestType.MOVE_CALL,
        data: transaction,
      })
    );
  }

  // @ts-expect-error
  async executeSerializedMoveCall(
    transactionBytes: Uint8Array
  ): Promise<SuiTransactionResponse> {
    throw new Error('function not implemented yet');
  }

  async getAccounts() {
    return await this.windowMsgStream.post<SuiAddress[]>(
      reqData('dapp.getAccounts', null)
    );
  }

  async signMessage(input: { message: Uint8Array }) {
    const encodedInput = { message: baseEncode(input.message) };
    const result = await this.windowMsgStream.post(
      reqData('dapp.signMessage', encodedInput)
    );
    if (result.error) return result;

    const data = result.data as {
      signature: string;
      signedMessage: string;
    };
    return {
      ...result,
      data: {
        signature: baseDecode(data.signature),
        signedMessage: baseDecode(data.signedMessage),
      },
    };
  }

  async getPublicKey() {
    return await this.windowMsgStream.post(reqData('dapp.getPublicKey', null));
  }
}

injectPolyfill(window);
// mount __suiet__ object on DApp's window environment
Object.defineProperty(window, '__suiet__', {
  enumerable: false,
  configurable: false,
  value: new DAppInterface(),
});
