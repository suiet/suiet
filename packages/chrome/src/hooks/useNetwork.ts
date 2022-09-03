import { coreApi } from '@suiet/core';
import useSWR from 'swr';

export function useNetwork(networkId: string) {
  const { data, error } = useSWR(['getNetwork', networkId], fetchNetwork);

  async function fetchNetwork(_: string, networkId: string) {
    return await coreApi.network.getNetwork(networkId);
  }

  return {
    data,
    error,
    loading: !error && !data,
  };
}
