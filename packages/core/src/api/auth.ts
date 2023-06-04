import * as crypto from '../crypto';
import { IStorage } from '../storage';
import { Buffer } from 'buffer';
import { DATA_VERSION } from '../storage/constants';
import { generateClientId } from '../utils/clientId';
import { Vault } from '../vault/Vault';
import { MetadataMissingError, NoAuthError } from '../errors';
import { type } from 'superstruct';
import { IsImportedWallet, isImportedAccount } from '../storage/types';

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
  storage: IStorage;
  private readonly session: Session;

  constructor(storage: IStorage) {
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
      ...meta,
      cipher: newCipher,
      nextWalletId: meta.nextWalletId,
      dataVersion: DATA_VERSION,
    };
    let wallets = await this.storage.getWallets();
    let accounts = [];
    {
      const t = Date.now();
      try {
        for (let i = 0; i < wallets.length; i++) {
          if (IsImportedWallet(wallets[i])) {
            for (let a of wallets[i].accounts) {
              let account = await this.storage.getAccount(a.id);
              if (!account) {
                throw new Error(
                  `Data inconsistency: wallet ${wallets[i].id} account ${a.id} not exist`
                );
              }
              if (!isImportedAccount(account)) {
                throw new Error(
                  `Data inconsistenct error: account ${a.id} is not imported`
                );
              }
              const privateKey = crypto
                .decryptPrivate(currentToken, account.encryptedPrivateKey!)
                .getSecret();
              account.encryptedPrivateKey = crypto
                .encryptPrivate(newToken, privateKey)
                .toString('hex');
              accounts.push(account);
            }
            continue;
          }
          const mnemonic = crypto.decryptMnemonic(
            currentToken,
            wallets[i].encryptedMnemonic!
          );
          wallets[i].encryptedMnemonic = crypto
            .encryptMnemonic(newToken, mnemonic)
            .toString('hex');
        }
      } finally {
        console.log('decryptMnemonic', Date.now() - t);
      }
    }
    await this.storage.updateMetaWalletsAndAccounts(newMeta, wallets, accounts);

    {
      const t = Date.now();
      try {
        await this.login(newPassword);
      } finally {
        console.log('login', Date.now() - t);
      }
    }
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
      throw new NoAuthError();
    }
    return token;
  }

  public async isAuthed() {
    return !!this.getToken();
  }

  public async login(password: string) {
    const t = Date.now();
    const token = await this.loadTokenWithPassword(password);
    console.log('loadTokenWithPassword', Date.now() - t);
    await maybeFixDataConsistency(this.storage, token);
    console.log('maybeFixDataConsistency', Date.now() - t);
    this.session.setToken(token);
    // no need to await as we don't care about the result
    // and we don't want to block the login process
    this.biometricAuthTokenChanged(token);
  }

  public async logout() {
    this.session.clearToken();
  }

  public async loadTokenWithPassword(password: string): Promise<string> {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }
    const t = Date.now();
    const salt = Buffer.from(meta.cipher.salt, 'hex');
    const token = crypto.password2Token(password, salt);
    console.log('password2Token', Date.now() - t);
    if (!crypto.validateToken(token, meta.cipher)) {
      throw new Error('Invalid password');
    }
    console.log('validateToken', Date.now() - t);
    return token.toString('hex');
  }

  public async getClientId() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }
    if (!meta.clientId) {
      meta.clientId = generateClientId(20, undefined, 'chrome-');
      await this.storage.saveMeta(meta);
    }
    return meta.clientId;
  }

  private async biometricAuthTokenChanged(token: string) {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    if (typeof meta.biometricData === 'object' && meta.biometricData !== null) {
      const clientId = await this.getClientId();
      const newAuthKey = generateClientId(24);
      const encryptedToken = crypto.encryptString(
        Buffer.from(newAuthKey),
        token
      );

      try {
        const resp = await fetch(
          `https://api.suiet.app/extension/auth/set-auth-key`,
          {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              client_id: clientId,
              auth_key: newAuthKey,
              public_key_base64: meta.biometricData.publicKeyBase64,
            }),
          }
        );
        if (resp.ok) {
          meta.biometricData.encryptedToken = encryptedToken;
          await this.storage.saveMeta(meta);
        } else {
          throw new Error('Failed to set auth key');
        }
      } catch (e) {
        delete meta.biometricData;
        await this.storage.clearMeta();
        await this.storage.saveMeta(meta);
      }
    }
  }

  private async biometricAuthUnlockWithAuthKey(
    authKey: string,
    newAuthKey?: string
  ) {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    if (!meta.biometricData) {
      throw new Error('Biometric authentication not enabled');
    }

    const token = crypto.decryptString(
      Buffer.from(authKey),
      meta.biometricData.encryptedToken
    );
    if (!crypto.validateToken(Buffer.from(token, 'hex'), meta.cipher)) {
      throw new Error('Invalid password');
    }

    await maybeFixDataConsistency(this.storage, token);

    newAuthKey = newAuthKey ?? generateClientId(24);
    const encryptedToken = crypto.encryptString(Buffer.from(newAuthKey), token);

    meta.biometricData.encryptedToken = encryptedToken;
    await this.storage.saveMeta(meta);
    this.session.setToken(token);

    return newAuthKey;
  }

  public async biometricAuthRotateAuthKey({
    challengeBase64,
    signatureBase64,
  }: any) {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    if (!meta.biometricData) {
      throw new Error('Biometric authentication not enabled');
    }

    const clientId = await this.getClientId();
    const newAuthKey = generateClientId(24);

    let shouldClear = false;

    try {
      const resp = await fetch(
        `https://api.suiet.app/extension/auth/rotate-auth-key`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            message_base64: challengeBase64,
            signature_base64: signatureBase64,
            public_key_base64: meta.biometricData.publicKeyBase64,

            auth_key: newAuthKey,
          }),
        }
      );

      if (resp.ok) {
        const { auth_key: authKey } = await resp.json();
        if (authKey) {
          try {
            await this.biometricAuthUnlockWithAuthKey(authKey, newAuthKey);
            return true;
          } catch (e) {
            shouldClear = true;
          }
        }
      } else {
        try {
          const { error_code: errorCode } = await resp.json();
          if (errorCode === 'NOT_FOUND') {
            shouldClear = true;
          }
        } catch (e) {}
      }
    } catch (e) {}

    try {
      if (shouldClear) {
        delete meta.biometricData;
        await this.storage.clearMeta();
        await this.storage.saveMeta(meta);
      }
    } catch (e) {}

    return false;
  }

  public async biometricAuthGetData() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    if (meta.biometricData) {
      // skip sending encryptedToken outside
      return {
        credentialIdBase64: meta.biometricData.credentialIdBase64,
        publicKeyBase64: meta.biometricData.publicKeyBase64,
      };
    }
  }

  public async biometricAuthEnable({
    credentialIdBase64,
    publicKeyBase64,
  }: SetBiometricDataParams) {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    const token = this.getToken();
    const clientId = await this.getClientId();
    const authKey = generateClientId(24);
    const encryptedToken = crypto.encryptString(Buffer.from(authKey), token);

    try {
      const resp = await fetch(
        `https://api.suiet.app/extension/auth/set-auth-key`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            auth_key: authKey,
            public_key_base64: publicKeyBase64,
          }),
        }
      );

      if (resp.ok) {
        meta.biometricData = {
          credentialIdBase64,
          publicKeyBase64,
          encryptedToken,
        };
        await this.storage.saveMeta(meta);
        return true;
      }
    } catch (e) {}
    return false;
  }

  public async biometricAuthDisable() {
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new MetadataMissingError();
    }

    if (meta.biometricData) {
      delete meta.biometricData;
      await this.storage.clearMeta();
      await this.storage.saveMeta(meta);
      await fetch(`https://api.suiet.app/extension/auth/delete-auth-key`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          client_id: await this.getClientId(),
        }),
      });
    }
  }
}

