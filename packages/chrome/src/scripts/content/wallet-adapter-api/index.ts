import { WindowMsgStream } from '../../shared/msg-passing/window-msg-stream';
import { reqData, WindowMsgTarget } from '../../shared';
import {
  MoveCallTransaction,
  SuiAddress,
  SuiTransactionResponse,
} from '@mysten/sui.js';
import { TxRequestType } from '../../background/transaction';
import { IWindowSuietApi } from '@suiet/wallet-adapter';
import { Permission } from '../../background/permission';
import {
  arrayToUint8array,
  uint8arrayToArray,
} from '../../shared/msg-passing/uint8array-passing';

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
    const encapInput = {
      message: uint8arrayToArray(input.message),
    };
    const result = await this.windowMsgStream.post(
      reqData('dapp.signMessage', encapInput)
    );
    if (result.error) return result;
    const data = {
      signature: arrayToUint8array(result.data.signature),
      signedMessage: arrayToUint8array(result.data.signedMessage),
    };
    return {
      ...result,
      data,
    };
  }

  async getPublicKey() {
    const result = await this.windowMsgStream.post(
      reqData('dapp.getPublicKey', null)
    );
    if (result.error) return result;
    return {
      ...result,
      data: arrayToUint8array(result.data),
    };
  }
}
