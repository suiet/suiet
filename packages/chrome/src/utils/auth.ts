// import storage from "./storage";

enum StorageKey {
  PASSWORD = 'PASSWORD',
  WALLETS = 'WALLETS'
}

export async function fetchPassword(): Promise<string> {
  const result = await chrome.storage.managed.get(StorageKey.PASSWORD);
  return result[StorageKey.PASSWORD];
}

export async function storePassword(value: string): Promise<void> {
  await chrome.storage.managed.set({ [StorageKey.PASSWORD]: value});
  return;
}

export async function fetchWalletCredentials(walletId: number) {
  const result = await chrome.storage.local.get(StorageKey.WALLETS);
  try {
    const allWallets = JSON.parse(result[StorageKey.WALLETS]);
    return allWallets[walletId];
  } catch {
    return undefined;
  }
}

export async function storeWalletCredentials(walletId: number, credentials: any) {
  const result = await chrome.storage.managed.get(StorageKey.WALLETS);
  let allWallets;
  try {
    allWallets = JSON.parse(result[StorageKey.WALLETS]);
  } catch {
    allWallets = {}
  }
  Object.assign(allWallets, {
    [walletId]: {
      walletId,
      credentials,
    }
  })
  await chrome.storage.managed.set({ [StorageKey.WALLETS]: JSON.stringify(allWallets) })
}