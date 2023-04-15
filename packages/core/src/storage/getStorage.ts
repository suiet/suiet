import { platform } from '../utils/platform';
import { IndexedDBStorage } from './indexeddb';
import IStorage from './IStorage';

export default function getStorage(): IStorage | undefined {
  if (platform.isBrowser || platform.isisExtBackgroundServiceWork) {
    return new IndexedDBStorage();
  }
  return undefined;
}
