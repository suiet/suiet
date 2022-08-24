import {GlobalMeta, Storage, StorageAccount, StorageWallet} from "@suiet/core";
import {has} from 'lodash-es';
import {Account} from "@suiet/core/dist/storage/types";

// https://developer.chrome.com/docs/extensions/reference/storage/
export class ChromeStorage implements Storage {
  constructor() {
    if (!chrome || !has(chrome, 'storage')) {
      throw new Error('Storage must run in chrome extension env with chrome\'s API');
    }
  }

  getWallets(): Promise<StorageWallet[]> {
    throw new Error("Method not implemented.");
  }

  getWallet(id: string): Promise<StorageWallet> {
    throw new Error("Method not implemented.");
  }

  addWallet(id: string, wallet: StorageWallet): Promise<void> {
    throw new Error("Method not implemented.");
  }

  addAccount(walletId: string, accountId: string, account: StorageAccount): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteAccount(walletId: string, accountId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  loadMeta(): Promise<GlobalMeta> {
    throw new Error("Method not implemented.");
  }

  saveMeta(meta: GlobalMeta): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // }
  // get(key: string): Promise<string> {
  //   return chrome.storage.managed.get(key).then(data => data[key]);
  // }
  // getSync(key: string): string {
  //   throw new Error('not support this API, please use async version');
  // }
  // remove(key: string): Promise<void> {
  //   return chrome.storage.managed.remove(key);
  // }
  // removeSync(key: string): void {
  //   throw new Error('not support this API, please use async version');
  // }
  //
  // set(key: string, value: string): Promise<void> {
  //   return chrome.storage.managed.set({ [key]: value });
  // }
  // setSync(key: string, value: string): void {
  //   throw new Error('not support this API, please use async version');
  // }
}

export default new ChromeStorage();