import {
  SUI_CHAINS,
  SUI_DEVNET_CHAIN,
  SUI_TESTNET_CHAIN,
  type EventsFeature,
  type ConnectFeature,
  type IdentifierArray,
  type SuiSignAndExecuteTransactionFeature,
  type SuiSignAndExecuteTransactionInput,
  type SuiSignAndExecuteTransactionMethod,
  type SuiSignAndExecuteTransactionOutput,
  type Wallet,
  type EventsListeners,
  type EventsOnMethod,
  DisconnectFeature,
  DisconnectMethod,
  ReadonlyWalletAccount,
  WalletAccount,
} from '@mysten/wallet-standard';
import type {
  ExpSignMessageFeature,
  ExpSignMessageInput,
  ExpSignMessageMethod,
} from '@suiet/wallet-kit';
import { LOGO_BASE64 } from '../constants/logo';
import { WindowMsgStream } from '../../shared/msg-passing/window-msg-stream';
import {
  BackendEventId,
  reqData,
  ResData,
  suietSay,
  WindowMsgTarget,
} from '../../shared';
import { Permission } from '../../background/permission';
import { AccountInfo } from '../../background/bg-api/dapp';
import { Buffer } from 'buffer';
import { ConnectMethod } from '@wallet-standard/features';
import mitt, { Emitter } from 'mitt';
import {
  arrayToUint8array,
  uint8arrayToArray,
} from '../../shared/msg-passing/uint8array-passing';

type WalletEventsMap = {
  [E in keyof EventsListeners]: Parameters<EventsListeners[E]>[0];
};

type Features = ConnectFeature &
  DisconnectFeature &
  EventsFeature &
  SuiSignAndExecuteTransactionFeature &
  ExpSignMessageFeature;

enum Feature {
  STANDARD__CONNECT = 'standard:connect',
  STANDARD__DISCONNECT = 'standard:disconnect',
  STANDARD__EVENTS = 'standard:events',
  SUI__SIGN_AND_EXECUTE_TRANSACTION = 'sui:signAndExecuteTransaction',
  EXP__SIGN_MESSAGE = 'exp:signMessage',
}

enum ConnectStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
}

export class SuietWallet implements Wallet {
  readonly #name = 'Suiet' as const;
  readonly #version = '1.0.0' as const;
  #connectStatus: ConnectStatus = ConnectStatus.DISCONNECTED;
  #activeAccount: ReadonlyWalletAccount | null = null;
  #winMsgStream: WindowMsgStream;
  #events: Emitter<WalletEventsMap>;

