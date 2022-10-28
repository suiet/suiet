import * as crypto from '../crypto';
import { Storage } from '../storage/Storage';
import { Buffer } from 'buffer';
import { DATA_VERSION } from '../storage/constants';
import { generateClientId } from '../utils/clientId';
import { Vault } from '../vault/Vault';

export type UpdatePasswordParams = {
  oldPassword: string;
  newPassword: string;
};

export type SetBiometricDataParams = {
  credentialIdBase64: string;
  publicKeyBase64: string;
};

export interface IAuthApi {
  initPassword: (password: string) => Promise<void>;
  updatePassword: (params: UpdatePasswordParams) => Promise<void>;
  loadTokenWithPassword: (password: string) => Promise<string>;
}

export class AuthApi implements IAuthApi {
  storage: Storage;
  private readonly session: Session;

  constructor(storage: Storage) {
    this.storage = storage;
    this.session = new Session();
  }

  public async initPassword(password: string): Promise<void> {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const meta = await this.storage.loadMeta();
    const wallets = await this.storage.getWallets();
    // NOTE: prevent calling when already has wallets
    if (meta && wallets?.length > 0) {
      throw new Error('Meta already initialized');
    }
    const { cipher } = crypto.newToken(password);
    const newMeta = {
      nextWalletId: 1,
      dataVersion: DATA_VERSION,
      cipher,
    };
    await this.storage.reset();
    await this.storage.saveMeta(newMeta);

    await this.login(password);
  }

  // Implement Auth API
  public async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const { oldPassword, newPassword } = params;
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Meta not found');
    }
    const currentSalt = Buffer.from(meta.cipher.salt, 'hex');
    const currentToken = crypto.password2Token(oldPassword, currentSalt);
    if (!crypto.validateToken(currentToken, meta.cipher)) {
      throw new Error('Invalid password');
    }
    const { token: newToken, cipher: newCipher } = crypto.newToken(newPassword);
    const newMeta = {
      cipher: newCipher,
      nextWalletId: meta.nextWalletId,
      dataVersion: DATA_VERSION,
    };
    const wallets = await this.storage.getWallets();
    wallets.forEach((wallet) => {
      const mnemonic = crypto.decryptMnemonic(
        currentToken,
        wallet.encryptedMnemonic
      );
      wallet.encryptedMnemonic = crypto
        .encryptMnemonic(newToken, mnemonic)
        .toString('hex');
    });
    await this.storage.updateMetaAndWallets(newMeta, wallets);

    await this.resetBiometricData();
    await this.login(newPassword);
  }

  public async verifyPassword(password: string) {
    try {
      // if password can be used to decrypt token, then yes
      await this.loadTokenWithPassword(password);
      return true;
    } catch {
      return false;
    }
  }

  public getToken() {
    const token = this.session.getToken();
    if (!token) {
      throw new Error('No authentication');
    }
    return token;
  }

  public async isAuthed() {
    return !!this.getToken();
  }

  public async login(password: string) {
    const token = await this.loadTokenWithPassword(password);
    await maybeFixDataConsistency(this.storage, token);
    this.session.setToken(token);
  }

  public async logout() {
    this.session.clearToken();
  }

  public async loadTokenWithPassword(password: string): Promise<string> {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }
    const salt = Buffer.from(meta.cipher.salt, 'hex');
    const token = crypto.password2Token(password, salt);
    if (!crypto.validateToken(token, meta.cipher)) {
      throw new Error('Invalid password');
    }
    return token.toString('hex');
  }

  public async getClientId() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }
    if (!meta.clientId) {
      meta.clientId = generateClientId(20, undefined, 'chrome-');
      await this.storage.saveMeta(meta);
    }
    return meta.clientId;
  }

  public async setBiometricData({
    credentialIdBase64,
    publicKeyBase64,
  }: SetBiometricDataParams) {
    const token = this.getToken();

    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }

    // if (meta.biometricData) {
    //   throw new Error('Biometric authentication already set');
    // }

    const authKey = generateClientId(24);
    const encryptedToken = crypto.encryptString(Buffer.from(authKey), token);

    meta.biometricData = {
      credentialIdBase64,
      publicKeyBase64,
      encryptedToken,
    };

    await this.storage.saveMeta(meta);

    return authKey;
  }

  public async hasBiometricData() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }

    if (typeof meta.biometricData === 'object' && meta.biometricData !== null) {
      return true;
    }
    return false;
  }

  public async getBiometricData() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }

    if (meta.biometricData) {
      // skip sending encryptedToken outside
      return {
        credentialIdBase64: meta.biometricData.credentialIdBase64,
        publicKeyBase64: meta.biometricData.publicKeyBase64,
      };
    }
  }

  public async resetBiometricData() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }

    if (meta.biometricData) {
      delete meta.biometricData;
      await this.storage.clearMeta();
      await this.storage.saveMeta(meta);
    }
  }

  public async unlockWithAuthKey(authKey: string) {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password uninitialized');
    }

    if (!meta.biometricData) {
      throw new Error('Biometric authentication not set');
    }

    const token = crypto.decryptString(
      Buffer.from(authKey),
      meta.biometricData.encryptedToken
    );

    const newAuthKey = generateClientId(24);
    const encryptedToken = crypto.encryptString(Buffer.from(newAuthKey), token);

    meta.biometricData.encryptedToken = encryptedToken;
    await this.storage.saveMeta(meta);
    this.session.setToken(token);

    return newAuthKey;
  }
}

async function maybeFixDataConsistency(storage: Storage, token: string) {
  const walletListThatNeedsUpgrade = [];
  const accountListThatNeedsUpgrade = [];
  const wallets = await storage.getWallets();
  for (const wallet of wallets) {
    let isWalletNeedToUpdate = false;
    for (let i = 0, len = wallet.accounts.length; i < len; i++) {
      const account = wallet.accounts[i];
      // account is just accountId string, need to change to {id: string, address: string}
      const accountData = await storage.getAccount(account.id);
      if (!accountData) {
        continue;
      }
      const res = accountData.hdPath.match(/^m\/44'\/784'\/(\d+)'$/);
      console.log(res, accountData);
      if (res) {
        const path = crypto.derivationHdPath(+res[1]);
        console.debug(
          `update account hd path from ${accountData.hdPath} to ${path}`
        );
        accountData.hdPath = path;
      }
      const vault = await Vault.create(
        accountData.hdPath,
        Buffer.from(token, 'hex'),
        wallet.encryptedMnemonic
      );
      if (accountData.address !== vault.getAddress()) {
        console.debug(
          `update account address from ${
            accountData.address
          } to ${vault.getAddress()}`
        );
        accountData.address = vault.getAddress();
        wallet.accounts[i] = {
          id: accountData.id,
          address: accountData.address,
        };
        accountListThatNeedsUpgrade.push({
          walletId: wallet.id,
          account: accountData,
        });
        isWalletNeedToUpdate = true;
      }
    }
    if (isWalletNeedToUpdate) {
      walletListThatNeedsUpgrade.push(wallet);
    }
  }
  for (const wallet of walletListThatNeedsUpgrade) {
    await storage.updateWallet(wallet.id, wallet);
  }
  for (const item of accountListThatNeedsUpgrade) {
    await storage.updateAccount(item.walletId, item.account.id, item.account);
  }
}

class Session {
  private token: string | undefined;

  constructor() {
    this.token = undefined;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public getToken() {
    return this.token;
  }

  public clearToken() {
    this.token = undefined;
  }
}
