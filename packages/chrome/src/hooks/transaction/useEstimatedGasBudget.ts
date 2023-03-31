import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';
import { TransactionBlock } from '@mysten/sui.js';
import { useFeatureFlagsWithNetwork } from '../useFeatureFlags';

export function useEstimatedGasBudget(
  transactionBlock: TransactionBlock | undefined
) {
  // const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);
  const featureFlags = useFeatureFlagsWithNetwork();
  const specifiedGasBudget = featureFlags?.move_call_gas_budget ?? 10000;

  return useQuery({
    queryKey: [
      'txn.getEstimatedGasBudget',
      transactionBlock,
      appContext.accountId,
      network,
    ],
    enabled: !!transactionBlock && !!network && !!appContext,
    queryFn: async () => {
      console.log('transactionBlock?.blockData', transactionBlock?.blockData);
      // FIXME: support estimate gas budget via dryRun
      if (transactionBlock?.blockData?.gasConfig?.budget) {
        return transactionBlock.blockData.gasConfig.budget;
      }
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
