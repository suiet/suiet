import { useQuery } from 'react-query';
import { useApiClient } from '../useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';
import { GetEstimatedGasBudgetParams } from '@suiet/core';
import { UnserializedSignableTransaction } from '@mysten/sui.js';
import { OmitToken } from '../../types';

export function useEstimatedGasBudget(
  transaction: UnserializedSignableTransaction | undefined
) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  return useQuery({
    queryKey: [
      'txn.getEstimatedGasBudget',
      transaction,
      appContext.accountId,
      network?.id,
    ],
    queryFn: async () => {
      if (!transaction || !network) return;

      return await apiClient.callFunc<
        OmitToken<GetEstimatedGasBudgetParams>,
        number
      >(
        'txn.getEstimatedGasBudget',
        {
          transaction,
          network,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
        {
          withAuth: true,
        }
      );
    },
    // enabled: false,
  });
}
