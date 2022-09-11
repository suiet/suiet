import { UpdateWalletParams, Wallet } from '@suiet/core';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useApiClient } from './useApiClient';

export function useWallet(walletId: string) {
  const apiClient = useApiClient();
  const { data, error, mutate } = useSWR(['getWallet', walletId], fetchWallet);
  const token = useSelector((state: RootState) => state.appContext.token);

  async function fetchWallet(_: string, walletId: string) {
    return await apiClient.callFunc<string, Wallet>(
      'wallet.getWallet',
      walletId
    );
  }

  async function updateWallet(
    walletId: string,
    meta: { avatar: string; name: string }
  ) {
    await apiClient.callFunc<UpdateWalletParams, undefined>(
      'wallet.updateWallet',
      {
        walletId,
        meta,
        token,
      }
    );
  }

  return {
    data,
    error,
    loading: !error && !data,
    mutate,
    updateWallet,
  };
}
