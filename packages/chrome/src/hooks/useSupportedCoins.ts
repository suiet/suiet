import useSWR from 'swr';
import { CoinPackageIdPair } from '@suiet/core';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';

export function useSupportedCoins() {
  const apiClient = useApiClient();
  const { data, error } = useSWR(['supportedCoins'], fetchSupportedCoins);

  async function fetchSupportedCoins(_: string) {
    return await apiClient.callFunc<null, CoinPackageIdPair[]>(
      'txn.supportedCoins',
      null
    );
  }

  return {
    data,
    error,
    loading: swrLoading(data, error),
  };
}
