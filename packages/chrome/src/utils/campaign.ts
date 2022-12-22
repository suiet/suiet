import { FeatureFlagRes } from '../api';

export function getCampaignInfo(flags: FeatureFlagRes) {
  if (!flags?.campaign) return null;
  return flags.campaign;
}

export function getMintNftCampaignInfo(campaign: Record<string, any> | null) {
  if (!campaign?.mint_nft) return null;
  return campaign?.mint_nft as {
    mint_name: string;
    mint_description: string;
    mint_image: string;
  };
}
