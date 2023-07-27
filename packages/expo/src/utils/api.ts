import { suietHttp } from '@/utils/request';
export interface FeatureFlagNetwork {
  explorer_url: string;
  full_node_url: string;
  graphql_url: string;
  on_maintenance: boolean;
  faucet_api: string;
  // mint_example_nft_gas_budget: number;
  // transfer_object_gas_budget: number;
  move_call_gas_budget: number;
  enable_staking: boolean;
  enable_swap: boolean;
  cetus_partner_id?: string;
  enable_buy_crypto: boolean;
  enable_mint_example_nft: boolean;
  version_cache_timout_in_seconds: number;
  pay_coin_gas_budget: number;
  stake_gas_budget: number;
  sample_nft_object_id: string;
}
export interface FeatureFlagRes {
  available_networks: string[];
  networks: Record<string, FeatureFlagNetwork>;
  require_update: boolean;
  default_network: string;
  campaign: Record<string, any>;
}

export async function getFeatureFlags(): Promise<FeatureFlagRes> {
  return await suietHttp({
    url: '/feature-flag',
    method: 'get',
  });
}

export interface DappCategory {
  explorer_url: string;
  full_node_url: string;
  latest_sdk_version: string;
  latest_sui_version: Record<string, string>;
  on_maintenance: boolean;
}
export interface DappItem {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: string;
  background_color: string;
}

export async function getDappList(): Promise<{
  category: Record<string, DappCategory[]>;
  featured: DappItem[];
  popular: DappItem[];
}> {
  return await suietHttp({
    url: '/apps',
    method: 'get',
  });
}
