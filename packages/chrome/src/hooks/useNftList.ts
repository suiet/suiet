import { useApiClient } from './useApiClient';
import { useNetwork } from './useNetwork';
import useSWR from 'swr';
import { GetOwnedObjParams, Network, NftObjectDto } from '@suiet/core';
import { swrLoading } from '../utils/others';

export function useNftList(address: string, networkId: string = 'devnet') {
  const apiClient = useApiClient();
  const { data: network } = useNetwork(networkId);
  const { data, error, mutate } = useSWR(
    ['getOwnedNfts', network, address],
    fetchNftList,
    {
      refreshInterval: 5000,
    }
  );

  async function fetchNftList(_: string, network: Network, address: string) {
    if (!network || !address) return;
    return await apiClient.callFunc<GetOwnedObjParams, NftObjectDto[]>(
      'txn.getOwnedNfts',
      { network, address }
    );
  }

  return {
    data,
    error,
    mutate,
    loading: swrLoading(data, error),
  };
}
