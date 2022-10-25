import { Account } from '../types';
import { isNonEmptyArray } from '../../utils';
import { StoreName } from '../constants';
import { derivationHdPath } from '../../crypto';

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

async function getAccounts(db: IDBDatabase): Promise<Account[]> {
  return await new Promise((resolve, reject) => {
    const request = db
      .transaction([StoreName.ACCOUNTS])
      .objectStore(StoreName.ACCOUNTS)
      .getAll();

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
 * 1. update account hd path from m/44'/784'/${id}' to m/44'/784'/0'/0'/${id}'
 */
const migrateFrom1To2: MigrationMethod = async (db, oldVersion, newVersion) => {
  console.debug('[db migration] >>> version 1 -> 2, started');

  const accounts = await getAccounts(db);
  console.debug('[db migration] get all accounts', accounts);
  if (!isNonEmptyArray(accounts)) {
    console.debug('[db migration] <<< accounts are empty, migration finished');
    return;
  }

  const accountListThatNeedsUpgrade: any[] = [];
  for (const account of accounts) {
    if (account.hdPath.split('/').length === 4) {
      const res = account.hdPath.match(/m\/44'\/784'\/(\d+)'/);
      if (!res) {
        console.debug(
          `[db migration] account hd path is invalid. accountId=${account.id}`
        );
        continue;
      }
      account.hdPath = derivationHdPath(+res[1]);
      accountListThatNeedsUpgrade.push(account);
    }
    if (!isNonEmptyArray(accountListThatNeedsUpgrade)) {
      console.debug(
        '[db migration] <<< no account needs to upgrade, migration finished.'
      );
      return;
    }

    console.debug(
      '[db migration] accounts that needs to upgrade',
      accountListThatNeedsUpgrade
    );
    const accountBulkUpgradeTx = db.transaction(
      [StoreName.ACCOUNTS],
      'readwrite'
    );
    const accountStore = accountBulkUpgradeTx.objectStore(StoreName.ACCOUNTS);
    for (const updatedAccount of accountListThatNeedsUpgrade) {
      accountStore.put(updatedAccount);
    }
    accountBulkUpgradeTx.oncomplete = (e) => {
      console.debug(
        `[db migration] <<< AccountBulkUpgradeTx succeeded! Welcome to new version ${newVersion} !`
      );
    };
    accountBulkUpgradeTx.onerror = (e) => {
      console.error('[db migration] <<< AccountBulkUpgradeTx failed!', e);
    };
  }
};

export default new Map<string, MigrationMethod>([
  ['0->1', migrateFrom0To1],
  ['1->2', migrateFrom1To2],
]);
