import { suietHttp } from '../utils/request';
export interface FeatureFlagNetwork {
  explorer_url: string;
  full_node_url: string;
  on_maintenance: boolean;
  faucet_api: string;
  mint_example_nft_gas_budget: number;
  transfer_object_gas_budget: number;
  version_cache_timout_in_seconds: number;
  pay_coin_gas_budget: number;
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
