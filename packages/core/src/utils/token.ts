import * as crypto from '../crypto';
import { Storage } from '../storage/Storage';
import { Buffer } from 'buffer';

export async function validateToken(storage: Storage, token: string) {
  const meta = await storage.loadMeta();
  if (!meta) {
    throw new Error('Empty old password');
  }
  if (!crypto.validateToken(Buffer.from(token, 'hex'), meta.cipher)) {
    throw new Error('Invalid old password');
  }
}
