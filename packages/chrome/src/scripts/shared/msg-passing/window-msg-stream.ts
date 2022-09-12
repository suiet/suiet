import { filter, fromEvent, lastValueFrom, map, take } from 'rxjs';

import type { Observable } from 'rxjs';
import {
  WindowMsgTarget,
  WindowMsg,
  ResData,
  WindowMsgDataBase,
} from '../index';

export class WindowMsgStream {
  public readonly msgObservable: Observable<WindowMsg>;
  private readonly source: WindowMsgTarget;
  private readonly target: WindowMsgTarget;

  constructor(source: WindowMsgTarget, target: WindowMsgTarget) {
    if (source === target) {
      throw new Error(
        '[WindowMessageStream] source and target must be different'
      );
    }
    this.source = source;
    this.target = target;
    this.msgObservable = fromEvent<MessageEvent<WindowMsg>>(
      window,
      'message'
    ).pipe(
      filter(
        (message) =>
          message.source === window && message.data?.target === this.source
      ),
      map((event) => event.data)
    );
  }

  public async post(
    payload: WindowMsgDataBase & { [key: string]: any }
  ): Promise<ResData> {
    const msg = {
      target: this.target,
      payload,
    };
    console.log('[WindowMsgStream] postMessage', msg);
    window.postMessage(msg);
    return await lastValueFrom(
      this.msgObservable.pipe(
        filter((windowMsg) => {
          return windowMsg.payload.id === payload.id;
        }),
        map((windowMsg) => windowMsg.payload),
        take(1)
      )
    );
  }

  public subscribe(func: (data: WindowMsg) => void) {
    this.msgObservable.subscribe(func);
  }
}
