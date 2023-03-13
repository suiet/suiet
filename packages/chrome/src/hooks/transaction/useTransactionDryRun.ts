import { useQuery } from 'react-query';
import { useApiClient } from '../useApiClient';
import { SignableTransaction } from '@mysten/sui.js/src';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';

export function useTransactionDryRun(transaction: SignableTransaction) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  return useQuery({
    queryKey: ['txn.dryRun', transaction, appContext.accountId, network?.id],
    queryFn: async () => {
      return await apiClient.callFunc(
        'txn.dryRun',
        {
          transaction,
          context: {
            network,
            walletId: appContext.walletId,
            accountId: appContext.accountId,
          },
        },
        {
          withAuth: true,
        }
      );
    },
    enabled: !!network,
  });
}
