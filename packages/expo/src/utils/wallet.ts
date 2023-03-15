import AsyncStorage, { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

export interface Wallet {
  address: string;
  name: string;
  avatar: number;
}

// export class WalletManager {
//   constructor(private _wallets: Wallet[]) {}

//   static fromJSON(json: string | null): WalletManager {
//     if (json === null) {
//       return new WalletManager([]);
//     }
//     const wallets = JSON.parse(json);
//     return new WalletManager(wallets);
//   }

//   toJSON(): string {
//     return JSON.stringify(this._wallets);
//   }

//   static async fromStorage(storage: AsyncStorageStatic = AsyncStorage): Promise<WalletManager> {
//     const json = await storage.getItem('wallets');
//     return WalletManager.fromJSON(json);
//   }

//   save(storage: AsyncStorageStatic = AsyncStorage) {
//     return storage.setItem('wallets', this.toJSON());
//   }

//   get wallets(): Wallet[] {
//     return this._wallets;
//   }

//   put(wallet: Wallet) {
//     // do a check to see if the wallet already exists
//     for (const w of this._wallets) {
//       if (w.address === wallet.address) {
//         // update the wallet
//         Object.assign(w, wallet);
//         return;
//       }
//     }

//     this._wallets.push(wallet);
//   }

//   get(address: string): Wallet | undefined {
//     return this._wallets.find((w) => w.address === address);
//   }

//   remove(address: string) {
//     this._wallets = this._wallets.filter((w) => w.address !== address);
//   }
// }
