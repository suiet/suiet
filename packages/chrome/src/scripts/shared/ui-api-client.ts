import { BackgroundResData, PortName, reqData, WindowMsgData } from './index';
import {
  filter,
  fromEventPattern,
  lastValueFrom,
  Observable,
  take,
} from 'rxjs';

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
      (data) => data
    );
  }

  async callFunc<Req, Res>(funcName: string, payload: Req): Promise<Res> {
    const reqParams = reqData(funcName, payload);
    this.port.postMessage(JSON.stringify(reqParams));
    const result = await lastValueFrom(
      this.portObservable.pipe(
        filter((data) => data.id === reqParams.id),
        take(1)
      )
    );
    if (result.error) {
      throw new Error(result.error);
    }
    return result.data;
  }
}
