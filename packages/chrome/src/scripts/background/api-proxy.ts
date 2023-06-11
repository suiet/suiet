import {
  AccountApi,
  AuthApi,
  getStorage,
  IStorage,
  NetworkApi,
  TransactionApi,
  WalletApi,
} from '@suiet/core';
import { fromEventPattern } from 'rxjs';
import { CallFuncOption, PortName, resData } from '../shared';
import { normalizeMessageToParams } from './utils/transmission';
import { log, logError } from './utils/log';
import { cloneDeep, has } from 'lodash-es';
import { DappBgApi } from './bg-api/dapp';
import { BizError, ErrorCode, NoAuthError } from './errors';
import { IPort } from './utils/Port';

interface RootApi {
  clearToken: () => Promise<void>;
  resetAppData: (token: string) => Promise<void>;
  validateToken: (token: string) => Promise<void>;
}

export interface BackgroundApiContext {
  storage: IStorage;
}

/**
 * Proxy the port message function call to the actual method
 */
export class BackgroundApiProxy {
  protected storage: IStorage;
  readonly #ports: IPort[] = [];
  #serviceProxyCache: Record<string, any>;

  #root: RootApi;
  #wallet: WalletApi;
  #account: AccountApi;
  #auth: AuthApi;
  #txn: TransactionApi;
  #network: NetworkApi;
  #dapp: DappBgApi;

  constructor() {
    this.#registerServices();
  }

  /**
   * listen to messages from a chrome port,
   * proxy the function call to the actual method
   * @param port
   */
  public listen(port: IPort) {
    log('set up listener for port: ', port.name);

    this.#ports.push(port);
    // log('this.ports after adding', this.ports);
    const subscription = this.#setUpFuncCallProxy(port);

    // Triggers when:
    // - No listeners at the other end
    // - The tab that contains the port is unloaded (for example, if the tab is navigated).
    // - The frame where connect() was called is unloaded.
    // - All frames that received the port (via runtime.onConnect) are unloaded.
    // - runtime.Port.disconnect() is called by the other end.
    port.onDisconnect.addListener(() => {
      subscription.unsubscribe();
      const index = this.#ports.findIndex((p) => p === port); // find port by instance
      log(`unsubscribe port ${port.name} and index: ${index}`);
      this.#ports.splice(index, 1);
    });
  }

