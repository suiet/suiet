import { Vault } from '../vault/Vault';
import { Account, Wallet } from '../storage/types';

export async function prepareVault(
  wallet: Wallet,
  account: Account,
  token: string
) {
  return await Vault.create(
    account.hdPath,
    Buffer.from(token, 'hex'),
    wallet.encryptedMnemonic
  );
}
