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

  constructor(storage: Storage) {
    this.storage = storage;
  }

  async initPassword(password: string): Promise<void> {
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const meta = await this.storage.loadMeta();
    if (meta) {
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
  }

  // Implement Auth API
  async updatePassword(params: UpdatePasswordParams): Promise<void> {
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
  }

  async loadTokenWithPassword(password: string): Promise<string> {
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
