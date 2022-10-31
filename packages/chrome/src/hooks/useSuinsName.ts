import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { resolveAddress } from '../api/suins';

export function useSuinsName(
  address: string,
  opts: {
    networkId: string;
  }
) {
  const { data, error, mutate } = useSWR(
    [
      `fetchDefaultDomainName?address=${address}&networkId=${opts.networkId}`,
      address,
      opts.networkId,
    ],
    fetchDefaultDomainName
  );

  async function fetchDefaultDomainName(
    _: string,
    address: string,
    networkId: string
  ) {
    if (!address || !networkId) return;
    return await resolveAddress(address, { networkId });
  }

  return {
    data: data ?? address, // fallback
    mutate,
    error,
    loading: swrLoading(data, error),
  };
}
