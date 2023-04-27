import { validateToken } from '../../utils/token';
import * as crypto from '../../crypto';
import { Vault } from '../../vault/Vault';
import { IStorage } from '../../storage';
import { toAccountIdString, toAccountNameString } from '../account';
import { Buffer } from 'buffer';
import { whichAvatar } from './utils';
import { prepareVault } from '../../utils/vault';

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
  getWallets: (opts?: { withMnemonic?: boolean }) => Promise<Wallet[]>;
  getWallet: (
    walletId: string,
    opts?: {
      withMnemonic?: boolean;
    }
  ) => Promise<Wallet | null>;
  updateWallet: (params: UpdateWalletParams) => Promise<void>;
  deleteWallet: (walletId: string, token: string) => Promise<void>;
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
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
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
      throw new Error('Wallet not exist');
    }
    const account = await this.storage.getAccount(wallet.accounts[0].id);
    if (!account) {
      throw new Error('Account not exist');
    }
    const vault = await prepareVault(wallet, account, token);
    return vault.hdKey.getPrivateKey().toString('hex');
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
    const wallet: Wallet & { encryptedMnemonic: string } = {
      id: toWalletIdString(walletId),
      name: params.name ? params.name : toWalletNameString(walletId),
      accounts: [],
      nextAccountId: 2,
      encryptedMnemonic: encryptedMnemonic.toString('hex'),
      avatar: params.avatar ? params.avatar : whichAvatar(walletId),
    };
    const hdPath = crypto.derivationHdPath(0);
    const t = Date.now();
    const vault = await Vault.create(hdPath, token, wallet.encryptedMnemonic);
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
    const wallets = await this.storage.getWallets();
    if (!withMnemonic) {
      wallets.forEach((wallet) => {
        if (wallet.encryptedMnemonic) {
          Reflect.deleteProperty(wallet, 'encryptedMnemonic');
        }
      });
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
    // TODO: we don't need to reveal the decrypt mnemonic here.
    if (!withMnemonic && walletData.encryptedMnemonic) {
      Reflect.deleteProperty(walletData, 'encryptedMnemonic');
    }
    return walletData;
  }

  async updateWallet(params: UpdateWalletParams) {
    const { meta, walletId, token } = params;
    await validateToken(this.storage, token);
    const wallet = await this.storage.getWallet(walletId);
    if (!wallet) {
      throw new Error('Wallet not exist');
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

  async checkMnemonicDuplicated(
    mnemonic: string,
    token: Buffer
  ): Promise<boolean> {
    const wallets = await this.storage.getWallets();
    for (const wallet of wallets) {
      const decryptedMnemonic = crypto.decryptMnemonic(
        token,
        wallet.encryptedMnemonic
      );
      if (decryptedMnemonic === mnemonic) {
        return true;
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
