import { StorageKeys } from '../store/enum';
import { useEffect, useState } from 'react';
import storage from '../store/storage';

export function useChromeStorage<T = any>(key: StorageKeys, defaultValue?: T) {
  const [data, setData] = useState<T | undefined>();

  async function setItem(value: T) {
    await storage.setItem(key, JSON.stringify(value));
    setData(value);
  }

  function safeParse(val: string | undefined): any {
    if (typeof val === 'undefined') return undefined;
    if (val === null || val === 'null') return null;
    try {
      return JSON.parse(val);
    } catch (e) {
      console.error('json parse failed', e);
      return undefined;
    }
  }

  async function getItem(key: string, defaultValue?: T) {
    const result = await storage.getItem(key);
    if (typeof result === 'undefined') {
      if (typeof defaultValue !== 'undefined') {
        await setItem(defaultValue);
        setData(defaultValue);
        return defaultValue;
      }
    }
    const val = safeParse(result);
    setData(val);
    return val;
  }

  useEffect(() => {
    if (!key) return;
    getItem(key, defaultValue);
  }, [key, defaultValue]);

  return {
    data,
    getItem,
    setItem,
  };
}
