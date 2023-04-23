import {
  IdentifierArray,
  IdentifierString,
  ReadonlyWalletAccount,
  StandardConnectFeature,
  StandardConnectMethod,
  StandardDisconnectFeature,
  StandardDisconnectMethod,
  StandardEventsFeature,
  StandardEventsListeners,
  StandardEventsOnMethod,
  SUI_DEVNET_CHAIN,
  SUI_TESTNET_CHAIN,
  SuiSignAndExecuteTransactionBlockFeature,
  SuiSignAndExecuteTransactionBlockInput,
  SuiSignAndExecuteTransactionBlockMethod,
  SuiSignAndExecuteTransactionBlockOutput,
  SuiSignMessageFeature,
  SuiSignMessageMethod,
  SuiSignTransactionBlockFeature,
  SuiSignTransactionBlockInput,
  SuiSignTransactionBlockMethod,
  SuiSignTransactionBlockOutput,
  Wallet,
  WalletAccount,
} from '@mysten/wallet-standard';
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
import { Buffer } from 'buffer';
import mitt, { Emitter } from 'mitt';
import { uint8arrayToArray } from '../../shared/msg-passing/uint8array-passing';
import { AccountInfo } from '../../background/types';
import { UserRejectionError } from '../../background/errors';

type WalletEventsMap = {
  [E in keyof StandardEventsListeners]: Parameters<
    StandardEventsListeners[E]
  >[0];
};

type Features = StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature &
  SuiSignAndExecuteTransactionBlockFeature &
  SuiSignTransactionBlockFeature &
  SuiSignMessageFeature;

enum Feature {
  STANDARD__CONNECT = 'standard:connect',
  STANDARD__DISCONNECT = 'standard:disconnect',
  STANDARD__EVENTS = 'standard:events',
  SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK = 'sui:signAndExecuteTransactionBlock',
  SUI__SIGN_TRANSACTION_BLOCK = 'sui:signTransactionBlock',
  SUI__SIGN_MESSAGE = 'sui:signMessage',
}

export class SuietWallet implements Wallet {
  readonly #name = 'Suiet' as const;
  readonly #version = '1.0.0' as const;
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
      [Feature.SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK]: {
        version: '1.0.0',
        signAndExecuteTransactionBlock: this.#signAndExecuteTransactionBlock,
      },
      [Feature.SUI__SIGN_TRANSACTION_BLOCK]: {
        version: '1.0.0',
        signTransactionBlock: this.#signTransactionBlock,
      },
      [Feature.SUI__SIGN_MESSAGE]: {
        version: '1.0.0',
        signMessage: this.#signMessage,
      },
    };
  }

  #on: StandardEventsOnMethod = (event, listener) => {
    this.#events.on(event, listener);
    return () => this.#events.off(event, listener);
  };

  #connect: StandardConnectMethod = async (input) => {
    const isSuccess = await this.#request('dapp.connect', {
      permissions: [Permission.SUGGEST_TX, Permission.VIEW_ACCOUNT],
    });
    if (!isSuccess) {
      throw new UserRejectionError();
    }

    // after connection permission approved
    const [account] = await this.#getAccounts();
    const networkId = await this.#getActiveNetwork();
    const chain = `sui:${networkId}`;
    if (
      this.#activeAccount &&
      this.#activeAccount.address === account.address
    ) {
      return { accounts: this.accounts };
    }

    // remove prefix '00' of publicKey which is required by sui
    const pkWithoutPrefix = account.publicKey.slice(2);
    this.#activeAccount = new ReadonlyWalletAccount({
      address: account.address,
      publicKey: Buffer.from(pkWithoutPrefix, 'hex'),
      chains: [chain as IdentifierString],
      features: [
        Feature.STANDARD__CONNECT,
        Feature.SUI__SIGN_AND_EXECUTE_TRANSACTION_BLOCK,
        Feature.SUI__SIGN_TRANSACTION_BLOCK,
        Feature.SUI__SIGN_MESSAGE,
      ],
    });
    this.#events.emit('change', { accounts: this.accounts });
    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    this.#activeAccount = null;
    this.#events.all.clear();
  };

  #signTransactionBlock: SuiSignTransactionBlockMethod = async (input) => {
    const funcName = 'dapp.signTransactionBlock';
    return await this.#request<
      {
        transactionBlock: string;
        account: WalletAccount;
        chain: string;
      },
      SuiSignTransactionBlockOutput
    >(funcName, {
      ...input,
      transactionBlock: input.transactionBlock.serialize(),
    });
  };

  #signAndExecuteTransactionBlock: SuiSignAndExecuteTransactionBlockMethod =
    async (input) => {
      const funcName = 'dapp.signAndExecuteTransactionBlock';
      return await this.#request<
        {
          transactionBlock: string;
          account: WalletAccount;
          chain: string;
        },
        SuiSignAndExecuteTransactionBlockOutput
      >(funcName, {
        ...input,
        transactionBlock: input.transactionBlock.serialize(),
      });
    };

  #signMessage: SuiSignMessageMethod = async (input) => {
    const funcName = 'dapp.signMessage';
    const encapInput = {
      ...input,
      message: uint8arrayToArray(input.message),
    };
    return await this.#request<
      {
        message: number[];
        account: WalletAccount;
      },
      Promise<{
        messageBytes: string;
        signature: string;
      }>
    >(funcName, encapInput);
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
      // console.error(suietSay(`${func} failed`), errMsg);
      throw new Error(errMsg);
    }
  }

  #checkDataIsNull(resData: ResData, func: string) {
    if (resData.data === null) {
      const errMsg = 'Response data is null';
      // console.error(suietSay(`${func} failed`), errMsg);
      throw new Error(errMsg);
    }
  }
}
