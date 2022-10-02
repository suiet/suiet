import XhrShim from 'xhr-shim';
import { isExtBackgroundServiceWork } from './utils/platform';
import { Buffer } from 'buffer';

const serviceWorkerScope: any = self;
if (isExtBackgroundServiceWork()) {
  // shim XHR for service worker env
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
