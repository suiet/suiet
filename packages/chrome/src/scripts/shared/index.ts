import { v4 as uuidv4 } from 'uuid';

export enum PortName {
  SUIET_UI_BACKGROUND = 'SUIET_UI_BACKGROUND',
  SUIET_CONTENT_BACKGROUND = 'SUIET_CONTENT_BACKGROUND',
}

export interface WindowMsgData<T = any> {
  id: string;
  funcName: string;
  payload: T;
}

export interface BackgroundResData<T = any> {
  id: string;
  error: null | string;
  data: null | T;
}

export enum WindowMsgTarget {
  DAPP = 'DAPP',
  SUIET_CONTENT = 'SUIET_CONTENT',
}

export function reqData<T = any>(
  funcName: string,
  payload: T
): WindowMsgData<T> {
  return {
    id: uuidv4(),
    funcName,
    payload,
  };
}

export function resData<T = any>(
  id: string,
  error: null | string,
  data: null | any
): BackgroundResData<T> {
  return {
    id,
    error,
    data,
  };
}
