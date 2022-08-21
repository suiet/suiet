import storage from "./storage";

enum Key {
  PASSWORD = 'PASSWORD'
}

export async function fetchPassword() {
  return storage.get(Key.PASSWORD)
}

export async function storePassword(value: string) {
  return storage.set(Key.PASSWORD, value);
}