  get #context(): BackgroundApiContext {
    return {
      storage: this.storage,
    };
  }

  /**
   * register services for clients to call
   * @private
   */
  #registerServices() {
    this.#serviceProxyCache = {};
    this.storage = this.#getStorage();

    this.#wallet = this.#registerProxyService<WalletApi>(
      new WalletApi(this.storage),
      'wallet'
    );
    this.#account = this.#registerProxyService<AccountApi>(
      new AccountApi(this.storage),
      'account'
    );
    this.#auth = this.#registerProxyService<AuthApi>(
      new AuthApi(this.storage),
      'auth'
    );
    this.#txn = this.#registerProxyService<TransactionApi>(
      new TransactionApi(this.storage),
      'txn'
    );
    this.#network = this.#registerProxyService<NetworkApi>(
      new NetworkApi(),
      'network'
    );
    this.#dapp = this.#registerProxyService<DappBgApi>(
      new DappBgApi(
        this.#context,
        this.#txn,
        this.#network,
        this.#auth,
        this.#account
      ),
      'dapp'
    );
    this.#root = this.#registerProxyService<RootApi>(
      ((ctx: any) => ({
        clearToken: async () => {
          const meta = await this.storage.loadMeta();
          if (!meta) return;

          try {
            await this.storage.clearMeta();
          } catch (e) {
            console.error(e);
            throw new Error('Clear meta failed');
          }
        },
        resetAppData: async () => {
          await this.storage.reset();
          ctx.#registerServices();
        },
      }))(this),
      'root'
    );
    log('initServices finished', this.#serviceProxyCache);
  }

  /**
   * set up a server-like listener to handle the function call via the port
   * @param port
   * @private
   */
  #setUpFuncCallProxy(port: IPort) {
    // create msg source from chrome port to be subscribed
    const portObservable = fromEventPattern(
      (h) => port.onMessage.addListener(h),
      (h) => port.onMessage.removeListener(h),
      (msg) => normalizeMessageToParams(msg)
    );

    // subscribe to the port msg source
    // return the unsubscribe function
    return portObservable.subscribe(async (callFuncData) => {
      // proxy func-call msg to real method
      const { id, service, func, payload, options } = callFuncData;
      let error: null | { code: number; msg: string } = null;
      let data: null | any = null;
      const reqMeta = `id: ${id}, method: ${service}.${func}`;
      log(`request(${reqMeta})`, cloneDeep(callFuncData));
      try {
        const startTime = Date.now();
        data = await this.#callBackgroundMethod(
          port.name,
          service,
          func,
          payload,
          options
        );
        const duration = Date.now() - startTime;
        log(`respond(${reqMeta}) succeeded (${duration}ms)`, data);
      } catch (e) {
        error = this.#detectError(e); // generate error response
        log(`respond(${reqMeta}) failed`, error);

        // ignore logs like authentication
        if (
          e instanceof NoAuthError ||
          (e as BizError)?.code === ErrorCode.NO_AUTH // compatible with core's error
        ) {
          // ignore logs
        } else {
          logError(error.msg);
        }
      }

      try {
        // send response to the client via port
        port.postMessage(resData(id, error, data));
      } catch (e) {
        log(`postMessage(${reqMeta}) failed`, { e, data });

        if (e instanceof Error) {
          if (/disconnected/i.test(e.message)) {
            log(`port (${port.name}) is closed`, { e });
            return;
          }
        }
        logError(e);
      }
    });
  }

  #detectError(e: any) {
    if (e instanceof BizError || has(e, 'code')) {
      return {
        code: e.code,
        msg: e.toString(),
        details: e.details,
      };
    }
    if (e?.name === 'RpcError') {
      return {
        code: ErrorCode.RPC_ERROR,
        msg: e.toString(),
        details: e.details,
      };
    }
    // 502 Bad gateway, response is html
    if (e.message && /DOCTYPE/.test(e.message)) {
      return {
        code: ErrorCode.RPC_ERROR,
        msg: 'Sui network is under maintenance now, please retry later',
      };
    }
    return {
      code: ErrorCode.UNKNOWN,
      msg: e.message,
    };
  }

  /**
   * register methods of all the services into the cache
   * setup service object proxy to check the method if existed
   * @param service
   * @param svcName
   * @private
   */
  #registerProxyService<T = any>(service: Object, svcName: string) {
    // readonly service proxy
    const serviceProxy = new Proxy(service, {
      get: (target, prop) => {
        return (target as any)[prop];
      },
    });
    if (!has(this.#serviceProxyCache, svcName)) {
      // register service into the service cache
      this.#serviceProxyCache[svcName] = serviceProxy;
    }
    return serviceProxy as T;
  }

  /**
   * Call method of the services
   * @param portName
   * @param serviceName
   * @param funcName
   * @param payload
   * @param options
   * @private
   */
  async #callBackgroundMethod<T = any>(
    portName: string,
    serviceName: string,
    funcName: string,
    payload: any,
    options?: CallFuncOption
  ) {
    if (!has(this.#serviceProxyCache, serviceName)) {
      throw new Error(`service (${serviceName}) not exist`);
    }
    const service = this.#serviceProxyCache[serviceName];
    if (typeof service[funcName] !== 'function') {
      throw new Error(
        `method ${funcName} not exist in service (${serviceName})`
      );
    }
    const params = payload;

    // inject token to params only for Suiet UI
    if (
      portName === PortName.SUIET_UI_BACKGROUND &&
      options &&
      options?.withAuth === true
    ) {
      try {
        // inject token to payload
        const token = this.#auth.getToken();
        Object.assign(params, { token });
        // FIXME: hack check for context params if the call is from wallet ext
        // inject token to context
        if (params.context) {
          Object.assign(params.context, { token });
        }
      } catch {
        throw new NoAuthError();
      }
    }
    return await (service[funcName](params) as Promise<T>);
  }

  /**
   * get storage instance based on the runtime platform
   * @private
   */
  #getStorage() {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    return storage;
  }
}
