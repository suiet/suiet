import { WindowMsg } from '../../shared';

function has(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// validate funcName which should be wallet adapter functions
const whileList = [
  'dapp.connect',
  'dapp.signTransactionBlock',
  'dapp.signAndExecuteTransactionBlock',
  'dapp.signMessage',
  'dapp.getAccountsInfo',
  'dapp.getActiveNetwork',
];

/**
 * Only allow wallet adapter functions to get passed
 * @param msg
 */
export default function validateExternalWindowMsg(msg: WindowMsg): void {
  // validate msg structure
  if (
    !has(msg, 'payload') ||
    !has(msg.payload, 'id') ||
    !has(msg.payload, 'funcName')
  ) {
    throw new Error('invalid msg structure');
  }
  if (!whileList.includes(msg.payload.funcName)) {
    throw new Error(`funcName "${msg.payload.funcName}" is not allowed`);
  }
  return;
}
