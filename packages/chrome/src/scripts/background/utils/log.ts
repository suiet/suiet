import { isDev } from '../../../utils/env';

export function log(message: string, details?: any, devOnly = true) {
  if (devOnly && !isDev) return;
  if (details) {
    console.log('[api proxy]', message, details);
  } else {
    console.log('[api proxy]', message);
  }
}

export function logError(error: any, details?: any, devOnly = true) {
  if (devOnly && !isDev) return;
  if (details) {
    console.error('[api proxy]', error, details);
  } else {
    console.error('[api proxy]', error);
  }
}
