import { useFeatureFlags } from '../../../hooks/useFeatureFlags';
import { useMemo } from 'react';
import {
  getCampaignInfo,
  getMintNftCampaignInfo,
} from '../../../utils/campaign';

export function useMintNftCampaign() {
  const featureFlags = useFeatureFlags();

  const defaultInfo = {
    name: 'Suiet NFT',
    desc: 'An NFT created by Suiet',
    imageUrl:
      'https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4',
  };

  return useMemo(() => {
    if (!featureFlags) return defaultInfo;
    const campaignInfo = getCampaignInfo(featureFlags);
    const res = getMintNftCampaignInfo(campaignInfo);
    if (!res) return defaultInfo;
    return {
      name: res.mint_name,
      desc: res.mint_description,
      imageUrl: res.mint_image,
    };
  }, [featureFlags]);
}
