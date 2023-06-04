import * as crypto from '../crypto';
import { IStorage } from '../storage';
import { Buffer } from 'buffer';
import { Vault } from '../vault/Vault';
import { prepareVault } from './vault';

export async function validateToken(storage: IStorage, token: string) {
  if (!token) {
    throw new Error('Auth token is not provided');
  }
  const meta = await storage.loadMeta();
  if (!meta) {
    throw new Error('Meta is not initialized');
  }
  if (!crypto.validateToken(Buffer.from(token, 'hex'), meta.cipher)) {
    throw new Error('Invalid auth token');
  }
}

export type ValidateAccountParams = {
  walletId: string;
  accountId: string;
  storage: IStorage;
  token: string;
};

export async function validateAccount(params: ValidateAccountParams) {
  await validateToken(params.storage, params.token);
  await validateAddress(params);
}

async function validateAddress(params: ValidateAccountParams) {
  const wallet = await params.storage.getWallet(params.walletId);
  if (!wallet) {
    throw new Error(`Wallet ${params.walletId} not initialized`);
  }
  const account = await params.storage.getAccount(params.accountId);
  if (!account) {
    throw new Error(`Account ${params.accountId} not found`);
  }
  const vault = await prepareVault(wallet, account, params.token);
  if (vault.getAddress() !== account.address) {
    throw new Error(
      `Critical: address ${
        account.address
      } not match with expected address ${vault.getAddress()}`
    );
  }
}
