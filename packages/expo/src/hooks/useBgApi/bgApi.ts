import { useNavigation } from '@react-navigation/native';
import type { AccountInfo } from '@suiet/chrome-ext/src/scripts/background/types';
import Toast, { ToastProps } from 'react-native-toast-message';
import type { IdentifierString, WalletAccount } from '@mysten/wallet-standard';
import {
  ExecuteTransactionRequestType,
  SignedTransaction,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
  TransactionBlock,
} from '@mysten/sui.js';
import { FeatureFlagNetwork } from '@/utils/api';
import { TxProvider } from '@suiet/core/src/provider';
import { Vault } from '@suiet/core/src/vault/Vault';
import { derivationHdPath } from '@suiet/core/src/crypto';

export interface DappMessage<T> {
  params: T;
  context: DappMessageContext;
}

export interface DappMessageContext {
  origin: string;
  name: string;
  favicon: string;
}

export class DappBgApi {
  private txProvider;

  constructor(
    private navigation: ReturnType<typeof useNavigation>,
    private network: FeatureFlagNetwork,
    private networkId: string,
    private selectedWallet: string,
    private loadMnemonic: (walletAddress: string) => Promise<string>
  ) {
    this.txProvider = TxProvider.create(this.network?.full_node_url, this.network?.version_cache_timout_in_seconds);
  }

  public async connect(
    payload: DappMessage<{
      permissions: string[];
    }>
  ): Promise<boolean> {
    const { default: Toast } = await import('react-native-toast-message');

    try {
      Toast.show({
        type: 'info',
        text1: 'Connection approved',
      });
    } catch (e) {}

    return true;
  }

  public async getAccountsInfo(payload: DappMessage<{}>): Promise<AccountInfo[]> {
    return [
      {
        address: this.selectedWallet,
        publicKey: '',
      },
    ];
  }

  public async getActiveNetwork(payload: DappMessage<{}>): Promise<string> {
    return this.networkId;
  }

  public async signAndExecuteTransactionBlock(
    payload: DappMessage<{
      transactionBlock: string;
      account: WalletAccount;
      chain: IdentifierString;
      requestType?: ExecuteTransactionRequestType;
      options?: SuiTransactionBlockResponseOptions;
    }>
  ): Promise<SuiTransactionBlockResponse> {
    return await this.txProvider.signAndExecuteTransactionBlock(
      TransactionBlock.from(payload.params.transactionBlock),
      await Vault.fromMnemonic(derivationHdPath(0), await this.loadMnemonic(this.selectedWallet)),
      payload.params.requestType,
      payload.params.options
    );
  }
}
