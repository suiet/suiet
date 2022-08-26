export interface CreateWalletParams {
  password: string;
  mnemonic?: string;
  name?: string;
  avatar?: string;
}

export interface Wallet {
  id: string;
  name: string;
  accounts: Array<string>;
  nextAccountIds: Record<string, number>; // purpose + cointype => index
  avatar?: string;
}

export interface IWalletApi {
  generateMnemonic: () => Promise<string>;
  validateMnemonic: (mnemonic: string) => Promise<void>;
  revealMnemonic: (walletId: string, password: string) => Promise<string>;

  createWallet: (params: CreateWalletParams) => Promise<Wallet>;
  validateWalletNumber: () => Promise<void>;
  getWallets: () => Promise<Wallet[]>;
  getWallet: (walletId: string) => Promise<Wallet>;
  updateWallet: (walletId: string, meta: { name?: string, avatar?: string; }) => Promise<void>;
  deleteWallet: (walletId: string) => Promise<void>;
}