import useSWR from 'swr';
import { useApiClient } from './useApiClient';
import { Network } from '@suiet/core';
import { useFeatureFlags } from './useFeatureFlags';
import { useMemo } from 'react';
import { isNonEmptyArray } from '../utils/check';

export function useNetwork(networkId: string) {
  const featureFlags = useFeatureFlags();
  const apiClient = useApiClient();
  const { data: defaultData, error } = useSWR(
    ['fetchNetwork', networkId],
    fetchNetwork
  );
  const data = useMemo(() => {
    if (
      !defaultData ||
      !featureFlags ||
      typeof featureFlags.networks !== 'object' ||
      !isNonEmptyArray(Object.keys(featureFlags.networks))
    )
      return defaultData;
    const currentNetworkConfig = featureFlags.networks[networkId];
    if (!currentNetworkConfig?.full_node_url) return defaultData;

    const overrideData: Network = {
      ...defaultData,
      queryRpcUrl: currentNetworkConfig.full_node_url,
      txRpcUrl: `${currentNetworkConfig.full_node_url}:443`,
      versionCacheTimoutInSeconds:
        currentNetworkConfig.version_cache_timout_in_seconds,
      mintExampleNftGasBudget: currentNetworkConfig.mint_example_nft_gas_budget,
      transferObjectGasBudget: currentNetworkConfig.transfer_object_gas_budget,
      payCoinGasBudget: currentNetworkConfig.pay_coin_gas_budget,
    };
    return overrideData;
  }, [defaultData, featureFlags, networkId]);

  async function fetchNetwork(_: string, networkId: string) {
    if (!networkId) return;
    return await apiClient.callFunc<string, Network>(
      'network.getNetwork',
      networkId
    );
  }

  return {
    data,
    error,
    loading: !error && !data,
  };
}
