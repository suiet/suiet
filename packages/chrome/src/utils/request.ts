import axios from 'axios';
import { version } from '../package-json';

export const suietHttp = axios.create({
  baseURL: 'https://api.suiet.app/',
  headers: {
    'x-suiet-client-type': 'suiet-desktop-extension',
    'x-suiet-client-version': version,
  },
});

suietHttp.interceptors.response.use((res) => {
  if (res.data?.message !== 'ok') {
    throw new Error('response error');
  }
  return res.data.data;
});
