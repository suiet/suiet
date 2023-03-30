import React, { useContext } from 'react';
import { FeatureFlagRes, getFeatureFlags } from '../api';
import { useQuery } from 'react-query';
import { useNetwork } from './useNetwork';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const ContextFeatureFlags = React.createContext<
  FeatureFlagRes | undefined
>(undefined);

export function useFeatureFlags() {
  return useContext(ContextFeatureFlags);
}

/**
 * useFeatureFlags for the active network
 */
export function useFeatureFlagsWithNetwork() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const featureFlags = useFeatureFlags();
  return featureFlags?.networks && featureFlags.networks[appContext.networkId];
}

// for provider
export function useAutoLoadFeatureFlags() {
  const { data } = useQuery(
    ['fetchFeatureFlags'],
    async () => await fetchFeatureFlags(),
    {
      refetchInterval: 5 * 60 * 1000,
    }
  );
  async function fetchFeatureFlags() {
    return await getFeatureFlags();
  }
  return data;
}
