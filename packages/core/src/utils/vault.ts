import { Vault } from '../vault/Vault';
import { Account, Wallet } from '../storage/types';
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
  return await Vault.create(
    account.hdPath,
    Buffer.from(token, 'hex'),
    wallet.encryptedMnemonic
  );
}

export function createKeypair(vault: Vault): Keypair {
  return {
    export(): ExportedKeypair {
      return {
        schema: 'ED25519',
        privateKey: vault.hdKey.getPrivateKey().toString('hex'),
      };
    },
    getKeyScheme(): SignatureScheme {
      return 'ED25519';
    },
    getPublicKey(): PublicKey {
      return new Ed25519PublicKey(vault.hdKey.getPublicKey());
    },
    signData(data: Uint8Array): Uint8Array {
      const buffer = Buffer.from(data);
      return new Uint8Array(vault.hdKey.sign(buffer));
    },
  };
}
