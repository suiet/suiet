import * as crypto from '../crypto';
import { IStorage } from '../storage';
import { Buffer } from 'buffer';

export async function validateToken(storage: IStorage, token: string) {
  const meta = await storage.loadMeta();
  if (!meta) {
    throw new Error('Meta not initialized');
  }
  if (!crypto.validateToken(Buffer.from(token, 'hex'), meta.cipher)) {
    throw new Error('Invalid token');
  }
}
