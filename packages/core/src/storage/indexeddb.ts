import { Account, GlobalMeta, Wallet } from "./types";
import { Storage } from "./Storage";

const GLOBAL_META_ID = 'suiet-meta';

enum StoreName {
  META = 'meta',
  WALLETS = 'wallets',
  ACCOUNTS = 'accounts',
}

export class IndexedDBStorage implements Storage {
  private readonly connection: Promise<IDBDatabase>;

  constructor() {
    this.connection = new Promise((resolve, reject) => {
      const request = indexedDB.open('Suiet', 4);

      request.onerror = (event) => {
        console.error(event);
        reject(new Error('Failed to create indexedDB'));
      }
      request.onupgradeneeded = (event) => {
        // console.log('onupgradeneeded', event, request.result)
        IndexedDBStorage.init(request.result);
      }
      request.onsuccess = (event) => {
        // console.log('onsuccess', event, request.result)
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
          .add(wallet, id);

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
    return this.addWallet(id, wallet);
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
          .add({ walletId, account }, accountId);

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
    return this.addAccount(walletId, accountId, account)
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
              const account = getWalletRequest.result as Account;
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

  getAccount(walletId: string, accountId: string): Promise<Account | null> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
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
        const request = db.transaction([StoreName.META], 'readwrite')
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

  private cleanupAccount(
    transaction: IDBTransaction,
    wallet: Wallet,
    accountId: string,
  ): void {
    wallet.accounts = wallet.accounts.filter((aId) => aId !== accountId);
    transaction.objectStore(StoreName.WALLETS).put(wallet, wallet.id);
    transaction.objectStore(StoreName.ACCOUNTS).delete(accountId);
  }
}

export default new IndexedDBStorage();