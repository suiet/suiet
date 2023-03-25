import { resolveAddress } from '../api/suins';
import { useQuery } from 'react-query';

export function useSuinsName(
  address: string,
  opts: {
    networkId: string;
  }
) {
  const { data, error, ...rest } = useQuery(
    [
      `fetchDefaultDomainName?address=${address}&networkId=${opts.networkId}`,
      address,
      opts.networkId,
    ],
    async () => await fetchDefaultDomainName(address, opts.networkId)
  );

  async function fetchDefaultDomainName(address: string, networkId: string) {
    if (!address || !networkId) return;
    return await resolveAddress(address, { networkId });
  }

  return {
    data: data ?? address, // fallback
    error,
    ...rest,
  };
}
