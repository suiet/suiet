import {
  AccountApi,
  AuthApi,
  getStorage,
  NetworkApi,
  Storage,
  TransactionApi,
  WalletApi,
} from '@suiet/core';
import { fromEventPattern } from 'rxjs';
import { CallFuncOption, resData } from '../shared';
import { processPortMessage } from './utils/transmission';
import { log, logError } from './utils/log';
import { has } from 'lodash-es';
import { DappBgApi } from './bg-api/dapp';
import { BizError, ErrorCode, NoAuthError } from './errors';

interface RootApi {
  clearToken: () => Promise<void>;
  resetAppData: (token: string) => Promise<void>;
  validateToken: (token: string) => Promise<void>;
}

/**
 * Proxy the port message function call to the actual method
 */
export class BackgroundApiProxy {
  private readonly ports: chrome.runtime.Port[] = [];
  private storage: Storage;
  private serviceProxyCache: Record<string, any>;

  private root: RootApi;
  private wallet: WalletApi;
  private account: AccountApi;
  private auth: AuthApi;
  private txn: TransactionApi;
  private network: NetworkApi;
  private dapp: DappBgApi;

  constructor() {
    this.initServices();
  }

  public listen(port: chrome.runtime.Port) {
    log('set up listener for port', port);
    this.ports.push(port);
    this.setUpFuncCallProxy(port);
  }

  private initServices() {
    this.serviceProxyCache = {};
    const storage = this.getStorage();
    this.storage = storage;
    this.wallet = this.registerProxyService<WalletApi>(
      new WalletApi(storage),
      'wallet'
    );
    this.account = this.registerProxyService<AccountApi>(
      new AccountApi(storage),
      'account'
    );
    this.auth = this.registerProxyService<AuthApi>(
      new AuthApi(storage),
      'auth'
    );
    this.txn = this.registerProxyService<TransactionApi>(
      new TransactionApi(storage),
      'txn'
    );
    this.network = this.registerProxyService<NetworkApi>(
      new NetworkApi(),
      'network'
    );
    this.dapp = this.registerProxyService<DappBgApi>(
      new DappBgApi(storage, this.txn, this.network, this.auth, this.account),
      'dapp'
    );
    this.root = this.registerProxyService<RootApi>(
      ((ctx: any) => ({
        clearToken: async () => {
          const meta = await storage.loadMeta();
          if (!meta) return;

          try {
            await storage.clearMeta();
          } catch (e) {
            console.error(e);
            throw new Error('Clear meta failed');
          }
        },
        resetAppData: async () => {
          await storage.reset();
          ctx.initServices();
        },
      }))(this),
      'root'
    );
    log('initServices finished', this.serviceProxyCache);
  }

  private setUpFuncCallProxy(port: chrome.runtime.Port) {
    // create msg source from chrome port to be subscribed
    const portObservable = fromEventPattern(
      (h) => port.onMessage.addListener(h),
      (h) => port.onMessage.removeListener(h),
      (msg) => {
        return processPortMessage(msg);
      }
    );

    // set up server-like listening model
    const subscription = portObservable.subscribe(async (callFuncData) => {
      // proxy func-call msg to real method

      const { id, service, func, payload, options } = callFuncData;
      let error: null | { code: number; msg: string } = null;
      let data: null | any = null;
      const reqMeta = `id: ${id}, method: ${service}.${func}`;
      log(`request(${reqMeta})`, callFuncData);
      try {
        const startTime = Date.now();
        data = await this.callBackgroundMethod(service, func, payload, options);
        const duration = Date.now() - startTime;
        log(`respond(${reqMeta}) succeeded (${duration}ms)`, data);
      } catch (e) {
        logError(e);
        error = this.detectError(e);
        log(`respond(${reqMeta}) failed`, error);
      }
      try {
        port.postMessage(resData(id, error, data));
      } catch (e) {
        console.error(e);
        log(`postMessage(${reqMeta}) failed`, { e, data });
      }
    });

    port.onDisconnect.addListener(() => {
      log('unsubscribe port', port.name);
      subscription.unsubscribe();
      const index = this.ports.findIndex((p) => p === port);
      this.ports.splice(index, 1);
    });
  }

  private detectError(e: any) {
    if (e instanceof BizError) {
      return {
        code: e.code,
        msg: e.message,
      };
    }
    if (e?.name === 'RpcError') {
      return {
        code: ErrorCode.RPC_ERROR,
        msg: e.message,
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

  // register methods of all the services into the cache
  // setup service object proxy to check the method if existed
  private registerProxyService<T = any>(service: Object, svcName: string) {
    const serviceProxy = new Proxy(service, {
      get: (target, prop) => {
        if (typeof prop !== 'string') return (target as any)[prop];
        return (target as any)[prop];
      },
    });
    if (!has(this.serviceProxyCache, svcName)) {
      // register service into the service cache
      this.serviceProxyCache[svcName] = serviceProxy;
    }
    return serviceProxy as T;
  }

  private async callBackgroundMethod<T = any>(
    serviceName: string,
    funcName: string,
    payload: any,
    options?: CallFuncOption
  ) {
    if (!has(this.serviceProxyCache, serviceName)) {
      throw new Error(`service (${serviceName}) not exist`);
    }
    const service = this.serviceProxyCache[serviceName];
    if (typeof service[funcName] !== 'function') {
      throw new Error(
        `method ${funcName} not exist in service (${serviceName})`
      );
    }
    const params = payload;
    if (options && options?.withAuth === true) {
      try {
        // inject token to payload
        const token = this.auth.getToken();
        Object.assign(params, { token });
      } catch {
        throw new NoAuthError();
      }
    }
    return await (service[funcName](params) as Promise<T>);
  }

  private getStorage() {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    return storage;
  }
}
