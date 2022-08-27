export interface CreateWalletParams {
  token: string;
  mnemonic?: string;
  name?: string;
  avatar?: string;
}

export interface Wallet {
  id: string;
  name: string;
  accounts: Array<string>;
  nextAccountId: number;
  avatar?: string;
}

export interface IWalletApi {
  validateMnemonic: (mnemonic: string) => boolean;
  revealMnemonic: (walletId: string, token: string) => Promise<string>;

  createWallet: (params: CreateWalletParams) => Promise<Wallet>;
  getWallets: () => Promise<Wallet[]>;
  getWallet: (walletId: string) => Promise<Wallet | null>;
  updateWallet: (walletId: string, meta: { name?: string, avatar?: string; }, token: string) => Promise<void>;
  deleteWallet: (walletId: string, token: string) => Promise<void>;
}

export function toWalletIdString(id: number): string {
  return `wallet-${id}`
}

export function toWalletNameString(id: number): string {
  return `Wallet #${id}`
}

