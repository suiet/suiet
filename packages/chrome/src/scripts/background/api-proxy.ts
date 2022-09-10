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
import { resData } from '../shared';
import { log, processPortMessage } from './utils';
import { CallFuncData } from './types';
import { has } from 'lodash-es';

interface IRootApi {
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

  public root: IRootApi;
  public wallet: WalletApi;
  public account: AccountApi;
  public auth: AuthApi;
  public txn: TransactionApi;
  public network: NetworkApi;

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
    this.storage = this.getStorage();
    this.wallet = this.registerProxyService<WalletApi>(
      new WalletApi(this.storage),
      'wallet'
    );
    this.account = this.registerProxyService<AccountApi>(
      new AccountApi(this.storage),
      'account'
    );
    this.auth = this.registerProxyService<AuthApi>(
      new AuthApi(this.storage),
      'auth'
    );
    this.txn = this.registerProxyService<TransactionApi>(
      new TransactionApi(this.storage),
      'txn'
    );
    this.network = this.registerProxyService<NetworkApi>(
      new NetworkApi(),
      'network'
    );
    this.root = this.registerProxyService<IRootApi>(
      ((ctx: any) => ({
        clearToken: async () => {
          const meta = await ctx.storage.loadMeta();
          if (!meta) return;

          try {
            await ctx.storage.clearMeta();
          } catch (e) {
            console.error(e);
            throw new Error('Clear meta failed');
          }
        },
        resetAppData: async (token: string) => {
          await validateToken(ctx.storage, token);
          await ctx.storage.reset();
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
        log('port receive msg', msg);
        return processPortMessage(msg);
      }
    );

    // set up server-like listening model
    this.portObservable.subscribe(async (callFuncData) => {
      // proxy func-call msg to real method
      const { id, service, func, payload } = callFuncData;
      let error: null | string = null;
      let data: null | any = null;
      log(`request(id: ${id})`, callFuncData);
      try {
        data = await this.callBackgroundMethod(service, func, payload);
        log(`respond(id: ${id}) succeeded`, data);
      } catch (e) {
        error = (e as any).message;
        log(`respond(id: ${id}) failed`, e);
      }
      this.port.postMessage(resData(id, error, data));
    });
  }

  // register methods of all the services into the cache
  // setup service object proxy to check the method if existed
  private registerProxyService<T = any>(service: Object, svcName: string) {
    if (!has(this.serviceProxyCache, svcName)) {
      // register service into the service cache
      this.serviceProxyCache[svcName] = service;
    }
    const serviceProxy = new Proxy(service, {
      get: (target, prop) => {
        if (typeof prop !== 'string') return (target as any)[prop];
        if (!has(target, prop) || typeof (target as any)[prop] !== 'function') {
          throw new Error(
            `method (${prop}) not existed in service (${svcName})`
          );
        }
        return (target as any)[prop];
      },
    });
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
    return await (service[funcName].call(payload) as Promise<T>);
  }

  private getStorage() {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    return storage;
  }
}
