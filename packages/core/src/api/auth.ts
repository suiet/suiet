import * as crypto from '../crypto';
import { Storage } from '../storage/Storage';
import { Buffer } from 'buffer';

export type UpdatePasswordParams = {
  oldPassword: string | null;
  newPassword: string;
};

export interface IAuthApi {
  updatePassword: (params: UpdatePasswordParams) => Promise<void>;
  loadTokenWithPassword: (password: string) => Promise<string>;
}

export class AuthApi {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  // Implement Auth API
  async updatePassword(params: UpdatePasswordParams): Promise<void> {
    const { oldPassword, newPassword } = params;
    const wallets = await this.storage.getWallets();
    const meta = await this.storage.loadMeta();
    if (meta && wallets.length !== 0) {
      // Password Verify old password before update.
      if (!oldPassword) {
        throw new Error('Empty old password');
      }
      const currentSalt = Buffer.from(meta.cipher.salt, 'hex');
      const currentToken = crypto.password2Token(oldPassword, currentSalt);
      if (!crypto.validateToken(currentToken, meta.cipher)) {
        throw new Error('Invalid old password');
      }
    }
    const { cipher } = crypto.newToken(newPassword);
    const newMeta = {
      nextWalletId: 1,
      cipher,
    };
    if (meta) {
      newMeta.nextWalletId = meta.nextWalletId;
    }
    await this.storage.reset();
    await this.storage.saveMeta(newMeta);
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
