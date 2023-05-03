import { DryRunTransactionBlockResponse } from '@mysten/sui.js';
import { useFeatureFlagsWithNetwork } from '../useFeatureFlags';

import { BackgroundApiClient } from '../../scripts/shared/ui-api-client';
import { GetGasBudgetFromDryRunParams, Network } from '@suiet/core';
import { useQuery } from 'react-query';
import { useNetwork } from '../useNetwork';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useApiClient } from '../useApiClient';

export function queryGasBudgetFromDryRunResult(params: {
  apiClient: BackgroundApiClient;
  network: Network;
  dryRunResult: DryRunTransactionBlockResponse | undefined;
}) {
  const { apiClient, network, dryRunResult } = params;
  if (!dryRunResult) {
    throw new Error('dryRunRes is undefined');
  }
  return apiClient.callFunc<GetGasBudgetFromDryRunParams, string>(
    'txn.getGasBudgetFromDryRun',
    {
      dryRunResult,
      network,
    }
  );
}
export default function useGasBudgetFromDryRun(
  dryRunResult: DryRunTransactionBlockResponse | undefined
) {
  const { networkId } = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(networkId);
  const apiClient = useApiClient();

  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasBudget = BigInt(
    featureFlags?.move_call_gas_budget ?? 1_000_000_000
  );

  return useQuery(
    [
      'queryGasBudgetFromDryRunResult',
      networkId,
      dryRunResult?.effects?.eventsDigest,
    ],
    async () => {
      if (!dryRunResult || !network) {
        return fallbackGasBudget;
      }
      return queryGasBudgetFromDryRunResult({
        apiClient,
        dryRunResult,
        network,
      });
    }
  );
}
