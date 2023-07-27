import { envUrl, suietHttp } from '../utils/request';
import { SuietApiOptions } from './types';

export interface DappCategory {
  explorer_url: string;
  full_node_url: string;
  graphql_url: string;
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

export async function getDappList(opts: SuietApiOptions): Promise<{
  category: Record<string, DappCategory[]>;
  featured: DappItem[];
  popular: DappItem[];
}> {
  return await suietHttp({
    url: envUrl('/apps', opts.networkId),
    method: 'get',
  });
}
