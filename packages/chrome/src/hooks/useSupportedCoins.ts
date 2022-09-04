import useSWR from 'swr';
import { coreApi } from '@suiet/core';
import { swrLoading } from '../utils/others';

export function useSupportedCoins() {
  const { data, error } = useSWR(['supportedCoins'], fetchSupportedCoins);

  async function fetchSupportedCoins(_: string) {
    return await coreApi.txn.supportedCoins();
  }

  return {
    data,
    error,
    loading: swrLoading(data, error),
  };
}
