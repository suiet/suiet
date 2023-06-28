interface WebStorage {
  /**
   * @desc Fetches key and returns item in a promise.
   */
  getItem: (key: string) => Promise<string | null>;
  /**
   * @desc Sets value for key and returns item in a promise.
   */
  setItem: (key: string, item: string | null) => Promise<void>;
  /**
   * @desc Removes value for key.
   */
  removeItem: (key: string) => Promise<void>;
}

export class Storage implements WebStorage {
  async getItem(key: string) {
    // const results = await chrome.storage.local.get(key);
    const results = window.localStorage.getItem(key);
    return results[key] ?? null;
  }

  async removeItem(key: string): Promise<void> {
    // return await chrome.storage.local.remove(key);
    return window.localStorage.removeItem(key);
  }

  async setItem(key: string, item: string | null): Promise<void> {
    return window.localStorage.setItem(key, item);
    // return await chrome.storage.local.set({ [key]: item });
  }

  async clear() {
    // return await chrome.storage.local.clear();
    return window.localStorage.clear();
  }
}

export default new Storage();
