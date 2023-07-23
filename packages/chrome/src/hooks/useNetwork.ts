import { Network } from '@suiet/core';
import { useFeatureFlags } from './useFeatureFlags';
import { useMemo } from 'react';
import { isNonEmptyArray } from '../utils/check';

const DEFAULT_NETWORKS = new Map([
  [
    'devnet',
    {
      id: 'devnet',
      name: 'devnet',
      queryRpcUrl: 'https://devnet.suiet.app',
      txRpcUrl: 'https://devnet.suiet.app',
      graphql_url: 'https://devnet.suiet.app/query',
      versionCacheTimoutInSeconds: 0,
    },
  ],
  [
    'testnet',
    {
      id: 'testnet',
      name: 'testnet',
      queryRpcUrl: 'https://testnet.suiet.app',
      txRpcUrl: 'https://testnet.suiet.app',
      graphql_url: 'https://testnet.suiet.app/query',
      versionCacheTimoutInSeconds: 0,
    },
  ],
  [
    'mainnet',
    {
      id: 'mainnet',
      name: 'mainnet',
      queryRpcUrl: 'https://mainnet.suiet.app',
      txRpcUrl: 'https://mainnet.suiet.app',
      graphql_url: 'https://mainnet.suiet.app/query',
      versionCacheTimoutInSeconds: 0,
    },
  ],
]);

function trimUndefinedValue(obj: Record<string, any>) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      Reflect.deleteProperty(newObj, key);
    }
  });
  return newObj;
}

export function useNetwork(networkId: string) {
  const defaultNetwork =
    DEFAULT_NETWORKS.get(networkId) ??
    (DEFAULT_NETWORKS.get('mainnet') as Network);
  const featureFlags = useFeatureFlags();

  const data: Network | undefined = useMemo(() => {
    // first try featureFlags
    if (
      !featureFlags ||
      typeof featureFlags.networks !== 'object' ||
      !isNonEmptyArray(Object.keys(featureFlags.networks))
    ) {
      return defaultNetwork;
    }
    const currentNetworkConfig = featureFlags.networks[networkId];
    if (!currentNetworkConfig?.full_node_url) {
      return defaultNetwork;
    }

    const overrideData: Network & {
      enableStaking?: boolean;
      enableSwap?: boolean;
      enableMintExampleNFT?: boolean;
      moveCallGasBudget?: number;
      payCoinGasBudget?: number;
    } = Object.assign(
      defaultNetwork,
      trimUndefinedValue({
        id: networkId,
        name: networkId,
        queryRpcUrl: currentNetworkConfig.full_node_url,
        graphqlUrl: currentNetworkConfig.graphql_url,
        txRpcUrl: currentNetworkConfig.full_node_url,
        versionCacheTimoutInSeconds:
          currentNetworkConfig.version_cache_timout_in_seconds,
        stakeGasBudget: currentNetworkConfig.stake_gas_budget,
        enableStaking: currentNetworkConfig.enable_staking,
        enableSwap: currentNetworkConfig.enable_swap,
        enableBuyCrypto: currentNetworkConfig.enable_buy_crypto,
        enableMintExampleNFT: currentNetworkConfig.enable_mint_example_nft,
        moveCallGasBudget: currentNetworkConfig.move_call_gas_budget,
        payCoinGasBudget: currentNetworkConfig.pay_coin_gas_budget,
      })
    );
    return overrideData;
  }, [featureFlags, networkId]);

  return {
    data,
  };
}
