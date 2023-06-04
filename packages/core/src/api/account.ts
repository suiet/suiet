import { validateAccount, validateToken } from '../utils/token';
import * as crypto from '../crypto';
import { Vault } from '../vault/Vault';
import { IStorage } from '../storage';
import { isNonEmptyArray } from '../utils';
import { IsImportedWallet } from '../storage/types';
import { prepareVault } from '../utils/vault';

export interface Account {
  id: string;
  name: string;
  address: string;
  pubkey: string;
  hdPath?: string;
  encryptedPrivkey?: string;
}

export interface IAccountApi {
  createAccount: (walletId: string, token: string) => Promise<Account>;
  updateAccount: (
    walletId: string,
    accountId: string,
    meta: { name?: string },
    token: string
  ) => Promise<void>;
  getAccounts: (walletId: string) => Promise<Account[]>;
  getAccount: (accountId: string) => Promise<Account | null>;
  removeAccount: (
    walletId: string,
    accountId: string,
    token: string
  ) => Promise<void>;
  getAddress: (params: GetAddressParams) => Promise<string | string[]>;
}

export interface GetAddressParams {
  accountId?: string;
  batchAccountIds?: string[];
  token: string;
}

export class AccountApi implements IAccountApi {
  storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async createAccount(walletId: string, token: string): Promise<Account> {
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
    }
    if (IsImportedWallet(wallet)) {
      throw new Error('Wallet is not HD wallet');
    }

    const accountId = wallet.nextAccountId;
    wallet.nextAccountId += 1;
    const accountIdStr = toAccountIdString(wallet.id, accountId);
    const hdPath = crypto.derivationHdPath(accountId - 1);
    const vault = await Vault.fromEncryptedMnemonic(
      hdPath,
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic!
    );
    // TODO: cache vaults
    const account = {
      id: accountIdStr,
      name: toAccountNameString(wallet.name, 0),
      pubkey: vault.getPublicKey(),
      address: vault.getAddress(),
      hdPath,
    };
    wallet.accounts.push({
      id: account.id,
      address: account.address,
    });

    // TODO: save these states transactionally.
    await this.storage.addAccount(wallet.id, account.id, account);
    await this.storage.updateWallet(wallet.id, wallet);
    return account;
  }

  async updateAccount(
    walletId: string,
    accountId: string,
    meta: { name?: string | undefined },
    token: string
  ): Promise<void> {
    await validateAccount({
      walletId,
      accountId,
      storage: this.storage,
      token,
    });
    const account = await this.storage.getAccount(accountId);
    if (!account) {
      throw new Error('Account not exist');
    }
    if (meta.name) {
      account.name = meta.name;
    }
    await this.storage.updateAccount(walletId, accountId, account);
  }

  async getAccounts(walletId: string): Promise<Account[]> {
    return await this.storage.getAccounts(walletId);
  }

  async getPublicKey(accountId: string) {
    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error('Account not exist');
    }
    return account.pubkey;
  }

  async getAccount(accountId: string): Promise<Account | null> {
    return await this.storage.getAccount(accountId);
  }

  async removeAccount(
    walletId: string,
    accountId: string,
    token: string
  ): Promise<void> {
    await validateToken(this.storage, token);
    return await this.storage.deleteAccount(walletId, accountId);
  }

  // better use calculated address for safety concern
  async getAddress(params: GetAddressParams) {
    const getOneAddress = async (accountId: string, token: string) => {
      const walletId = getWalletIdFromAccountId(accountId);
      const wallet = await this.storage.getWallet(walletId);
      if (!wallet) {
        throw new Error('Wallet not exist');
      }
      const account = await this.storage.getAccount(accountId);
      if (!account) {
        throw new Error('Account not exist');
      }
      const vault = await prepareVault(wallet, account, token);
      return vault.getAddress();
    };

    if (isNonEmptyArray(params.batchAccountIds)) {
      const batchAccountIds = params.batchAccountIds as string[];
      // batch mode
      const tasks = batchAccountIds.map((id) =>
        getOneAddress(id, params.token)
      );
      return await Promise.all(tasks); // return address string[] following input order
    }
    // single mode
    if (!params.accountId) {
      throw new Error('params batchAccountIds or accountId required');
    }
    return await getOneAddress(params.accountId, params.token);
  }
}

export function toAccountIdString(walletId: string, id: number): string {
  return `${walletId}--${id}`;
}

function getWalletIdFromAccountId(accountId: string): string {
  const result = /^(.*)?--/.exec(accountId);
  if (!result) {
    throw new Error('invalid accountId format: ' + accountId);
  }
  return result[1];
}

function getAccountIdNumberFromString(accountId: string): number {
  const result = /^.*?--(\d+)/.exec(accountId);
  if (!result) {
    throw new Error('invalid accountId format: ' + accountId);
  }
  return Number(result[1]);
}

export function toAccountNameString(walletName: string, id: number): string {
  return `Account #${id}`;
}
