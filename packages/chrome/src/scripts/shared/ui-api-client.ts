import { BackgroundResData, CallFuncOption, PortName, reqData } from './index';
import {
  filter,
  fromEventPattern,
  lastValueFrom,
  Observable,
  take,
} from 'rxjs';
import { isDev } from '../../utils/env';
import { ErrorCode } from '../background/errors';
import mitt, { Emitter } from 'mitt';
import errorToString from './errorToString';
import Port, { IPort } from '../background/utils/Port';
import KeepAliveConnection from '../background/connections/KeepAliveConnection';

function log(message: string, details?: any, devOnly = true) {
  if (devOnly && !isDev) return;
  console.log('[api client]', message, details);
}

export interface ApiClientEventListeners {
  authExpired: (properties: undefined) => void;
}
export type ApiClientEvent = keyof ApiClientEventListeners;
export type ApiClientEventsMap = {
  [E in keyof ApiClientEventListeners]: Parameters<
    ApiClientEventListeners[E]
  >[0];
};

export class BackgroundApiClient {
  private port: Port;
  private portObservable: Observable<BackgroundResData>;
  private readonly events: Emitter<ApiClientEventsMap>;

  constructor() {
    this.events = mitt();
    this.connect();

    // maintain a connection to the background script
    const keepAlive = new KeepAliveConnection();
    keepAlive.connect();
  }

  private connect() {
    this.port = new Port(
      {
        name: PortName.SUIET_UI_BACKGROUND,
      },
      {
        onConnect: (port) => {
          this.initPortObservable(port);
        },
      }
    );
  }

  private initPortObservable(port: IPort) {
    this.portObservable = fromEventPattern(
      (h) => port.onMessage.addListener(h),
      (h) => port.onMessage.removeListener(h),
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
    if (!this.port.connected) {
      throw new Error('[api client] port is disconnected');
    }
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
      if (result.error.code === ErrorCode.NO_AUTH) {
        this.events.emit('authExpired');
      }
      throw new Error(errorToString(result.error));
    }
    return result.data;
  }

  on<E extends ApiClientEvent>(event: E, listener: ApiClientEventListeners[E]) {
    this.events.on(event, listener);
    return () => this.events.off(event, listener);
  }
}
