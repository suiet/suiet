import { useQuery } from 'react-query';
import { useApiClient } from '../useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';
import { GetEstimatedGasBudgetParams, Network } from '@suiet/core';
import {
  SignableTransaction,
  UnserializedSignableTransaction,
} from '@mysten/sui.js';
import { OmitToken } from '../../types';

export function useEstimatedGasBudget(
  transaction: SignableTransaction | undefined
) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  return useQuery({
    queryKey: [
      'txn.getEstimatedGasBudget',
      transaction,
      appContext.accountId,
      network,
    ],
    enabled: !!transaction && !!network && !!appContext,
    queryFn: async () => {
      const tx = transaction as UnserializedSignableTransaction;
      if (tx.data?.gasBudget && tx.data.gasBudget > 0) {
        // if specified gasBudget, just return it back without dryRun
        return tx.data.gasBudget;
      }

      return await apiClient.callFunc<
        OmitToken<GetEstimatedGasBudgetParams>,
        number
      >(
        'txn.getEstimatedGasBudget',
        {
          transaction: tx,
          network: network as Network,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
        {
          withAuth: true,
        }
      );
    },
  });
}
