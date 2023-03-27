import React, { useContext } from 'react';
import { FeatureFlagRes, getFeatureFlags } from '@/utils/api';
import useSWR from 'swr';

export const ContextFeatureFlags = React.createContext<FeatureFlagRes | undefined>(undefined);

export function useFeatureFlags() {
  return useContext(ContextFeatureFlags);
}

// for provider
export function useAutoLoadFeatureFlags() {
  const { data } = useSWR(['fetchFeatureFlags'], fetchFeatureFlags, {
    refreshInterval: 5 * 60 * 1000,
  });
  async function fetchFeatureFlags() {
    return await getFeatureFlags();
  }
  return data;
}
