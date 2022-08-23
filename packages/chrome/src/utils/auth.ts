import storage from "./storage";

enum StorageKey {
  PASSWORD = 'PASSWORD'
}

export async function fetchPassword() {
  return storage.get(StorageKey.PASSWORD)
}

export async function storePassword(value: string) {
  return storage.set(StorageKey.PASSWORD, value);
}