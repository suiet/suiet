import axios from 'axios';
import { version } from '../package-json';
import { isDev } from './env';

function getSuietVersion() {
  if (isDev) return 'dev-' + version;
  return version;
}

export const suietHttp = axios.create({
  baseURL: 'https://api.suiet.app/',
  headers: {
    'x-suiet-client-type': 'suiet-desktop-extension',
    'x-suiet-client-version': getSuietVersion(),
  },
});

suietHttp.interceptors.response.use((res) => {
  if (res.status >= 500) {
    console.error(res);
    throw new Error('server error');
  }
  return res.data.data;
});

export function envUrl(url: string, networkId: string = 'devnet') {
  let _url = url;
  if (_url.startsWith('/')) {
    _url = _url.slice(1);
  }
  if (networkId === 'mainnet') return `/${_url}`;
  if (networkId === 'testnet') return `/testnet/${_url}`;
  else return `/devnet/${_url}`;
}
