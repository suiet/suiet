import { validateToken } from '../../utils/token';
import * as crypto from '../../crypto';
import { Vault } from '../../vault/Vault';
import { IStorage } from '../../storage';
import { toAccountIdString, toAccountNameString } from '../account';
import { Buffer } from 'buffer';
import { whichAvatar } from './utils';
import { prepareVault } from '../../utils/vault';
import {
  IsImportedWallet,
  WALLET_TYPE_HDWALLET,
  WALLET_TYPE_IMPORTED,
  isImportedAccount,
} from '../../storage/types';
import elliptic from 'elliptic';

export type CreateWalletParams = {
  token: string;
  mnemonic?: string;
  private?: string;
  name?: string;
  avatar?: string;
};

export type ImportWalletParams = {
  token: string;
  private: string;
  name?: string;
  avatar?: string;
};
export type AvatarPfp = {
  objectId: string;
  name: string;
  uri: string;
  mime: string;
  expiresAt: number;
};

export type UpdateWalletParams = {
  walletId: string;
  meta: { name?: string; avatar?: string; avatarPfp?: AvatarPfp };
  token: string;
};

export type RevealMnemonicParams = {
  walletId: string;
  token: string;
};

export type DeleteWalletParams = {
  walletId: string;
  token: string;
};

export type RevealPrivateKeyParams = RevealMnemonicParams;

export type AccountInWallet = {
  id: string;
  address: string;
};

export type Wallet = {
  id: string;
  name: string;
  accounts: AccountInWallet[];
  nextAccountId: number;
  avatar?: string;
  isImported: boolean;
  avatarPfp?: AvatarPfp;
};

export interface IWalletApi {
  validateMnemonic: (mnemonic: string) => boolean;
  revealMnemonic: (params: RevealMnemonicParams) => Promise<string>;
  revealPrivate: (params: RevealPrivateKeyParams) => Promise<string>;

  createWallet: (params: CreateWalletParams) => Promise<Wallet>;
  getWallets: (opts?: { withMnemonic?: boolean }) => Promise<Wallet[]>;
  getWallet: (
    walletId: string,
    opts?: {
      withMnemonic?: boolean;
    }
  ) => Promise<Wallet | null>;
  updateWallet: (params: UpdateWalletParams) => Promise<void>;
  deleteWallet: (params: DeleteWalletParams) => Promise<void>;
  importWallet: (params: ImportWalletParams) => Promise<Wallet>;
}

export class WalletApi implements IWalletApi {
  storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  // Implement Wallet API
  validateMnemonic(mnemonic: string): boolean {
    return crypto.validateMnemonic(mnemonic);
  }

