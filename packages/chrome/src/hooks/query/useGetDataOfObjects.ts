import { SuiObjectDataOptions } from '@mysten/sui.js';
import { BackgroundApiClient } from '../../scripts/shared/ui-api-client';
import { GetDataOfObjectsParams, isNonEmptyArray, Network } from '@suiet/core';
import { SuiObjectResponse } from '@mysten/sui.js/src';

export async function getDataOfObjects(params: {
  apiClient: BackgroundApiClient;
  network: Network;
  objectIds: string[];
  options?: SuiObjectDataOptions;
}) {
  const { apiClient, network, objectIds, options } = params;
  return await apiClient.callFunc<GetDataOfObjectsParams, SuiObjectResponse[]>(
    'txn.getDataOfObjects',
    { network, objectIds, options }
  );
}
