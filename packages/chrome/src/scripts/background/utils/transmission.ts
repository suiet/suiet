import {
  InvalidPortMessageDataError,
  PortMessageNotObjectError,
} from '../errors';
import { CallFuncData, CallFuncOption } from '../../shared';

export function processPortMessage(input: unknown): CallFuncData {
  if (input === null || typeof input !== 'object') {
    throw new PortMessageNotObjectError();
  }
  let inputParams;
  try {
    inputParams = input;
  } catch {
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
    if (!Object.prototype.hasOwnProperty.call(result, 'payload'))
      throw new InvalidPortMessageDataError('payload is required');
  }
  function transformToCallFuncData(params: {
    id: string;
    funcName: string;
    payload: any;
    options?: CallFuncOption;
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
      options: params.options,
    };
  }

  checkStructure(inputParams);
  return transformToCallFuncData(inputParams as any);
}
