import { ExecutionStatusType } from '@mysten/sui.js';
import { AccountInWallet, AvatarPfp } from '../api/wallet';

export const WALLET_PREFIX = 'wallet-';
export const WALLET_TYPE_HDWALLET = '';
export const WALLET_TYPE_IMPORTED = 'imported';

export type Wallet = {
  id: string;
  name: string;
  type: string;
  accounts: AccountInWallet[];
  nextAccountId: number;
  avatar?: string;
  encryptedMnemonic?: string;
  avatarPfp?: AvatarPfp;
};

export function IsImportedWallet(wallet: Wallet): boolean {
  if (!wallet.encryptedMnemonic) {
    return true;
  }
  return false;
}

export type Account = {
  id: string;
  name: string;
  pubkey: string;
  address: string;
  hdPath?: string;
  encryptedPrivateKey?: string;
};

export function isImportedAccount(account: Account): boolean {
  if (!account.hdPath && account.encryptedPrivateKey) {
    return true;
  }
  return false;
}

export type GlobalMeta = {
  nextWalletId: number;
  cipher: Cipher;
  clientId?: string;
  biometricData?: BiometricData;
  dataVersion: number;
};

export type Cipher = {
  data: string;
  salt: string;
};

export type BiometricData = {
  credentialIdBase64: string;
  publicKeyBase64: string;
  encryptedToken: string;
};

export type TxnHistoryEntry<T = TxObject> = {
  txStatus?: ExecutionStatusType;
  transactionDigest: string;
  gasFee: number;
  from: string;
  to: string;
  object: T | MoveCallInfo<T>;
  timestamp_ms: number | null | undefined;
};

export type TxObject = CoinObject | NftObject | ObjectId;

export type CoinObject = {
  type: 'coin';
  symbol: string;
  balance: string;
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
  created?: T[];
  // If object type is nft, it represents the nft was deleted. If object type is coin, it represents the coin balance was changed.
  changedOrDeleted?: T[];
};

export type ObjectId = {
  type: 'object_id';
  id: string;
};
