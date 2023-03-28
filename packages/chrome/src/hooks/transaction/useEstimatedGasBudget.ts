import { useQuery } from 'react-query';
import { useApiClient } from '../useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';
import { GetEstimatedGasBudgetParams, Network } from '@suiet/core';
import { Transaction } from '@mysten/sui.js';
import { OmitToken } from '../../types';
import { useFeatureFlags } from '../useFeatureFlags';

export function useEstimatedGasBudget(transaction: Transaction | undefined) {
  // const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const featureFlags = useFeatureFlags();
  const specifiedGasBudget = featureFlags?.networks
    ? featureFlags.networks[appContext.networkId]?.move_call_gas_budget
    : 10000;

  return useQuery({
    queryKey: [
      'txn.getEstimatedGasBudget',
      transaction,
      appContext.accountId,
      network,
    ],
    enabled: !!transaction && !!network && !!appContext,
    queryFn: async () => {
      // FIXME: support estimate gas budget via dryRun
      return specifiedGasBudget;
      // const tx = transaction;
      //   if (tx.data?.gasBudget && tx.data.gasBudget > 0) {
      //     // if specified gasBudget, just return it back without dryRun
      //     return tx.data.gasBudget;
      //   }
      //
      //   return await apiClient.callFunc<
      //     OmitToken<GetEstimatedGasBudgetParams>,
      //     number
      //   >(
      //     'txn.getEstimatedGasBudget',
      //     {
      //       transaction: tx,
      //       network: network as Network,
      //       walletId: appContext.walletId,
      //       accountId: appContext.accountId,
      //     },
      //     {
      //       withAuth: true,
      //     }
      //   );
    },
  });
}