  async revealMnemonic(params: RevealMnemonicParams): Promise<string> {
    const { walletId, token } = params;
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
    }
    if (IsImportedWallet(wallet)) {
      throw new Error('Wallet is not HD wallet');
    }
    return crypto.decryptMnemonic(
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic!
    );
  }

  async revealPrivate(params: RevealPrivateKeyParams): Promise<string> {
    const { walletId, token } = params;
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
    }
    const account = await this.storage.getAccount(wallet.accounts[0].id);
    if (!account) {
      throw new Error('Account not exist');
    }
    const vault = await prepareVault(wallet, account, token);
    return vault.key.getPrivateKey().toString('hex');
  }

  async createWallet(params: CreateWalletParams): Promise<Wallet> {
    await validateToken(this.storage, params.token);
    let mnemonic;
    if (params.mnemonic) {
      mnemonic = params.mnemonic;
    } else {
      mnemonic = crypto.generateMnemonic();
    }
    const token = Buffer.from(params.token, 'hex');
    if (await this.checkMnemonicDuplicated(mnemonic, token)) {
      throw new Error('Wallet already exist');
    }
    const encryptedMnemonic = crypto.encryptMnemonic(token, mnemonic);
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password not initialized');
    }
    const walletId = meta.nextWalletId;
    meta.nextWalletId += 1;
    const walletIdStr = toWalletIdString(walletId);
    const accountIdStr = toAccountIdString(walletIdStr, 0);
    const wallet: Wallet & { encryptedMnemonic: string; type: string } = {
      id: toWalletIdString(walletId),
      name: params.name ? params.name : toWalletNameString(walletId),
      accounts: [],
      nextAccountId: 2,
      encryptedMnemonic: encryptedMnemonic.toString('hex'),
      avatar: params.avatar ? params.avatar : whichAvatar(walletId),
      isImported: false,
      type: WALLET_TYPE_HDWALLET,
    };
    const hdPath = crypto.derivationHdPath(0);
    const t = Date.now();
    const vault = await Vault.fromEncryptedMnemonic(
      hdPath,
      token,
      wallet.encryptedMnemonic
    );
    console.log('vault create time', Date.now() - t);
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
    await this.storage.saveMeta(meta);
    await this.storage.addAccount(wallet.id, account.id, account);
    await this.storage.addWallet(wallet.id, wallet);

    return wallet;
  }

  async getWallets(opts?: { withMnemonic?: boolean }): Promise<Wallet[]> {
    const { withMnemonic = false } = opts ?? {};
    const wallets = [] as Wallet[];
    const storeWallets = await this.storage.getWallets();
    for (const w of storeWallets) {
      const wallet: Wallet = {
        isImported: IsImportedWallet(w),
        ...w,
      };
      if (!withMnemonic) {
        Reflect.deleteProperty(wallet, 'encryptedMnemonic');
      }
      wallets.push(wallet);
    }
    return wallets;
  }

  async getWallet(
    walletId: string,
    opts?: {
      withMnemonic?: boolean;
    }
  ): Promise<Wallet | null> {
    const { withMnemonic = false } = opts ?? {};
    const walletData = await this.storage.getWallet(walletId);
    if (!walletData) {
      return null;
    }
    const wallet: Wallet = {
      isImported: IsImportedWallet(walletData),
      ...walletData,
    };
    // TODO: we don't need to reveal the decrypt mnemonic here.
    if (!withMnemonic && walletData.encryptedMnemonic) {
      Reflect.deleteProperty(wallet, 'encryptedMnemonic');
    }
    return wallet;
  }

  async updateWallet(params: UpdateWalletParams) {
    const { meta, walletId, token } = params;
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
    }
    if (meta.name && meta.name !== wallet.name) {
      wallet.name = meta.name;
      const wallets = await this.storage.getWallets();
      for (const w of wallets) {
        if (w.name === wallet.name) {
          throw new Error('duplicate wallet name');
        }
      }
    }
    if (meta.avatar && meta.avatar !== wallet.avatar) {
      wallet.avatar = meta.avatar;
    }
    if (typeof meta.avatarPfp === 'object') {
      wallet.avatarPfp = {
        name: meta.avatarPfp.name,
        mime: meta.avatarPfp.mime,
        uri: meta.avatarPfp.uri,
        objectId: meta.avatarPfp.objectId,
        expiresAt: meta.avatarPfp.expiresAt,
      };
    }
    return await this.storage.updateWallet(walletId, wallet);
  }

  async deleteWallet(params: DeleteWalletParams) {
    await validateToken(this.storage, params.token);
    // delete all belonging accounts
    const wallet = await this.storage.getWallet(params.walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
    }
    for (const account of wallet.accounts) {
      await this.storage.deleteAccount(wallet.id, account.id);
    }
    await this.storage.deleteWallet(params.walletId);
  }

  async checkMnemonicDuplicated(
    mnemonic: string,
    token: Buffer
  ): Promise<boolean> {
    const wallets = await this.storage.getWallets();
    for (const wallet of wallets) {
      if (IsImportedWallet(wallet)) {
        continue;
      }
      const decryptedMnemonic = crypto.decryptMnemonic(
        token,
        wallet.encryptedMnemonic!
      );
      if (decryptedMnemonic === mnemonic) {
        return true;
      }
    }
    return false;
  }

  async importWallet(params: ImportWalletParams): Promise<Wallet> {
    await validateToken(this.storage, params.token);
    const token = Buffer.from(params.token, 'hex');
    const privateKeyArrayBuffer = Buffer.from(params.private, 'hex');
    let privateKeyPair;
    try {
      privateKeyPair = new elliptic.eddsa('ed25519').keyFromSecret(
        Buffer.from(privateKeyArrayBuffer)
      );
    } catch (e) {
      throw new Error('Imported private key not valid');
    }
    if (await this.checkPrivateDuplicated(privateKeyPair, token)) {
      throw new Error('Private key already exsist');
    }
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password not initialized');
    }
    const walletId = meta.nextWalletId;
    meta.nextWalletId += 1;
    const walletIdStr = toWalletIdString(walletId);
    const accountIdStr = toAccountIdString(walletIdStr, 0);
    const wallet: Wallet & { type: string } = {
      id: toWalletIdString(walletId),
      name: params.name ? params.name : toWalletNameString(walletId),
      accounts: [],
      nextAccountId: 2,
      avatar: params.avatar ? params.avatar : whichAvatar(walletId),
      isImported: true,
      type: WALLET_TYPE_IMPORTED,
    };
    const t = Date.now();
    const encryptedPrivateKey = crypto
      .encryptPrivate(token, privateKeyArrayBuffer)
      .toString('hex');
    const vault = await Vault.fromEncryptedPrivateKey(
      token,
      encryptedPrivateKey
    );
    console.log('vault create time', Date.now() - t);
    // TODO: cache vaults
    const account = {
      id: accountIdStr,
      name: toAccountNameString(wallet.name, 0),
      pubkey: vault.getPublicKey(),
      address: vault.getAddress(),
      encryptedPrivateKey,
    };
    wallet.accounts.push({
      id: account.id,
      address: account.address,
    });

    // TODO: save these states transactionally.
    await this.storage.saveMeta(meta);
    await this.storage.addAccount(wallet.id, account.id, account);
    await this.storage.addWallet(wallet.id, wallet);

    return wallet;
  }

  async checkPrivateDuplicated(
    privateKey: elliptic.eddsa.KeyPair,
    token: Buffer
  ): Promise<boolean> {
    const wallets = await this.storage.getWallets();
    for (const wallet of wallets) {
      if (IsImportedWallet(wallet)) {
        for (const account of wallet.accounts) {
          const accountData = await this.storage.getAccount(account.id);
          if (!accountData) {
            throw new Error(
              `Data inconsistency: wallet ${wallet.id} account ${account.id} not exist`
            );
          }
          if (!isImportedAccount(accountData)) {
            throw new Error(
              `Data inconsistency: account ${account.id} is not imported`
            );
          }
          const decryptedPrivateKey = crypto.decryptPrivate(
            token,
            accountData.encryptedPrivateKey!
          );
          if (
            decryptedPrivateKey.getSecret('hex') === privateKey.getSecret('hex')
          ) {
            return true;
          }
        }
      } else {
        for (const account of wallet.accounts) {
          const accountData = await this.storage.getAccount(account.id);
          if (!accountData) {
            throw new Error(
              `Data inconsistency: wallet ${wallet.id} account ${account.id} not exist`
            );
          }
          if (isImportedAccount(accountData)) {
            throw new Error(
              `Data inconsistency: account ${account.id} is imported`
            );
          }
          const vault = await Vault.fromEncryptedMnemonic(
            accountData.hdPath!,
            token,
            wallet.encryptedMnemonic!
          );
          if (
            vault.getPrivateKey().toString('hex') ===
            privateKey.getSecret('hex')
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

export function toWalletIdString(id: number): string {
  return `wallet-${id}`;
}

export function toWalletNameString(id: number): string {
  return `Wallet #${id}`;
}
