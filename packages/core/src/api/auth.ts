import * as crypto from '../crypto';
import { Storage } from '../storage/Storage';
import { Buffer } from 'buffer';
import { DATA_VERSION } from '../storage/constants';

export type UpdatePasswordParams = {
  oldPassword: string;
  newPassword: string;
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
