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
  private readonly targetOrigin: string;

  constructor(
    source: WindowMsgTarget,
    target: WindowMsgTarget,
    targetOrigin: string
  ) {
    if (source === target) {
      throw new Error(
        '[WindowMessageStream] source and target must be different'
      );
    }
    this.source = source;
    this.target = target;
    this.targetOrigin = targetOrigin;

    this.msgObservable = fromEvent<MessageEvent<WindowMsg>>(
      window,
      'message'
    ).pipe(
      filter((message) => {
        return (
          message.origin === this.targetOrigin &&
          message.data?.target === this.source
        );
      }),
      map((event) => event.data)
    );
  }

  public async post<T = any>(
    payload: WindowMsgDataBase & { [key: string]: any }
  ): Promise<ResData<T>> {
    const msg = {
      target: this.target,
      payload,
    };
    // console.log('[WindowMsgStream] postMessage', msg);

    // NOTE: We cannot specify the target origin for the content script, so have to broadcast to all windows
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#using_window.postmessage_in_extensions_non-standard
    // TODO: Can we prevent the message being blocked by other extensions?
    window.postMessage(msg, this.targetOrigin);

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
    return this.msgObservable.subscribe(func);
  }
}
