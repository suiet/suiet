import { Account, GlobalMeta, Wallet } from './types';
import { Storage } from './Storage';

const GLOBAL_META_ID = 'suiet-meta';
const DB_NAME = 'Suiet';
const DB_VERSION = 4;

enum StoreName {
  META = 'meta',
  WALLETS = 'wallets',
  ACCOUNTS = 'accounts',
}

export class IndexedDBStorage implements Storage {
  private readonly connection: Promise<IDBDatabase>;

  constructor() {
    this.connection = IndexedDBStorage.openDbConnection();
  }

  public static async openDbConnection(): Promise<IDBDatabase> {
    return await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error(event);
        reject(new Error('Failed to create indexedDB'));
      };
      request.onupgradeneeded = (event) => {
        IndexedDBStorage.init(request.result);
      };
      request.onsuccess = (event) => {
        resolve(request.result);
      };
    });
  }

  private static init(db: IDBDatabase) {
    db.createObjectStore(StoreName.META, { keyPath: 'id' });
    db.createObjectStore(StoreName.WALLETS, { keyPath: 'id' });
    db.createObjectStore(StoreName.ACCOUNTS, { keyPath: 'id' });
  }

  async addWallet(id: string, wallet: Wallet): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.WALLETS], 'readwrite')
            .objectStore(StoreName.WALLETS)
            .add(wallet);

          request.onsuccess = (event) => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async updateWallet(id: string, wallet: Wallet): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.WALLETS], 'readwrite')
            .objectStore(StoreName.WALLETS)
            .put(wallet);

          request.onsuccess = (event) => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async deleteWallet(id: string): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.WALLETS], 'readwrite')
            .objectStore(StoreName.WALLETS)
            .delete(id);

          request.onsuccess = (event) => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async getWallet(id: string): Promise<Wallet> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.WALLETS])
            .objectStore(StoreName.WALLETS)
            .get(id);

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async getWallets(): Promise<Wallet[]> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.WALLETS])
            .objectStore(StoreName.WALLETS)
            .getAll();

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async addAccount(
    walletId: string,
    accountId: string,
    account: Account
  ): Promise<void> {
    // TODO: wallet and account should be updated with atomicity.
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.ACCOUNTS], 'readwrite')
            .objectStore(StoreName.ACCOUNTS)
            .add(account);

          request.onsuccess = (event) => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async updateAccount(
    walletId: string,
    accountId: string,
    account: Account
  ): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.ACCOUNTS], 'readwrite')
            .objectStore(StoreName.ACCOUNTS)
            .put(account);

          request.onsuccess = (event) => {
            resolve();
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async deleteAccount(walletId: string, accountId: string): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(
            [StoreName.ACCOUNTS, StoreName.WALLETS],
            'readwrite'
          );
          transaction.onerror = (event) => {
            reject(new Error('Failed to remove account.'));
          };
          transaction.oncomplete = (event) => {
            resolve();
          };

          const walletStore = transaction.objectStore(StoreName.WALLETS);
          const getWalletRequest = walletStore.get(walletId);
          getWalletRequest.onsuccess = (event) => {
            const wallet = getWalletRequest.result as Wallet;
            if (
              typeof wallet === 'undefined' ||
              !wallet.accounts.find((ac) => ac.id === accountId)
            ) {
              reject(
                new Error(
                  'Failed to remove account, wallet or account not found.'
                )
              );
            }
            this.cleanupAccount(transaction, wallet, accountId);
          };
        })
    );
  }

  async getAccounts(walletId: string): Promise<Account[]> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(
            [StoreName.ACCOUNTS, StoreName.WALLETS],
            'readonly'
          );
          const accounts: Account[] = [];
          const walletStore = transaction.objectStore(StoreName.WALLETS);
          const accountStore = transaction.objectStore(StoreName.ACCOUNTS);
          const getWalletRequest = walletStore.get(walletId);
          getWalletRequest.onsuccess = (event) => {
            const wallet = getWalletRequest.result as Wallet;
            if (typeof wallet === 'undefined') {
              reject(new Error('Failed to get accounts, wallet not found.'));
            }
            wallet.accounts.forEach((ac) => {
              const getAccountRequest = accountStore.get(ac.id);
              getAccountRequest.onsuccess = (event) => {
                const account = getAccountRequest.result as Account;
                if (typeof wallet === 'undefined') {
                  reject(
                    new Error(
                      'Failed to get accounts, data potentially inconsistent.'
                    )
                  );
                }
                accounts.push(account);
              };
            });
          };

          transaction.onerror = (event) => {
            reject(new Error('Failed to get accounts'));
          };
          transaction.oncomplete = (event) => {
            resolve(accounts);
          };
        })
    );
  }

  async getAccount(accountId: string): Promise<Account | null> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
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
        })
    );
  }

  async loadMeta(): Promise<GlobalMeta> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.META])
            .objectStore(StoreName.META)
            .get(GLOBAL_META_ID);

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async saveMeta(meta: GlobalMeta): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const transaction = db.transaction([StoreName.META], 'readwrite');
          const metaStore = transaction.objectStore(StoreName.META);

          const existedRequest = metaStore.get(GLOBAL_META_ID);
          existedRequest.onsuccess = (event) => {
            const currentMeta = existedRequest.result;
            if (currentMeta) {
              metaStore.put({
                ...currentMeta,
                ...meta,
              });
            } else {
              metaStore.add({
                id: GLOBAL_META_ID,
                ...meta,
              });
            }
          };
          transaction.oncomplete = (event) => {
            resolve();
          };
          transaction.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async clearMeta(): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const request = db
            .transaction([StoreName.META], 'readwrite')
            .objectStore(StoreName.META)
            .delete(GLOBAL_META_ID);

          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  async reset(): Promise<void> {
    return await this.connection.then(
      async (db) =>
        await new Promise((resolve, reject) => {
          const transaction = db.transaction(
            [StoreName.META, StoreName.WALLETS, StoreName.ACCOUNTS],
            'readwrite'
          );
          transaction.objectStore(StoreName.META).clear();
          transaction.objectStore(StoreName.WALLETS).clear();
          transaction.objectStore(StoreName.ACCOUNTS).clear();
          transaction.oncomplete = (event) => {
            console.log('clear db success');
            resolve();
          };
          transaction.onerror = (event) => {
            reject(event);
          };
        })
    );
  }

  private cleanupAccount(
    transaction: IDBTransaction,
    wallet: Wallet,
    accountId: string
  ): void {
    wallet.accounts = wallet.accounts.filter((ac) => ac.id !== accountId);
    transaction.objectStore(StoreName.WALLETS).put(wallet);
    transaction.objectStore(StoreName.ACCOUNTS).delete(accountId);
  }
}

export default new IndexedDBStorage();
