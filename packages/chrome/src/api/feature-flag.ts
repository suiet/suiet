import { suietHttp } from '../utils/request';
export interface FeatureFlagNetwork {
  explorer_url: string;
  full_node_url: string;
  rpc_version: string;
  on_maintenance: boolean;
}
export interface FeatureFlagRes {
  available_networks: string[];
  networks: Record<string, FeatureFlagNetwork>;
  require_update: boolean;
}

export async function getFeatureFlags(): Promise<FeatureFlagRes> {
  return await suietHttp({
    url: '/feature-flag',
    method: 'get',
  });
}
