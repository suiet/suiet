import { IWalletApi, WalletApi } from './wallet';
import { AccountApi, IAccountApi } from './account';
import { ITransactionApi, TransactionApi } from './txn';
import { AuthApi, IAuthApi } from './auth';
import { Storage, getStorage } from '../storage/Storage';
import { validateToken } from './util';
import { INetworkApi, NetworkApi } from './network';

export class CoreApi {
  storage: Storage;
  wallet: IWalletApi;
  account: IAccountApi;
  auth: IAuthApi;
  txn: ITransactionApi;
  network: INetworkApi;

  constructor(storage: Storage) {
    this.storage = storage;
    this.wallet = new WalletApi(storage);
    this.account = new AccountApi(storage);
    this.auth = new AuthApi(storage);
    this.txn = new TransactionApi(storage);
    this.network = new NetworkApi();
  }

  private init(storage: Storage) {
    this.storage = storage;
    this.wallet = new WalletApi(storage);
    this.account = new AccountApi(storage);
    this.auth = new AuthApi(storage);
    this.txn = new TransactionApi(storage);
  }

  public static newApi(): CoreApi {
    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    return new CoreApi(storage);
  }

  async clearToken() {
    const meta = await this.storage.loadMeta();
    if (!meta) return;

    try {
      await this.storage.clearMeta();
    } catch (e) {
      console.error(e);
      throw new Error('Clear meta failed');
    }
  }

  async resetAppData(token: string) {
    await this.validateToken(token);
    await this.storage.reset();

    const storage = getStorage();
    if (!storage) {
      throw new Error('Platform not supported');
    }
    this.init(storage);
  }

  async validateToken(token: string) {
    return await validateToken(this.storage, token);
  }
}
