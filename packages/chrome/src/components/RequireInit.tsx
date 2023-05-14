import { useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { isNonEmptyArray } from '../utils/check';
import { updateNetworkId } from '../store/app-context';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useEffectAdjustInitializedStatus } from '../hooks/useEffectAdjustInitializedStatus';

function RequireInit({ children }: any) {
  const appContext = useSelector((state: RootState) => state.appContext);
  const dispatch = useDispatch<AppDispatch>();
  const featureFlags = useFeatureFlags();
  const adjustCurrentNetworkId = useCallback(async () => {
    const defaultNetwork = featureFlags?.default_network ?? 'mainnet';

    if (!appContext.networkId) {
      await dispatch(updateNetworkId(defaultNetwork));
      return;
    }

    // if current network is not in featureFlags.available_networks, switch to default network
    if (
      featureFlags &&
      isNonEmptyArray(featureFlags?.available_networks) &&
      !featureFlags.available_networks.includes(appContext.networkId)
    ) {
      await dispatch(updateNetworkId(defaultNetwork));
    }
  }, [featureFlags, appContext]);

  useEffectAdjustInitializedStatus(appContext);
  useEffect(() => {
    adjustCurrentNetworkId();
  }, [appContext.networkId, featureFlags]);

  return appContext.initialized ? (
    children
  ) : (
    <Navigate to={'/onboard'} replace />
  );
}

export default RequireInit;