  constructor() {
    this.#events = mitt();
    this.#winMsgStream = new WindowMsgStream(
      WindowMsgTarget.DAPP,
      WindowMsgTarget.SUIET_CONTENT
    );
    this.#subscribeEventFromBackend(this.#winMsgStream);
  }

  get version() {
    return this.#version;
  }

  get name() {
    return this.#name;
  }

  get icon() {
    return LOGO_BASE64 as any;
  }

  // Return the Sui chains that your wallet supports.
  get chains() {
    return [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN] as IdentifierArray;
  }

  get accounts() {
    return this.#activeAccount ? [this.#activeAccount] : [];
  }

  get features(): Features {
    return {
      [Feature.STANDARD__CONNECT]: {
        version: '1.0.0',
        connect: this.#connect,
      },
      [Feature.STANDARD__DISCONNECT]: {
        version: '1.0.0',
        disconnect: this.#disconnect,
      },
      [Feature.STANDARD__EVENTS]: {
        version: '1.0.0',
        on: this.#on,
      },
      [Feature.SUI__SIGN_AND_EXECUTE_TRANSACTION]: {
        version: '1.0.0',
        signAndExecuteTransaction: this.#signAndExecuteTransaction,
      },
      [Feature.EXP__SIGN_MESSAGE]: {
        version: '1.0.0',
        signMessage: this.#signMessage,
      },
    };
  }

  #on: EventsOnMethod = (event, listener) => {
    this.#events.on(event, listener);
    return () => this.#events.off(event, listener);
  };

  #connect: ConnectMethod = async (input) => {
    if (this.#connectStatus === ConnectStatus.CONNECTING) {
      throw new Error(
        'Existed connection is pending, please do not make duplicated calls'
      );
    }
    if (this.#connectStatus === ConnectStatus.DISCONNECTED) {
      this.#connectStatus = ConnectStatus.CONNECTING;
      try {
        const isSuccess = await this.#request('dapp.connect', {
          permissions: [Permission.SUGGEST_TX, Permission.VIEW_ACCOUNT],
        });
        if (!isSuccess) {
          throw new Error('User rejects approval');
        }
        this.#connectStatus = ConnectStatus.CONNECTED;
      } catch (e) {
        this.#connectStatus = ConnectStatus.DISCONNECTED;
        throw e;
      }
    }

    // after connection permission approved
    const [account] = await this.#getAccounts();
    // NOTE: hack implementation for getting current network when connected
    // Still waiting for wallet-standard's progress
    const networkId = await this.#getActiveNetwork();
    const chain = `sui:${networkId}`;
    if (
      this.#activeAccount &&
      this.#activeAccount.address === account.address
    ) {
      return { accounts: this.accounts, chains: [chain] };
    }

    // remove prefix '00' of publicKey which is required by sui
    const pkWithoutPrefix = account.publicKey.slice(2);
    this.#activeAccount = new ReadonlyWalletAccount({
      address: account.address,
      publicKey: Buffer.from(pkWithoutPrefix, 'hex'),
      chains: [SUI_DEVNET_CHAIN, SUI_TESTNET_CHAIN],
      features: [
        Feature.STANDARD__CONNECT,
        Feature.SUI__SIGN_AND_EXECUTE_TRANSACTION,
      ],
    });
    this.#events.emit('change', { accounts: this.accounts });
    return { accounts: this.accounts, chains: [chain] };
  };

  #disconnect: DisconnectMethod = async () => {
    this.#connectStatus = ConnectStatus.DISCONNECTED;
    this.#activeAccount = null;
    this.#events.all.clear();
  };

  #signAndExecuteTransaction: SuiSignAndExecuteTransactionMethod = async (
    input
  ) => {
    const funcName = 'dapp.signAndExecuteTransaction';
    return await this.#request<
      SuiSignAndExecuteTransactionInput,
      SuiSignAndExecuteTransactionOutput
    >(funcName, {
      transaction: input.transaction,
    });
  };

  #signMessage: ExpSignMessageMethod = async (input: ExpSignMessageInput) => {
    const funcName = 'dapp.signMessage';
    const encapInput = {
      ...input,
      message: uint8arrayToArray(input.message),
    };
    const res = await this.#request<
      {
        message: number[];
        account: WalletAccount;
      },
      Promise<{
        signature: number[];
        signedMessage: number[];
      }>
    >(funcName, encapInput);
    return {
      signature: arrayToUint8array(res.signature),
      signedMessage: arrayToUint8array(res.signedMessage),
    };
  };

  async #getAccounts() {
    const funcName = 'dapp.getAccountsInfo';
    return await this.#request<null, AccountInfo[]>(funcName, null);
  }

  async #getActiveNetwork() {
    const funcName = 'dapp.getActiveNetwork';
    return await this.#request<null, string>(funcName, null);
  }

  async #request<Req = any, Res = any>(
    funcName: string,
    payload: Req,
    options: {
      nullable?: boolean;
    } = {
      nullable: false,
    }
  ): Promise<Res> {
    const result = await this.#winMsgStream.post(reqData(funcName, payload));
    this.#checkError(result, funcName);
    if (!options?.nullable) {
      this.#checkDataIsNull(result, funcName);
    }
    return result.data as Res;
  }

  #subscribeEventFromBackend(winMsgStream: WindowMsgStream) {
    const availableEventIds = [BackendEventId.NETWORK_SWITCH];
    return winMsgStream.subscribe((windMsg) => {
      if (!availableEventIds.includes(windMsg?.payload?.id)) return;
      if (windMsg.payload.id === BackendEventId.NETWORK_SWITCH) {
        return this.#handleNetworkSwitch(windMsg.payload);
      }
    });
  }

  #handleNetworkSwitch(payload: { id: string; networkId: string }) {
    const { networkId } = payload;
    if (!networkId) return;
    this.#events.emit('change', {
      chains: [`sui:${networkId}`],
    });
  }

  #checkError(resData: ResData, func: string) {
    if (resData.error) {
      const errMsg = resData.error?.msg ?? 'Unknown Error';
      console.error(suietSay(`${func} failed`), errMsg);
      throw new Error(errMsg);
    }
  }

  #checkDataIsNull(resData: ResData, func: string) {
    if (resData.data === null) {
      const errMsg = 'Response data is null';
      console.error(suietSay(`${func} failed`), errMsg);
      throw new Error(errMsg);
    }
  }
}
