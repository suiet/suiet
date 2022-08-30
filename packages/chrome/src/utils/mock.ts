const mockMnemonic1 = 'seed sock milk update focus rotate barely fade car face mechanic mercy';
const mockMnemonic2 = 'mansion head pool photo forward plug click tired mean menu warrior immense';

export class MockStorage {
  addAccount(walletId: string, accountId: string, account: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  addWallet(id: string, wallet: any): Promise<void> {
    return Promise.resolve(undefined);
  }

  deleteAccount(walletId: string, accountId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getWallet(id: string): Promise<any> {
    return Promise.resolve({
      id: '1',
      name: 'test',
      accounts: [],
      nextAccountId: 2,
      encryptedMnemonic: {
        encryptedHex: '',
        saltHex: '',
      },
    });
  }

  getWallets(): Promise<Array<any>> {
    return Promise.resolve([]);
  }

  loadMeta(): Promise<any> {
    return Promise.resolve({
      nextWalletId: 2,
    });
  }

  saveMeta(meta: any): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export const storage = new MockStorage()

export class MockWallet {
  storage: Storage;
  wallet: any;

  constructor(storage: Storage, wallet: any) {
    this.storage = storage;
    this.wallet = wallet;
  }

  public static async createAndSave(password: string, storage: Storage): Promise<any> {
    const encryptedMnemonic = {
      encryptedHex: '',
      saltHex: '',
    };
    const walletId = 1;
    let wallet = {
      id: 'wallet-' + walletId,
      name: 'name-' + walletId,
      nextAccountId: 0,
      encryptedMnemonic: encryptedMnemonic,
      accounts: []
    }
    return new MockWallet(storage, wallet)
  }
}

export function decryptMnemonic(password: string, encryptedMnemonic: any): string {
  return mockMnemonic1;
}

export function encryptPassword(password: string) {
  return 'abcdefg'
}

function decryptPassword(verifyString: string) {
  return '123456'
}

export function verifyPassword(password: string, verifyString: string) {
  return decryptPassword(verifyString) === password;
}

export async function getWallets() {
  return []
}