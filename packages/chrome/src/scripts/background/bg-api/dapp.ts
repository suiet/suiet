import { Storage } from '@suiet/core';
import { filter, lastValueFrom, race, Subject, take, tap } from 'rxjs';

interface DappMessage<T> {
  params: T;
  context: {
    origin: string;
    favicon: string;
  };
}

export interface PermResponse {
  id: string;
  status: string;
  updatedAt: string;
}

export interface PermRequest {
  id: string;
  origin: string;
  favicon: string;
  address: string;
  networkId: string;
  walletId: string;
  accountId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class DappBgApi {
  public async connect(perms: string[]): Promise<null> {
    console.log('DappBgApi params', perms);
    this.createPopupWindow(chrome.runtime.getURL('index.html'));
    return null;
  }

  createPopupWindow(url: string) {
    chrome.windows.create({
      url,
      type: 'popup',
      focused: true,
      width: 362,
      height: 573 + 30, // height including title bar, so should add 30px more
    });
  }
}
