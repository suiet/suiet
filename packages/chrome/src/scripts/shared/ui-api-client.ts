import { BackgroundResData, CallFuncOption, PortName, reqData } from './index';
import {
  filter,
  fromEventPattern,
  lastValueFrom,
  Observable,
  take,
} from 'rxjs';

export function errorToString(
  error: Record<string, any> | Error | null | undefined
) {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    typeof error?.code === 'number' &&
    typeof error?.msg === 'string'
  ) {
    return `${error.msg} (code: ${error.code})`;
  }
  if (error === null) return 'null';
  return 'unknown error';
}

export class BackgroundApiClient {
  private readonly port: chrome.runtime.Port;
  private readonly portObservable: Observable<BackgroundResData>;

  constructor() {
    this.port = chrome.runtime.connect({
      name: PortName.SUIET_UI_BACKGROUND,
    });
    this.portObservable = fromEventPattern(
      (h) => this.port.onMessage.addListener(h),
      (h) => this.port.onMessage.removeListener(h),
      (data) => {
        try {
          return data;
        } catch (e) {
          throw new Error('cannot parse res data');
        }
      }
    );
  }

  async callFunc<Req, Res>(
    funcName: string,
    payload: Req,
    options?: CallFuncOption
  ): Promise<Res> {
    const reqParams = reqData(
      funcName,
      typeof payload === 'undefined' ? null : payload,
      options
    );
    this.port.postMessage(reqParams);
    const result = await lastValueFrom(
      this.portObservable.pipe(
        filter((data) => data.id === reqParams.id),
        take(1)
      )
    );
    if (result.error) {
      throw new Error(errorToString(result.error));
    }
    return result.data;
  }
}
