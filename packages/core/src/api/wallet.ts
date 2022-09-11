import { validateToken } from '../utils/token';
import * as crypto from '../crypto';
import { Vault } from '../vault/Vault';
import { Storage } from '../storage/Storage';
import { toAccountIdString, toAccountNameString } from './account';
import { Buffer } from 'buffer';

export type CreateWalletParams = {
  token: string;
  mnemonic?: string;
  private?: string;
  name?: string;
  avatar?: string;
};

export type UpdateWalletParams = {
  walletId: string;
  meta: { name?: string; avatar?: string };
  token: string;
};

export type RevealMnemonicParams = {
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
};

export interface IWalletApi {
  validateMnemonic: (mnemonic: string) => boolean;
  revealMnemonic: (params: RevealMnemonicParams) => Promise<string>;
  revealPrivate: (params: RevealPrivateKeyParams) => Promise<string>;

  createWallet: (params: CreateWalletParams) => Promise<Wallet>;
  getWallets: () => Promise<Wallet[]>;
  getWallet: (walletId: string) => Promise<Wallet | null>;
  updateWallet: (params: UpdateWalletParams) => Promise<void>;
  deleteWallet: (walletId: string, token: string) => Promise<void>;
}

export class WalletApi implements IWalletApi {
  storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
    // console.log('WalletApi storage', this.storage);
  }

  // Implement Wallet API
  validateMnemonic(mnemonic: string): boolean {
    return crypto.validateMnemonic(mnemonic);
  }

  async revealMnemonic(params: RevealMnemonicParams): Promise<string> {
    const { walletId, token } = params;
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet Not Exist');
    }
    return crypto.decryptMnemonic(
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic
    );
  }

  async revealPrivate(params: RevealPrivateKeyParams): Promise<string> {
    const { walletId, token } = params;
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet Not Exist');
    }
    const mnemonic = crypto.decryptMnemonic(
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic
    );
    return crypto.mnemonicToEntropy(mnemonic).toString('hex');
  }

  async createWallet(params: CreateWalletParams): Promise<Wallet> {
    await validateToken(this.storage, params.token);
    let mnemonic;
    if (params.mnemonic) {
      mnemonic = params.mnemonic;
    } else if (params.private) {
      mnemonic = crypto.entropyToMnemonic(Buffer.from(params.private, 'hex'));
    } else {
      mnemonic = crypto.generateMnemonic();
    }
    const token = Buffer.from(params.token, 'hex');
    const encryptedMnemonic = crypto.encryptMnemonic(token, mnemonic);
    const meta = await this.storage.loadMeta();
    if (!meta) {
      throw new Error('Password not initialized');
    }
    const walletId = meta.nextWalletId;
    meta.nextWalletId += 1;
    const walletIdStr = toWalletIdString(walletId);
    const accountIdStr = toAccountIdString(walletIdStr, 0);
    const wallet: Wallet & { encryptedMnemonic: string } = {
      id: toWalletIdString(walletId),
      name: params.name ? params.name : toWalletNameString(walletId),
      accounts: [],
      nextAccountId: 2,
      encryptedMnemonic: encryptedMnemonic.toString('hex'),
      avatar: params.avatar ? params.avatar : undefined,
    };
    const hdPath = crypto.derivationHdPath(0);
    const vault = await Vault.create(hdPath, token, wallet.encryptedMnemonic);
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

  async getWallets(): Promise<Wallet[]> {
    return await this.storage.getWallets();
  }

  async getWallet(walletId: string): Promise<Wallet | null> {
    return await this.storage.getWallet(walletId);
  }

  async updateWallet(params: UpdateWalletParams) {
    const { meta, walletId, token } = params;
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet Not Exist');
    }
    if (meta.name) {
      wallet.name = meta.name;
    }
    if (meta.avatar) {
      wallet.avatar = meta.avatar;
    }
    return await this.storage.updateWallet(walletId, wallet);
  }

  async deleteWallet(walletId: string, token: string) {
    await validateToken(this.storage, token);
    return await this.storage.deleteWallet(walletId);
  }
}

export function toWalletIdString(id: number): string {
  return `wallet-${id}`;
}

export function toWalletNameString(id: number): string {
  return `Wallet #${id}`;
}
