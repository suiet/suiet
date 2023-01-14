import { isExtBackgroundServiceWork } from './utils/platform';
import { Buffer } from 'buffer';
import XhrShim from 'xhr-shim';

const serviceWorkerScope: any = self;
if (isExtBackgroundServiceWork()) {
  // shim XHR for service worker env
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const { default: XhrShim } = require('xhr-shim');
  serviceWorkerScope.XMLHttpRequest = XhrShim;
  serviceWorkerScope.Buffer = Buffer;
}

export { validateToken } from './utils/token';
export type { TxnHistoryEntry } from './storage/types';
export * from './storage/Storage';
export * from './api/wallet';
export * from './api/account';
export * from './api/auth';
export * from './api/network';
export * from './api/txn';
export { validateWord, BIP32_ALL_WORDLISTS, BIP32_EN_WORDLIST } from './crypto';
