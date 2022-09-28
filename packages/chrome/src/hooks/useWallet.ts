import { UpdateWalletParams, Wallet } from '@suiet/core';
import useSWR from 'swr';
import { useApiClient } from './useApiClient';
import { OmitToken } from '../types';

export function useWallet(walletId: string) {
  const apiClient = useApiClient();
  const { data, error, mutate } = useSWR(
    ['fetchWallet', walletId],
    fetchWallet
  );

  async function fetchWallet(_: string, walletId: string) {
    if (!walletId) return;
    return await apiClient.callFunc<string, Wallet>(
      'wallet.getWallet',
      walletId
    );
  }

  async function updateWallet(
    walletId: string,
    meta: { avatar: string; name: string }
  ) {
    await apiClient.callFunc<OmitToken<UpdateWalletParams>, undefined>(
      'wallet.updateWallet',
      {
        walletId,
        meta,
      },
      { withAuth: true }
    );
    await mutate();
  }

  return {
    data,
    error,
    loading: !error && !data,
    mutate,
    updateWallet,
  };
}
