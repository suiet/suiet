import {Account, GlobalMeta, Wallet} from "./types";
import {Storage} from "./Storage";

const GLOBAL_META_ID = 'GLOBAL_META_ID';

enum StoreName {
  GLOBAL_META = 'global_meta',
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
    db.createObjectStore(StoreName.GLOBAL_META, {keyPath: 'id'});
    db.createObjectStore(StoreName.WALLETS, {keyPath: 'id'});
    db.createObjectStore(StoreName.ACCOUNTS, {keyPath: 'id'});
  }

  addAccount(walletId: string, accountId: string, account: Account): Promise<void> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.ACCOUNTS], 'readwrite')
          .objectStore(StoreName.ACCOUNTS)
          .add({walletId, account}, accountId);

        request.onsuccess = (event) => {
          resolve();
        }
        request.onerror = (event) => {
          reject(event);
        }
      })
    );
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

  loadMeta(): Promise<GlobalMeta> {
    return this.connection.then(
      (db) => new Promise((resolve, reject) => {
        const request = db.transaction([StoreName.GLOBAL_META], 'readwrite')
          .objectStore(StoreName.GLOBAL_META)
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
        const transaction = db.transaction([StoreName.GLOBAL_META], 'readwrite')
        const metaStore = transaction.objectStore(StoreName.GLOBAL_META);

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