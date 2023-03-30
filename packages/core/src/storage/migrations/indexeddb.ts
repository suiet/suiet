import { Account } from '../types';
import { isNonEmptyArray } from '../../utils';
import { StoreName } from '../constants';
import {
  SIGNATURE_SCHEME_TO_FLAG,
  SUI_ADDRESS_LENGTH,
  normalizeSuiAddress,
} from '@mysten/sui.js';
import { blake2b } from '@noble/hashes/blake2b';

export type MigrationMethod = (
  db: IDBDatabase,
  oldVersion: number,
  newVersion: number
) => Promise<void>;

async function getWallets(db: IDBDatabase): Promise<any[]> {
  return await new Promise((resolve, reject) => {
    const request = db
      .transaction([StoreName.WALLETS])
      .objectStore(StoreName.WALLETS)
      .getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

async function getAccount(
  db: IDBDatabase,
  accountId: string
): Promise<Account | null> {
  return await new Promise((resolve, reject) => {
    const request = db
      .transaction([StoreName.ACCOUNTS])
      .objectStore(StoreName.ACCOUNTS)
      .get(accountId);

    request.onsuccess = (event) => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

/**
 * version 0 -> 1
 * 1. account in wallet data change from Array<string> to Array<{id: string, address: string}>
 */
const migrateFrom0To1: MigrationMethod = async (db, oldVersion, newVersion) => {
  console.debug('[db migration] >>> version 0 -> 1, started');

  const wallets = await getWallets(db);
  console.debug('[db migration] get all wallets', wallets);
  if (!isNonEmptyArray(wallets)) {
    console.debug('[db migration] <<< wallets are empty, migration finished');
    return;
  }

  const walletListThatNeedsUpgrade: any[] = [];
  for (const wallet of wallets) {
    if (!isNonEmptyArray(wallet.accounts)) {
      console.debug(
        `[db migration] wallet has no accounts, continue. walletId=${wallet.id}`
      );
      continue;
    }

    let isNeedToUpdate = false;
    for (let i = 0, len = wallet.accounts.length; i < len; i++) {
      const account = wallet.accounts[i];
      if (typeof account === 'string') {
        isNeedToUpdate = true;
        // account is just accountId string, need to change to {id: string, address: string}
        const accountData = await getAccount(db, account);
        if (!accountData) {
          console.debug(
            `[db migration] warning: account data is not found. walletId=${wallet.id} accountId=${account}`
          );
          continue;
        }
        wallet.accounts[i] = {
          id: accountData.id,
          address: accountData.address,
        };
      }
    }
    if (isNeedToUpdate) {
      walletListThatNeedsUpgrade.push(wallet);
    }
  }
  if (!isNonEmptyArray(walletListThatNeedsUpgrade)) {
    console.debug(
      '[db migration] <<< no wallet needs to upgrade, migration finished.'
    );
    return;
  }

  console.debug(
    '[db migration] wallets that needs to upgrade',
    walletListThatNeedsUpgrade
  );
  const walletBulkUpgradeTx = db.transaction([StoreName.WALLETS], 'readwrite');
  const walletStore = walletBulkUpgradeTx.objectStore(StoreName.WALLETS);
  for (const updatedWallet of walletListThatNeedsUpgrade) {
    walletStore.put(updatedWallet);
  }
  walletBulkUpgradeTx.oncomplete = (e) => {
    console.debug(
      `[db migration] <<< WalletBulkUpgradeTx succeeded! Welcome to new version ${newVersion} !`
    );
  };
  walletBulkUpgradeTx.onerror = (e) => {
    console.error('[db migration] <<< WalletBulkUpgradeTx failed!', e);
  };
};

/**
 * version 1 -> 2
 * 1. account in wallet data change from Array<string> to Array<{id: string, address: string}>
 */
const migrateFrom1To2: MigrationMethod = async (db, oldVersion, newVersion) => {
  console.debug('[db migration] >>> version 1 -> 2, started');

  const wallets = await getWallets(db);
  console.debug('[db migration] get all wallets', wallets);
  if (!isNonEmptyArray(wallets)) {
    console.debug('[db migration] <<< wallets are empty, migration finished');
    return;
  }

  const newWalletList: any[] = [];
  const newAccountList: any[] = [];
  for (const wallet of wallets) {
    if (!isNonEmptyArray(wallet.accounts)) {
      console.debug(
        `[db migration] wallet has no accounts, continue. walletId=${wallet.id}`
      );
      continue;
    }

    for (let i = 0, len = wallet.accounts.length; i < len; i++) {
      const account = wallet.accounts[i];
      // debugger;
      // account is just accountId string, need to change to {id: string, address: string}
      const accountData = await getAccount(db, account.id);
      if (!accountData) {
        console.debug(
          `[db migration] warning: account data is not found. walletId=${wallet.id} accountId=${account}`
        );
        continue;
      }
      const pubkey = Uint8Array.from(
        Buffer.from(accountData.pubkey.substring(2), 'hex')
      );
      const keyWithPrefix = new Uint8Array(32 + 1);
      keyWithPrefix.set([SIGNATURE_SCHEME_TO_FLAG['ED25519']]);
      keyWithPrefix.set(pubkey, 1);

      const publicHash = blake2b(keyWithPrefix, { dkLen: 32 });
      accountData.address = normalizeSuiAddress(
        Buffer.from(publicHash.slice(0, SUI_ADDRESS_LENGTH * 2)).toString('hex')
      );
      wallet.accounts[i] = {
        id: accountData.id,
        address: accountData.address,
      };
      newAccountList.push(accountData);
    }
    newWalletList.push(wallet);
  }

  console.debug('[db migration] wallets that needs to upgrade', newWalletList);
  console.debug(
    '[db migration] accounts that needs to upgrade',
    newAccountList
  );
  const bulkUpgradeTx = db.transaction(
    [StoreName.WALLETS, StoreName.ACCOUNTS],
    'readwrite'
  );
  const walletStore = bulkUpgradeTx.objectStore(StoreName.WALLETS);
  for (const updatedWallet of newWalletList) {
    walletStore.put(updatedWallet);
  }
  const accountStore = bulkUpgradeTx.objectStore(StoreName.ACCOUNTS);
  for (const updatedAccount of newAccountList) {
    accountStore.put(updatedAccount);
  }
  bulkUpgradeTx.oncomplete = (e) => {
    console.debug(
      `[db migration] <<< BulkUpgradeTx succeeded! Welcome to new version ${newVersion} !`
    );
  };
  bulkUpgradeTx.onerror = (e) => {
    console.error('[db migration] <<< BulkUpgradeTx failed!', e);
  };
};

export default new Map<string, MigrationMethod>([
  ['0->1', migrateFrom0To1],
  ['1->2', migrateFrom1To2],
]);
