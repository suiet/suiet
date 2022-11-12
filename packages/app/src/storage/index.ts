import type { Storage, Wallet, Account } from '@suiet/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ReactNativeStorage implements Storage {
  async getWallets(): Promise<Wallet[]> {
    const keys = await AsyncStorage.getAllKeys();
    const keyValuePairs = await AsyncStorage.multiGet(keys.filter((key) => key.startsWith('wallet:')));
    return keyValuePairs
      .map(([, v]) => v)
      .filter(((v) => typeof v === 'string') as (v: any) => v is string)
      .map((v) => JSON.parse(v));
  }

  async getWallet(id: string): Promise<Wallet> {
    const wallet = await AsyncStorage.getItem(`wallet:${id}`);
    if (wallet === null) {
      throw new Error(`Wallet ${id} not found`);
    }
    return JSON.parse(wallet);
  }

  async addWallet(id: string, wallet: Wallet): Promise<void> {
    await AsyncStorage.setItem(`wallet:${id}`, JSON.stringify(wallet));
  }

  async updateWallet(id: string, wallet: Wallet): Promise<void> {
    await AsyncStorage.setItem(`wallet:${id}`, JSON.stringify(wallet));
  }

  async deleteWallet(id: string): Promise<void> {
    await AsyncStorage.removeItem(`wallet:${id}`);
  }

  async getAccounts(walletId: string): Promise<Account[]> {
    const wallet = await this.getWallet(walletId);
    const keyValuePairs = await AsyncStorage.multiGet(wallet.accounts.map(({ id }) => `account:${id}`));
    return keyValuePairs
      .map(([, v]) => v)
      .filter(((v) => typeof v === 'string') as (v: any) => v is string)
      .map((v) => JSON.parse(v));
  }

  async getAccount(accountId: string): Promise<Account> {
    const account = await AsyncStorage.getItem(`account:${accountId}`);
    if (account === null) {
      throw new Error(`Account ${accountId} not found`);
    }
    return JSON.parse(account);
  }

  async addAccount(walletId: string, accountId: string, account: Account): Promise<void> {
    await AsyncStorage.setItem(`account:${accountId}`, JSON.stringify(account));
  }

  async updateAccount(walletId: string, accountId: string, account: Account): Promise<void> {
    await AsyncStorage.setItem(`account:${accountId}`, JSON.stringify(account));
  }

  async deleteAccount(walletId: string, accountId: string): Promise<void> {
    const wallet = await this.getWallet(walletId);
    wallet.accounts = wallet.accounts.filter(({ id }) => id !== accountId);
    await this.updateWallet(walletId, wallet);
    await AsyncStorage.removeItem(`account:${accountId}`);
  }

  async loadMeta(): Promise<any> {
    const meta = await AsyncStorage.getItem(`meta:suiet-meta`);
    if (meta === null) {
      return null;
    }
    return JSON.parse(meta);
  }

  async saveMeta(meta: any): Promise<void> {
    if ((await AsyncStorage.getItem(`meta:suiet-meta`)) === null) {
      await AsyncStorage.setItem(`meta:suiet-meta`, JSON.stringify(meta));
    } else {
      await AsyncStorage.mergeItem(`meta:suiet-meta`, JSON.stringify(meta));
    }
  }

  async clearMeta(): Promise<void> {
    await AsyncStorage.removeItem(`meta:suiet-meta`);
  }

  async reset(): Promise<void> {
    await AsyncStorage.clear();
  }
}

export function getStorage(): Storage {
  return new ReactNativeStorage();
}
