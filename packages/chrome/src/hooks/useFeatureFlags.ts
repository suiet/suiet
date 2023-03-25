import React, { useContext } from 'react';
import { FeatureFlagRes, getFeatureFlags } from '../api';
import { useQuery } from 'react-query';

export const ContextFeatureFlags = React.createContext<
  FeatureFlagRes | undefined
>(undefined);

export function useFeatureFlags() {
  return useContext(ContextFeatureFlags);
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
