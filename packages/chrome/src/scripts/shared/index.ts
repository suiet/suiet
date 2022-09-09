import { v4 as uuidv4 } from 'uuid';

export enum PortName {
  SUIET_CONTENT_BACKGROUND = 'SUIET_CONTENT_BACKGROUND',
}

export interface WindowMsgData<T = any> {
  id: string;
  funcName: string;
  payload: T;
}

export enum WindowMsgTarget {
  DAPP = 'DAPP',
  SUIET_CONTENT = 'SUIET_CONTENT',
}

export function msg<T = any>(funcName: string, payload: T): WindowMsgData<T> {
  return {
    id: uuidv4(),
    funcName,
    payload,
  };
}
