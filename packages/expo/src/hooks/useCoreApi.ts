import { AuthApi, WalletApi } from '@suiet/core';
import React from 'react';
import ReactNativeStorage from '../utils/storage';

const storage = new ReactNativeStorage();

export const AuthApiContext = React.createContext(new AuthApi(storage));
export const WalletApiContext = React.createContext(new WalletApi(storage));

export function useCoreApi() {
  const authApi = React.useContext(AuthApiContext);
  const walletApi = React.useContext(WalletApiContext);

  return { authApi, walletApi };
}
