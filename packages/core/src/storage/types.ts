import { Wallet as IWallet } from '../api/wallet';

export const WALLET_PREFIX = 'wallet-';

export interface Wallet extends IWallet {
  encryptedMnemonic: string;
}

export type Account = {
  id: string;
  name: string;
  pubkey: string;
  address: string;
  hdPath: string;
};

export type GlobalMeta = {
  nextWalletId: number;
  cipher: Cipher;
  dataVersion: number;
};

export type Cipher = {
  data: string;
  salt: string;
};

export type TxnHistoryEntry<T = TxObject> = {
  txStatus: 'success' | 'failure';
  transactionDigest: string;
  gasUsed: number;
  from: string;
  to: string;
  object: T;
  timestamp_ms: number | null;
};

export type TxObject = CoinObject | NftObject;

export type CoinObject = {
  type: 'coin';
  symbol: string;
  balance: bigint;
};

export type NftObject = {
  type: 'nft';
  name: string;
  description: string;
  url: string;
};
