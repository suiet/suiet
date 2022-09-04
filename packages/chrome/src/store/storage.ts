interface WebStorage {
  /**
   * @desc Fetches key and returns item in a promise.
   */
  getItem: (key: string) => Promise<string | null>;
  /**
   * @desc Sets value for key and returns item in a promise.
   */
  setItem: (key: string, item: string) => Promise<void>;
  /**
   * @desc Removes value for key.
   */
  removeItem: (key: string) => Promise<void>;
}

export class ChromeStorage implements WebStorage {
  async getItem(key: string): Promise<string | null> {
    const result = await chrome.storage.local.get(key);
    return result[key];
  }

  async removeItem(key: string): Promise<void> {
    return await chrome.storage.local.remove(key);
  }

  async setItem(key: string, item: string): Promise<void> {
    return await chrome.storage.local.set({ [key]: item });
  }
}

export default new ChromeStorage();
