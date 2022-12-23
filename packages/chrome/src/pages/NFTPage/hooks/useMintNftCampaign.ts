import { useFeatureFlags } from '../../../hooks/useFeatureFlags';
import { useMemo } from 'react';
import {
  getCampaignInfo,
  getMintNftCampaignInfo,
} from '../../../utils/campaign';

export const defaultNftMetadata = {
  name: 'Suiet NFT',
  desc: 'An NFT created by Suiet',
  imageUrl:
    'https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4',
};

export function useMintNftCampaign() {
  const featureFlags = useFeatureFlags();

  return useMemo(() => {
    if (!featureFlags) return defaultNftMetadata;
    const campaignInfo = getCampaignInfo(featureFlags);
    const res = getMintNftCampaignInfo(campaignInfo);
    if (!res) return defaultNftMetadata;
    return {
      name: res.mint_name,
      desc: res.mint_description,
      imageUrl: res.mint_image,
    };
  }, [featureFlags]);
}
