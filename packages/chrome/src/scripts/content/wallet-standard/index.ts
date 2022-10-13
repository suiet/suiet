import {
  SUI_CHAINS,
  SUI_DEVNET_CHAIN,
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
} from '@mysten/wallet-standard';
import { LOGO_BASE64 } from '../constants/logo';
import { WindowMsgStream } from '../../shared/msg-passing/window-msg-stream';
import { reqData, ResData, suietSay, WindowMsgTarget } from '../../shared';
import { Permission } from '../../background/permission';
import { AccountInfo } from '../../background/bg-api/dapp';
import { Buffer } from 'buffer';
import { ConnectMethod } from '@wallet-standard/features';
import mitt, { Emitter } from 'mitt';

type WalletEventsMap = {
  [E in keyof EventsListeners]: Parameters<EventsListeners[E]>[0];
};

type Features = ConnectFeature &
  DisconnectFeature &
  EventsFeature &
  SuiSignAndExecuteTransactionFeature;

enum Feature {
  STANDARD__CONNECT = 'standard:connect',
  STANDARD__DISCONNECT = 'standard:disconnect',
  STANDARD__EVENTS = 'standard:events',
  SUI__SIGN_AND_EXECUTE_TRANSACTION = 'sui:signAndExecuteTransaction',
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
    return [SUI_DEVNET_CHAIN] as IdentifierArray;
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
        await this.#request('dapp.connect', {
          permissions: [Permission.SUGGEST_TX, Permission.VIEW_ACCOUNT],
        });
        this.#connectStatus = ConnectStatus.CONNECTED;
      } catch (e) {
        this.#connectStatus = ConnectStatus.DISCONNECTED;
        throw e;
      }
    }

    // after connection permission approved
    const [account] = await this.#getAccounts();
    if (
      this.#activeAccount &&
      this.#activeAccount.address === account.address
    ) {
      return { accounts: this.accounts };
    }
    this.#activeAccount = new ReadonlyWalletAccount({
      address: account.address,
      publicKey: Buffer.from(account.publicKey, 'base64'),
      chains: SUI_CHAINS,
      features: [
        Feature.STANDARD__CONNECT,
        Feature.SUI__SIGN_AND_EXECUTE_TRANSACTION,
      ],
    });
    this.#events.emit('change', { accounts: this.accounts });
    return { accounts: this.accounts };
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

  async #getAccounts() {
    const funcName = 'dapp.getAccountsInfo';
    return await this.#request<null, AccountInfo[]>(funcName, null);
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
