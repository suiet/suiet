// Copyright © 2022, Suiet Team
import { MoveCallTransaction, SuiTransactionResponse } from '@mysten/sui.js';
import { WalletCapabilities } from '@mysten/wallet-adapter-base';
import { SuietWallet } from '@suiet/chrome-ext/src/scripts/content/dapp-api';

const ALL_PERMISSION_TYPES = ['viewAccount', 'suggestTransactions'] as const;
type AllPermissionsType = typeof ALL_PERMISSION_TYPES;
type PermissionType = AllPermissionsType[number];

interface SuiWalletWindow {
  __suiet__: SuietWallet;
}

declare const window: SuiWalletWindow;

export class SuietWalletAdapter implements WalletCapabilities {
  name = 'Suiet Wallet';
  connecting: boolean;
  connected: boolean;
  wallet: SuietWallet;

  constructor() {
    this.connected = false;
    this.connecting = false;
    this.wallet = window.__suiet__; // load global object injected by suiet extension
  }

  async connect(): Promise<void> {
    if (!this.wallet) {
      this.guideToInstallExtension();
      return;
    }
    this.connecting = true;
    try {
      await this.wallet.connect();
      const given = await this.wallet.requestPermissions();
      console.log('requestPermissions', given);
      const newLocal: readonly PermissionType[] = ['viewAccount'];
      const perms = await this.wallet.hasPermissions(newLocal);
      console.log('hasPermissions', perms);
      this.connected = true;
    } catch (err) {
      console.error(err);
    } finally {
      this.connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.wallet.disconnect();
      this.connected = false;
    }
  }

  async getAccounts(): Promise<string[]> {
    return await this.wallet.getAccounts();
  }

  async executeMoveCall(
    transaction: MoveCallTransaction
  ): Promise<SuiTransactionResponse> {
    return await this.wallet.executeMoveCall(transaction);
  }

  async executeSerializedMoveCall(
    transactionBytes: Uint8Array
  ): Promise<SuiTransactionResponse> {
    return await this.wallet.executeSerializedMoveCall(transactionBytes);
  }

  private guideToInstallExtension() {
    // TODO
    console.warn('Need to install Suiet Extension from Chrome Store first!');
  }
}
