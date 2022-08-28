import { CreateWalletParams, IWalletApi, toWalletIdString, toWalletNameString, Wallet } from "./wallet";
import { Account, IAccountApi, toAccountIdString, toAccountNameString } from "./account";
import { INetworkApi } from "./network";
import { IAuthApi } from "./auth";
import { Storage, getStorage } from "../storage/Storage"
import { Vault } from "../vault/Vault";
import { Buffer } from "buffer"
import * as crypto from "../crypto"

export class CoreApi implements IWalletApi, IAccountApi, IAuthApi {
  storage: Storage;
  vaults: Record<string, Vault>;

  constructor(storage: Storage) {
    this.storage = storage;
    this.vaults = {};
  }

  public static newApi(): CoreApi {
    const storage = getStorage();
    if (!storage) {
      throw new Error("Platform not supported");
    }
    return new CoreApi(storage);
  }

  // Implement Wallet API
  validateMnemonic(mnemonic: string): boolean {
    return crypto.validateMnemonic(mnemonic);
  }

  async revealMnemonic(walletId: string, token: string): Promise<string> {
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error("Wallet Not Exist")
    }
    return crypto.decryptMnemonic(Buffer.from(token, "hex"), wallet.encryptedMnemonic)
  }

  async createWallet(params: CreateWalletParams): Promise<Wallet> {
    validateToken(this.storage, params.token);
    let mnemonic;
    if (params.mnemonic) {
      mnemonic = params.mnemonic;
    } else {
      mnemonic = crypto.generateMnemonic();
    }
    const token = Buffer.from(params.token, "hex")
    const encryptedMnemonic = crypto.encryptMnemonic(token, mnemonic);
    let meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error("Password not initialized")
    }
    const walletId = meta.nextWalletId;
    meta.nextWalletId += 1;
    const walletIdStr = toWalletIdString(walletId)
    const accountIdStr = toAccountIdString(walletIdStr, 0);
    const wallet = {
      id: toWalletIdString(walletId),
      name: params.name ? params.name : toWalletNameString(walletId),
      accounts: [accountIdStr],
      nextAccountId: 1,
      encryptedMnemonic: encryptedMnemonic.toString('hex'),
      avatar: params.avatar ? params.avatar : undefined
    }
    const hdPath = crypto.derivationHdPath(0);
    const vault = await Vault.create(hdPath, token, wallet.encryptedMnemonic);
    this.vaults[accountIdStr] = vault;
    const account = {
      id: accountIdStr,
      name: toAccountNameString(wallet.name, 0),
      pubkey: vault.getPublicKey(),
      address: vault.getAddress(),
      hdPath: hdPath,
    }

    // TODO: save these states transactionally.
    await this.storage.saveMeta(meta);
    await this.storage.addAccount(wallet.id, account.id, account)
    await this.storage.addWallet(wallet.id, wallet)

    return wallet;
  }

  async getWallets(): Promise<Wallet[]> {
    return await this.storage.getWallets();
  }

  async getWallet(walletId: string): Promise<Wallet | null> {
    return await this.storage.getWallet(walletId)
  }

  async updateWallet(walletId: string, meta: { name?: string | undefined; avatar?: string | undefined; }, token: string) {
    validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error("Wallet Not Exist")
    }
    if (meta.name) {
      wallet.name = meta.name;
    }
    if (meta.avatar) {
      wallet.avatar = meta.avatar;
    }
  }

  async deleteWallet(walletId: string, token: string) {
    validateToken(this.storage, token);
    return await this.storage.deleteWallet(walletId);
  }

  // Implement Account API
  async createAccount(walletId: string, token: string): Promise<Account> {
    validateToken(this.storage, token);
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
    this.vaults[accountIdStr] = vault;
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
    validateToken(this.storage, token);
    let account = await this.storage.getAccount(walletId, accountId);
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
    return await this.storage.getAccount(walletId, accountId);
  }

  async removeAccount(walletId: string, accountId: string, token: string): Promise<void> {
    validateToken(this.storage, token);
    return await this.storage.deleteAccount(walletId, accountId);
  }

  // Implement Auth API
  async updatePassword(oldPassword: string | null, newPassword: string): Promise<void> {
    const meta = await this.storage.loadMeta();
    if (meta) {
      // Verify old password before update.
      if (!oldPassword) {
        throw new Error("Empty old password")
      }
      const currentSalt = Buffer.from(meta.cipher.salt, "hex")
      const currentToken = crypto.password2Token(oldPassword, currentSalt);
      if (!crypto.validateToken(currentToken, meta.cipher)) {
        throw new Error("Invalid old password");
      }
    }
    const { cipher } = crypto.newToken(newPassword);
    let newMeta = {
      nextWalletId: 0,
      cipher: cipher,
    };
    if (meta) {
      newMeta.nextWalletId = meta.nextWalletId;
    }
    await this.storage.saveMeta(newMeta)
  }

  async loadTokenWithPassword(password: string): Promise<string> {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error("Password uninitialized")
    }
    const salt = Buffer.from(meta.cipher.salt, "hex")
    const token = crypto.password2Token(password, salt);
    if (!crypto.validateToken(token, meta.cipher)) {
      throw new Error("Invalid password");
    }
    return token.toString('hex')
  }
}

export async function validateToken(storage: Storage, token: string) {
  const meta = await storage.loadMeta();
  if (!meta) {
    throw new Error("Empty old password")
  }
  if (!crypto.validateToken(Buffer.from(token, "hex"), meta.cipher)) {
    throw new Error("Invalid old password");
  }
}
