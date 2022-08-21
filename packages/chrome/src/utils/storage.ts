import {Storage} from "@suiet/core";
import {has} from 'lodash-es';

// https://developer.chrome.com/docs/extensions/reference/storage/
export class ChromeStorage implements Storage {
  constructor() {
    if (!chrome || !has(chrome, 'storage')) {
      throw new Error('Storage must run in chrome extension env with chrome\'s API');
    }
  }
  get(key: string): Promise<string> {
    return chrome.storage.managed.get(key).then(data => data[key]);
  }
  getSync(key: string): string {
    throw new Error('not support this API, please use async version');
  }
  remove(key: string): Promise<void> {
    return chrome.storage.managed.remove(key);
  }
  removeSync(key: string): void {
    throw new Error('not support this API, please use async version');
  }

  set(key: string, value: string): Promise<void> {
    return chrome.storage.managed.set({ [key]: value });
  }
  setSync(key: string, value: string): void {
    throw new Error('not support this API, please use async version');
  }
}

export default new ChromeStorage();