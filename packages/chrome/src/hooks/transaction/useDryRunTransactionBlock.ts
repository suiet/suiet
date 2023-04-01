import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNetwork } from '../useNetwork';
import {
  DryRunTransactionBlockResponse,
  TransactionBlock,
} from '@mysten/sui.js';
import { useApiClient } from '../useApiClient';
import { DryRunTXBParams, Network, TxEssentials } from '@suiet/core';
import { OmitToken } from '../../types';

export default function useDryRunTransactionBlock(
  transactionBlock: TransactionBlock | undefined
) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  const { data, ...rest } = useQuery({
    queryKey: [
      'txn.dryRunTransactionBlock',
      transactionBlock?.serialize(),
      appContext.accountId,
      network,
    ],
    enabled: !!transactionBlock && !!network && !!appContext,
    queryFn: async () => {
      if (!transactionBlock) return undefined;

      return await apiClient.callFunc<
        DryRunTXBParams<string, OmitToken<TxEssentials>>,
        DryRunTransactionBlockResponse
      >(
        'txn.dryRunTransactionBlock',
        {
          transactionBlock: transactionBlock.serialize(),
          context: {
            network: network as Network,
            walletId: appContext.walletId,
            accountId: appContext.accountId,
          },
        },
        {
          withAuth: true,
        }
      );
    },
  });

  return {
    data,
    ...rest,
  };
}
