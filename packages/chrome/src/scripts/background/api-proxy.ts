import {
  NetworkApi,
  TransactionApi,
  AuthApi,
  AccountApi,
  WalletApi,
  getStorage,
  Storage,
  validateToken,
} from '@suiet/core';
import { fromEventPattern, Observable } from 'rxjs';
import { ResData, resData } from '../shared';
import { log, processPortMessage } from './utils';
import { CallFuncData } from './types';
import { has } from 'lodash-es';
import { DappBgApi } from './bg-api/dapp';

interface RootApi {
  clearToken: () => Promise<void>;
  resetAppData: (token: string) => Promise<void>;
  validateToken: (token: string) => Promise<void>;
}

/**
 * Proxy the port message function call to the actual method
 */
export class BackgroundApiProxy {
  private port: chrome.runtime.Port;
  private portObservable: Observable<CallFuncData>;
  private storage: Storage;
  private serviceProxyCache: Record<string, any>;

  public root: RootApi;
  public wallet: WalletApi;
  public account: AccountApi;
  public auth: AuthApi;
  public txn: TransactionApi;
  public network: NetworkApi;
  public dapp: DappBgApi;

  private constructor(port: chrome.runtime.Port) {
    this.initServices();
    this.setUpFuncCallProxy(port);
  }

  static listenTo(port: chrome.runtime.Port) {
    log('set up lister for port', port);
    return new BackgroundApiProxy(port);
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
    this.dapp = this.registerProxyService<DappBgApi>(new DappBgApi(), 'dapp');
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
        resetAppData: async (token: string) => {
          await validateToken(storage, token);
          await storage.reset();
          ctx.initServices();
        },
      }))(this),
      'root'
    );
    log('initServices finished', this.serviceProxyCache);
  }

  private setUpFuncCallProxy(port: chrome.runtime.Port) {
    this.port = port;
    // create msg source from chrome port to be subscribed
    this.portObservable = fromEventPattern(
      (h) => this.port.onMessage.addListener(h),
      (h) => this.port.onMessage.removeListener(h),
      (msg) => {
        return processPortMessage(msg);
      }
    );

    // set up server-like listening model
    this.portObservable.subscribe(async (callFuncData) => {
      // proxy func-call msg to real method
      const { id, service, func, payload } = callFuncData;
      let error: null | string = null;
      let data: null | any = null;
      const reqMeta = `id: ${id}, method: ${service}.${func}`;
      log(`request(${reqMeta})`, callFuncData);
      try {
        const startTime = Date.now();
        data = await this.callBackgroundMethod(service, func, payload);
        const duration = Date.now() - startTime;
        log(`respond(${reqMeta}) succeeded (${duration}ms)`, data);
      } catch (e) {
        error = (e as any).message;
        log(`respond(${reqMeta}) failed`, e);
      }
      try {
        this.port.postMessage(JSON.stringify(resData(id, error, data)));
      } catch (e) {
        log(`postMessage(${reqMeta}) failed`, { e, data });
      }
    });
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
    payload: any
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
    return await (service[funcName](payload) as Promise<T>);
  }

  private getStorage() {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    return storage;
  }
}
