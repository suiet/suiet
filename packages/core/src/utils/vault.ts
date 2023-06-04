import { Vault } from '../vault/Vault';
import {
  Account,
  IsImportedWallet,
  Wallet,
  isImportedAccount,
} from '../storage/types';
import {
  Ed25519PublicKey,
  ExportedKeypair,
  Keypair,
  PublicKey,
  SignatureScheme,
} from '@mysten/sui.js';

export async function prepareVault(
  wallet: Wallet,
  account: Account,
  token: string
) {
  if (isImportedAccount(account) && IsImportedWallet(wallet)) {
    return await Vault.fromEncryptedPrivateKey(
      Buffer.from(token, 'hex'),
      account.encryptedPrivateKey!
    );
  } else {
    return await Vault.fromEncryptedMnemonic(
      account.hdPath!,
      Buffer.from(token, 'hex'),
      wallet.encryptedMnemonic!
    );
  }
}

export function createKeypair(vault: Vault): Keypair {
  return {
    export(): ExportedKeypair {
      return {
        schema: 'ED25519',
        privateKey: vault.key.getPrivateKey().toString('hex'),
      };
    },
    getKeyScheme(): SignatureScheme {
      return 'ED25519';
    },
    getPublicKey(): PublicKey {
      return new Ed25519PublicKey(vault.key.getPublicKey());
    },
    signData(data: Uint8Array): Uint8Array {
      const buffer = Buffer.from(data);
      return new Uint8Array(vault.key.sign(buffer));
    },
  };
}
