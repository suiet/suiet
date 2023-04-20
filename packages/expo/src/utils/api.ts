import { suietHttp } from './request';
export interface FeatureFlagNetwork {
  explorer_url: string;
  full_node_url: string;
  on_maintenance: boolean;
  faucet_api: string;
  // mint_example_nft_gas_budget: number;
  // transfer_object_gas_budget: number;
  move_call_gas_budget: number;
  enable_staking: boolean;
  enable_buy_crypto: boolean;
  enable_mint_example_nft: boolean;
  version_cache_timout_in_seconds: number;
  pay_coin_gas_budget: number;
  stake_gas_budget: number;
  graphql_url: string;
  sample_nft_object_id: string;
}
export interface FeatureFlagRes {
  available_networks: string[];
  networks: Record<string, FeatureFlagNetwork>;
  require_update: boolean;
  default_network: string;
  campaign: Record<string, any>;
}

// const mockData: FeatureFlagRes = {
//   available_networks: ['devnet'],
//   default_network: 'devnet',
//   networks: {
//     devnet: {
//       explorer_url: 'https://explorer.devnet.sui.io',
//       faucet_api: 'https://faucet.devnet.sui.io',
//       full_node_url: 'https://fullnode.devnet.suiet.app',
//       on_maintenance: false,
//       rpc_version: '0.12.2',
//     },
//     testnet: {
//       explorer_url: 'https://explorer.testnet.sui.io',
//       faucet_api: 'https://faucet.testnet.sui.io',
//       full_node_url: 'https://fullnode.testnet.sui.io',
//       on_maintenance: false,
//       rpc_version: '0.12.2',
//     },
//   },
//   require_update: false,
// };

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
