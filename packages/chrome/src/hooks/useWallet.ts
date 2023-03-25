import { UpdateWalletParams, Wallet } from '@suiet/core';
import { useApiClient } from './useApiClient';
import { OmitToken } from '../types';
import { useQuery } from 'react-query';

export function useWallet(walletId: string) {
  const apiClient = useApiClient();
  const { data, error, refetch, ...rest } = useQuery(
    ['fetchWallet', walletId],
    async () => await fetchWallet(walletId)
  );

  async function fetchWallet(walletId: string) {
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
    await refetch();
  }

  return {
    data,
    error,
    loading: !error && !data,
    updateWallet,
    refetch,
    ...rest,
  };
}
