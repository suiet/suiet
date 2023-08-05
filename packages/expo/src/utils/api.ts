import { suietHttp } from '@/utils/request';

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
