import { suietHttp } from '../utils/request';
export interface FeatureFlagNetwork {
  explorer_url: string;
  full_node_url: string;
  latest_sdk_version: string;
  latest_sui_version: Record<string, string>;
  on_maintenance: boolean;
}
export interface FeatureFlagRes {
  available_networks: string[];
  networks: Record<string, FeatureFlagNetwork>;
  require_update: boolean;
}

export async function getFeatureFlags(): Promise<FeatureFlagRes> {
  const res = await suietHttp({
    url: '/feature-flag',
    method: 'get',
  });
  if (!res.data.data) {
    throw new Error('Fetching feature flags failed');
  }
  return res.data.data;
}