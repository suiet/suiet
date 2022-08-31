import { validateToken } from "./util"
import * as crypto from "../crypto"
import { Vault } from "../vault/Vault";
import { Storage } from "../storage/Storage"

export interface Account {
  id: string;
  name: string;
  address: string;
  pubkey: string;
  hdPath: string;
}

export interface IAccountApi {
  createAccount: (walletId: string, token: string) => Promise<Account>;
  updateAccount: (walletId: string, accountId: string, meta: { name?: string; }, token: string) => Promise<void>;
  getAccounts: (walletId: string) => Promise<Array<Account>>;
  getAccount: (walletId: string, accountId: string) => Promise<Account | null>;
  removeAccount: (walletId: string, accountId: string, token: string) => Promise<void>;
}

export class AccountApi implements IAccountApi {
  storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  async createAccount(walletId: string, token: string): Promise<Account> {
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error("Wallet Not Exist")
    }

    const accountId = wallet.nextAccountId;
    wallet.nextAccountId += 1;
    const accountIdStr = toAccountIdString(wallet.id, accountId);
    const hdPath = crypto.derivationHdPath(accountId);
    wallet.accounts.push(accountIdStr);
    const vault = await Vault.create(hdPath, Buffer.from(token, "hex"), wallet.encryptedMnemonic);
    // TODO: cache vaults
    const account = {
      id: accountIdStr,
      name: toAccountNameString(wallet.name, 0),
      pubkey: vault.getPublicKey(),
      address: vault.getAddress(),
      hdPath: hdPath,
    }
    // TODO: save these states transactionally.
    await this.storage.addAccount(wallet.id, account.id, account)
    await this.storage.updateWallet(wallet.id, wallet)
    return account;
  }

  async updateAccount(walletId: string, accountId: string, meta: { name?: string | undefined; }, token: string): Promise<void> {
    await validateToken(this.storage, token);
    let account = await this.storage.getAccount(accountId);
    if (!account) {
      throw new Error("Account Not Exist");
    }
    if (meta.name) {
      account.name = meta.name;
    }
    await this.storage.updateAccount(walletId, accountId, account);
  }

  async getAccounts(walletId: string): Promise<Account[]> {
    return await this.storage.getAccounts(walletId);
  }

  async getAccount(walletId: string, accountId: string): Promise<Account | null> {
    return await this.storage.getAccount(accountId);
  }

  async removeAccount(walletId: string, accountId: string, token: string): Promise<void> {
    await validateToken(this.storage, token);
    return await this.storage.deleteAccount(walletId, accountId);
  }
}

export function toAccountIdString(walletId: string, id: number): string {
  return `${walletId}--${id}`
}

export function toAccountNameString(walletName: string, id: number): string {
  return `Account #${id}`
}