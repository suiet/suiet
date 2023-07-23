import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { updateNetworkId } from '../store/reducers/appContext';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { FeatureFlagRes } from '@/utils/api';

export function useNetwork(featureFlags?: FeatureFlagRes) {
  const __featureFlags = useFeatureFlags();
  featureFlags ??= __featureFlags;
  const dispatch = useDispatch<AppDispatch>();
  const networkId = useSelector((state: RootState) => state.appContext.networkId) ?? featureFlags?.default_network;
  const network = featureFlags?.networks?.[networkId ?? featureFlags?.default_network];

  return {
    network,
    networkId,

    updateNetworkId: (networkId: string) => {
      dispatch(updateNetworkId(networkId));
    },
  };
  // as
  //   | {
  //       network: FeatureFlagNetwork;
  //       networkId: string;
  //       updateNetworkId: (networkId: string) => void;
  //     }
  //   | {
  //       network: undefined;
  //       networkId: undefined;
  //       updateNetworkId: (networkId: string) => void;
  //     };
}
