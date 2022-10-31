import { isDev } from '../../../utils/env';

export function log(message: string, details: any, devOnly = true) {
  if (devOnly && !isDev) return;
  console.log('[api proxy]', message, details);
}

export function logError(error: any, details?: any, devOnly = true) {
  if (devOnly && !isDev) return;
  console.error('[api proxy]', error, details);
}
