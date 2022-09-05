import { StorageKeys } from '../store/enum';
import { useEffect, useState } from 'react';
import storage from '../store/storage';

export function useChromeStorage<T = any>(key: StorageKeys) {
  const [data, setData] = useState<T | undefined>();

  async function setItem(value: T) {
    await storage.setItem(key, JSON.stringify(value));
    setData(value);
  }

  function safeParse(val: string): any {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.error('json parse failed', e);
      return undefined;
    }
  }

  async function getItem(key: string) {
    const result = await storage.getItem(key);
    console.log('getItem', key, result);
    const val =
      typeof result === 'undefined' || result === null
        ? undefined
        : safeParse(result);
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
