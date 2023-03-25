import { useApiClient } from './useApiClient';
import { Wallet } from '@suiet/core';
import { useQuery } from 'react-query';

export function useWallets() {
  const apiClient = useApiClient();
  const { data, error, refetch, ...rest } = useQuery(
    ['wallet.getWallets'],
    fetchWallets
  );

  async function fetchWallets() {
    return await apiClient.callFunc<null, Wallet[]>('wallet.getWallets', null);
  }

  return {
    data,
    error,
    fetchWallets: refetch,
    ...rest,
  };
}
