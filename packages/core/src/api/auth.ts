import * as crypto from '../crypto';
import { Storage } from '../storage/Storage';
import { Buffer } from 'buffer';

export interface IAuthApi {
  updatePassword: (
    oldPassword: string | null,
    newPassword: string
  ) => Promise<void>;
  loadTokenWithPassword: (password: string) => Promise<string>;
}

export class AuthApi {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  // Implement Auth API
  async updatePassword(
    oldPassword: string | null,
    newPassword: string
  ): Promise<void> {
    const meta = await this.storage.loadMeta();
    if (meta) {
      // Verify old password before update.
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
    let newMeta = {
      nextWalletId: 0,
      cipher: cipher,
    };
    if (meta) {
      newMeta.nextWalletId = meta.nextWalletId;
    }
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
