import { useApiClient } from './useApiClient';
import { Network } from '@suiet/core';
import { useFeatureFlags } from './useFeatureFlags';
import { useMemo } from 'react';
import { isNonEmptyArray } from '../utils/check';
import { useQuery } from 'react-query';

export function swrKeyWithNetwork(key: string, network: Network | undefined) {
  if (network?.queryRpcUrl) {
    return key + `?queryRpcUrl=${network.queryRpcUrl}`;
  }
  return key;
}

export function useNetwork(networkId: string) {
  const featureFlags = useFeatureFlags();
  const apiClient = useApiClient();
  const {
    data: defaultData,
    error,
    ...rest
  } = useQuery(
    ['fetchNetwork', networkId],
    async () => await fetchNetwork(networkId)
  );
  const data: Network | undefined = useMemo(() => {
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
      txRpcUrl: currentNetworkConfig.full_node_url,
      versionCacheTimoutInSeconds:
        currentNetworkConfig.version_cache_timout_in_seconds,
      stakeGasBudget: currentNetworkConfig.stake_gas_budget,
    };
    return overrideData;
  }, [defaultData, featureFlags, networkId]);

  async function fetchNetwork(networkId: string): Promise<Network | undefined> {
    if (!networkId) return;
    return await apiClient.callFunc<string, Network>(
      'network.getNetwork',
      networkId
    );
  }

  return {
    data,
    error,
    ...rest,
  };
}
