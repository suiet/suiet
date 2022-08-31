import { IWalletApi, WalletApi } from "./wallet";
import { AccountApi, IAccountApi } from "./account";
import { INetworkApi } from "./network";
import { ITransactionApi, TransactionApi } from "./txn"
import { AuthApi, IAuthApi } from "./auth";
import { Storage, getStorage } from "../storage/Storage"
import { Buffer } from "buffer"
import * as crypto from "../crypto"
import { validateToken } from "./util"

export class CoreApi {
  storage: Storage;
  wallet: IWalletApi;
  account: IAccountApi;
  auth: IAuthApi;
  txn: ITransactionApi;

  constructor(storage: Storage) {
    this.storage = storage;
    this.wallet = new WalletApi(storage);
    this.account = new AccountApi(storage);
    this.auth = new AuthApi(storage);
    this.txn = new TransactionApi;
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
    this.storage = getStorage() as Storage;
  }

  async validateToken(token: string) {
    return validateToken(this.storage, token);
  }
}