async function maybeFixDataConsistency(storage: IStorage, token: string) {
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
        throw new Error('Check data consistency failed: account data missing');
        continue;
      }
      let vault: Vault;
      if (isImportedAccount(accountData)) {
        vault = await Vault.fromEncryptedPrivateKey(
          Buffer.from(token, 'hex'),
          accountData.encryptedPrivateKey!
        );
      } else {
        const hdPath = accountData.hdPath!;
        const res = hdPath.match(/^m\/44'\/784'\/(\d+)'$/);
        const t = Date.now();
        // console.log(res, accountData);
        if (res) {
          const path = crypto.derivationHdPath(+res[1]);
          console.debug(`update account hd path from ${hdPath} to ${path}`);
          accountData.hdPath = path;
        }
        console.log('crypto.derivationHdPath', Date.now() - t);
        vault = await Vault.fromEncryptedMnemonic(
          hdPath,
          Buffer.from(token, 'hex'),
          wallet.encryptedMnemonic!
        );
        console.log('Vault.create', Date.now() - t);
      }
      if (
        accountData.address !== vault.getAddress() ||
        accountData.pubkey !== vault.getPublicKey()
      ) {
        console.debug(
          `update account address from ${
            accountData.address
          } to ${vault.getAddress()}`
        );
        accountData.address = vault.getAddress();
        accountData.pubkey = vault.getPublicKey();
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

/**
 * Session memory storage for sensitive data
 */
class Session {
  #DEFAULT_EXPIRATION = 1000 * 60 * 60 * 4; // 4 hrs
  #token: string | undefined;
  #expiration: number; // unit: ms
  #lastUpdate: number;

  constructor(opts?: { expiration?: number }) {
    const { expiration = this.#DEFAULT_EXPIRATION } = opts || {};
    this.#token = undefined;
    this.setExpiration(expiration);
  }

  public setToken(token: string) {
    this.#token = token;
    this.#lastUpdate = Date.now();
  }

  public getToken() {
    if (this.#hasExpired()) {
      this.clearToken();
    }
    return this.#token;
  }

  public clearToken() {
    this.#token = undefined;
  }

  public setExpiration(expiration: number) {
    if (typeof expiration !== 'number' || expiration < 0) {
      throw new Error('expiration must be greater than 0');
    }
    this.#expiration = expiration;
  }

  #hasExpired() {
    if (!this.#lastUpdate) return true;
    return Date.now() > this.#lastUpdate + this.#expiration;
  }
}
