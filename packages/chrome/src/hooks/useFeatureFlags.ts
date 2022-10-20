import React, { useContext, useEffect, useState } from 'react';
import { FeatureFlagRes, getFeatureFlags } from '../api';

export const ContextFeatureFlags = React.createContext<
  FeatureFlagRes | undefined
>(undefined);

export function useFeatureFlags() {
  return useContext(ContextFeatureFlags);
}

// for provider
export function useAutoLoadFeatureFlags() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagRes>();
  useEffect(() => {
    (async function () {
      const data = await getFeatureFlags();
      setFeatureFlags(data);
    })();
  }, []);
  return featureFlags;
}
