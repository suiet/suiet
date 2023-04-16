import {
  InvalidPortMessageDataError,
  PortMessageNotObjectError,
} from '../errors';
import { CallFuncData, CallFuncOption } from '../../shared';
import { has } from 'lodash-es';

export function normalizeMessageToParams(input: unknown): CallFuncData {
  if (input === null || typeof input !== 'object') {
    throw new PortMessageNotObjectError();
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
    if (!has(result, 'payload'))
      throw new InvalidPortMessageDataError('payload is required');
  }

  /**
   * normalize the input data to CallFuncData
   * @param params
   */
  function transformToCallFuncData(params: {
    id: string;
    funcName: string;
    payload: any;
    options?: CallFuncOption;
  }) {
    let [service, func] = params.funcName.split('.');
    // if funcName be like just `func`, meaning to call a func of root service
    if (!func) {
      func = service;
      service = 'root';
    }
    return {
      id: params.id,
      service: service,
      func: func,
      payload: params.payload,
      options: params.options,
    };
  }

  checkStructure(input);
  return transformToCallFuncData(input as any);
}
