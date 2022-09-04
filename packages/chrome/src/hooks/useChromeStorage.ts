import { StorageKeys } from '../store/enum';
import { useEffect, useState } from 'react';
import storage from '../store/storage';

export function useChromeStorage<T = any>(key: StorageKeys) {
  const [data, setData] = useState<T>();

  async function setItem(value: T) {
    await storage.setItem(key, JSON.stringify(value));
    setData(value);
  }

  async function getItem(key: string) {
    const result = await storage.getItem(key);
    const val = result !== null ? JSON.parse(result) : undefined;
    setData(val);
    return val;
  }

  useEffect(() => {
    if (!key) return;
    getItem(key);
  }, [key]);

  return {
    data,
    getItem,
    setItem,
  };
}
