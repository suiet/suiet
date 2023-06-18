import { useEffect } from 'react';
import { getFeatureFlags } from '../api';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateFeatureFlag } from '../store/feature-flag';

export function useFeatureFlags() {
  const featureFlag = useSelector((state: RootState) => state.featureFlag);
  return featureFlag.flags;
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
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (data) {
      // update redux store
      dispatch(updateFeatureFlag(data));
    }
  }, [data]);

  return data;
}
