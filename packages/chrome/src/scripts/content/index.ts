import { DAppInterface } from './dapp-interface';

(function () {
  Object.defineProperty(window, '__suiet__', {
    enumerable: false,
    configurable: false,
    value: new DAppInterface(),
  });
  console.log('hello from suiet content script', (window as any).__suiet__);
})();
