import { v4 as uuidv4 } from 'uuid';

export enum PortName {
  SUIET_UI_BACKGROUND = 'SUIET_UI_BACKGROUND',
  SUIET_CONTENT_BACKGROUND = 'SUIET_CONTENT_BACKGROUND',
  SUIET_KEEP_ALIVE = 'SUIET_KEEP_ALIVE',
}

export interface WindowMsg<T = any> {
  target: WindowMsgTarget;
  payload: T;
}

export interface WindowMsgDataBase {
  id: string;
}

export interface CallFuncData {
  id: string;
  service: string;
  func: string;
  payload: any;
  options?: CallFuncOption;
}

export type CallFuncOption = {
  withAuth?: boolean;
};

export type WindowMsgReqData<T = any> = WindowMsgDataBase & {
  funcName: string;
  payload: T;
  options?: CallFuncOption;
};

export interface ResData<T = any> {
  id: string;
  error: null | {
    code: string;
    msg: string;
  };
  data: null | T;
}

export interface BackgroundResData<T = any> {
  id: string;
  error: null | { code: number; msg: string };
  data: null | T;
}

export enum WindowMsgTarget {
  DAPP = 'DAPP_WITH_SUIET',
  SUIET_CONTENT = 'SUIET_CONTENT',
}

export enum BackendEventId {
  NETWORK_SWITCH = 'SUIET_NETWORK_SWITCH',
}

export function reqData<T = any>(
  funcName: string,
  payload: T,
  options?: CallFuncOption
): WindowMsgReqData<T> {
  return {
    id: uuidv4(),
    funcName,
    payload,
    options,
  };
}

export function resData<T = any>(
  id: string,
  error: null | { code: number; msg: string },
  data: null | any
): BackgroundResData<T> {
  return {
    id,
    error,
    data,
  };
}

export function suietSay(msg: string) {
  return `[SUIET_WALLET]: ${msg}`;
}
