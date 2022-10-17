import { AccountInWallet } from '../api/wallet';

export const WALLET_PREFIX = 'wallet-';

export type Wallet = {
  id: string;
  name: string;
  accounts: AccountInWallet[];
  nextAccountId: number;
  avatar?: string;
  encryptedMnemonic: string;
};

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
  gasFee: number;
  from: string;
  to: string;
  object: T | MoveCallInfo<T>;
  timestamp_ms: number | null;
};

export type TxObject = CoinObject | NftObject | SuiObjectId;

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

export type MoveCallInfo<T = TxObject> = {
  type: 'move_call';
  packageObjectId: string;
  module: string;
  function: string;
  arguments?: string[];
  created: T[];
  mutated: T[];
};

export type SuiObjectId = {
  type: 'object_id';
  id: string;
};
