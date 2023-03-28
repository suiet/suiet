// This file will be compiled by vite-rollup individually, see configuration in vite.config.ts
// dynamically load by browser getURL in the content script of extension

import { Buffer } from 'buffer';
import { registerWallet } from '@mysten/wallet-standard';
import { SuietWallet } from './wallet-standard';

function injectPolyfill(window: Window) {
  // @ts-expect-error
  window.Buffer = Buffer;
}

injectPolyfill(window);

// new standard for wallet adapters
registerWallet(new SuietWallet());
