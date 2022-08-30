import { Account, GlobalMeta, Wallet } from "./types";
import { Storage } from "./Storage";

const GLOBAL_META_ID = 'suiet-meta';
const DB_NAME = 'Suiet'
const DB_VERSION = 4

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

  static openDbConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error(event);
        reject(new Error('Failed to create indexedDB'));
      }
      request.onupgradeneeded = (event) => {
        IndexedDBStorage.init(request.result);
      }
      request.onsuccess = (event) => {
        resolve(request.result);
      }
    })
  }

  static init(db: IDBDatabase) {
    db.createObjectStore(StoreName.META, { keyPath: 'id' });
    db.createObjectStore(StoreName.WALLETS, { keyPath: 'id' });
    db.createObjectStore(StoreName.ACCOUNTS, { keyPath: 'id' });
  }

  addWallet(id: string, wallet: Wallet): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.WALLETS], 'readwrite')
          .objectStore(StoreName.WALLETS)
          .add(wallet);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  updateWallet(id: string, wallet: Wallet): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.WALLETS], 'readwrite')
          .objectStore(StoreName.WALLETS)
          .put(wallet);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  deleteWallet(id: string): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.WALLETS], 'readwrite')
          .objectStore(StoreName.WALLETS)
          .delete(id);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  getWallet(id: string): Promise<Wallet> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.WALLETS])
          .objectStore(StoreName.WALLETS)
          .get(id);

        request.onsuccess = (event) => {
          resolve(request.result);
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  getWallets(): Promise<Array<Wallet>> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.WALLETS])
          .objectStore(StoreName.WALLETS)
          .getAll();

        request.onsuccess = (event) => {
          resolve(request.result);
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  addAccount(walletId: string, accountId: string, account: Account): Promise<void> {
    // TODO: wallet and account should be updated with atomicity.
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.ACCOUNTS], 'readwrite')
          .objectStore(StoreName.ACCOUNTS)
          .add(account);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  updateAccount(walletId: string, accountId: string, account: Account): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.ACCOUNTS], 'readwrite')
          .objectStore(StoreName.ACCOUNTS)
          .put(account);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  deleteAccount(walletId: string, accountId: string): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const transaction = db.transaction([
          StoreName.ACCOUNTS,
          StoreName.WALLETS
        ], 'readwrite')
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
          if (typeof wallet === 'undefined' || !wallet.accounts.includes(accountId)) {
            reject(new Error('Failed to remove account, wallet or account not found.'));
          }
          this.cleanupAccount(transaction, wallet, accountId);
        }
      })
    );
  }

  getAccounts(walletId: string): Promise<Account[]> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const transaction = db.transaction([
          StoreName.ACCOUNTS,
          StoreName.WALLETS
        ], 'readonly')
        let accounts: Array<Account> = [];
        const walletStore = transaction.objectStore(StoreName.WALLETS);
        const accountStore = transaction.objectStore(StoreName.ACCOUNTS);
        const getWalletRequest = walletStore.get(walletId);
        getWalletRequest.onsuccess = (event) => {
          const wallet = getWalletRequest.result as Wallet;
          if (typeof wallet === 'undefined') {
            reject(new Error('Failed to get accounts, wallet not found.'));
          }
          wallet.accounts.forEach((aId) => {
            const getAccountRequest = accountStore.get(aId);
            getAccountRequest.onsuccess = (event) => {
              const account = getAccountRequest.result as Account;
              if (typeof wallet === 'undefined') {
                reject(new Error('Failed to get accounts, data potentially inconsistent.'));
              }
              accounts.push(account);
            }
          });
        }

        transaction.onerror = (event) => {
          reject(new Error('Failed to get accounts'));
        };
        transaction.oncomplete = (event) => {
          resolve(accounts);
        };

      })
    );
  }

  getAccount(accountId: string): Promise<Account | null> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        console.log('accountId', accountId)
        const request = db.transaction([StoreName.ACCOUNTS])
          .objectStore(StoreName.ACCOUNTS)
          .get(accountId);

        request.onsuccess = (event) => {
          resolve(request.result);
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  loadMeta(): Promise<GlobalMeta> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.META])
          .objectStore(StoreName.META)
          .get(GLOBAL_META_ID);

        request.onsuccess = (event) => {
          resolve(request.result);
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  saveMeta(meta: GlobalMeta): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const transaction = db.transaction([StoreName.META], 'readwrite')
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
        }
        transaction.oncomplete = (event) => {
          resolve();
        }
        transaction.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  clearMeta(): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.META], 'readwrite')
          .objectStore(StoreName.META)
          .delete(GLOBAL_META_ID);

        request.onsuccess = (event) => {
          resolve(request.result);
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
  }

  reset(): Promise<void> {
    return this.connection.then(
      (db) =>
        new Promise((resolve, reject) => {
          db.close();
          const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
          deleteRequest.onerror = (event) => {
            reject(new Error('Failed to delete db.'));
          };
          deleteRequest.onsuccess = (event) => {
            console.log('db deleted', event)
            resolve();
          };
        })
    );
  }

  private cleanupAccount(
    transaction: IDBTransaction,
    wallet: Wallet,
    accountId: string,
  ): void {
    wallet.accounts = wallet.accounts.filter((aId) => aId !== accountId);
    transaction.objectStore(StoreName.WALLETS).put(wallet);
    transaction.objectStore(StoreName.ACCOUNTS).delete(accountId);
  }
}

export default new IndexedDBStorage();