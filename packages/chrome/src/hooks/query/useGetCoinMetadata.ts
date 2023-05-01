import { BackgroundApiClient } from '../../scripts/shared/ui-api-client';
import {
  GetCoinMetadataParams,
  GetCoinMetadataResult,
  Network,
} from '@suiet/core';

export async function getCoinMetadata(params: {
  apiClient: BackgroundApiClient;
  network: Network;
  coinTypes: string[];
}) {
  const { apiClient, network, coinTypes } = params;
  return await apiClient.callFunc<
    GetCoinMetadataParams,
    GetCoinMetadataResult[]
  >('txn.getCoinMetadata', { network, coinTypes });
}
