import {
  InvalidPortMessageDataError,
  PortMessageNotAJsonStringError,
} from './errors';
import { CallFuncData } from './types';
import { isDev } from '../../utils/env';

export function processPortMessage(input: unknown): CallFuncData {
  if (typeof input !== 'string') {
    throw new PortMessageNotAJsonStringError();
  }
  let inputParams;
  try {
    inputParams = JSON.parse(input);
  } catch {
    throw new PortMessageNotAJsonStringError();
  }

  function checkStructure(result: Record<string, any>) {
    if (typeof result !== 'object')
      throw new InvalidPortMessageDataError('not a object');
    if (typeof result.id !== 'string')
      throw new InvalidPortMessageDataError('id should be string');
    if (/^\w+(\.\w+)?]$/.test(result.funcName))
      throw new InvalidPortMessageDataError(
        'funcName should follow the naming, eg. serviceA.funcB'
      );
    if (!Object.prototype.hasOwnProperty.call(result, 'payload'))
      throw new InvalidPortMessageDataError('payload is required');
  }
  function transformToCallFuncData(params: {
    id: string;
    funcName: string;
    payload: any;
  }) {
    let [service, func] = params.funcName.split('.');
    // if funcName be like just `func`, means called root func
    if (!func) {
      func = service;
      service = 'root';
    }
    return {
      id: params.id,
      service: service,
      func: func,
      payload: params.payload,
    };
  }

  checkStructure(inputParams);
  return transformToCallFuncData(inputParams);
}

export function log(message: string, details: any, devOnly = true) {
  if (devOnly && !isDev) return;
  console.debug('[api proxy]', message, details);
}
