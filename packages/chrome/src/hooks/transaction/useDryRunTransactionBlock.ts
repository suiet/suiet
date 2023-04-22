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
import { BackgroundApiClient } from '../../scripts/shared/ui-api-client';

export type DryRunTransactionBlockParams = {
  transactionBlock: TransactionBlock | string | undefined;
  apiClient: BackgroundApiClient;
  context: OmitToken<TxEssentials>;
};

export async function dryRunTransactionBlock(
  params: DryRunTransactionBlockParams
) {
  const { transactionBlock, apiClient, context } = params;
  if (!context) throw new Error('context is undefined');
  if (!transactionBlock) throw new Error('transactionBlock is undefined');

  let serializedTxb: string;
  if (typeof transactionBlock !== 'string') {
    serializedTxb = transactionBlock.serialize();
  } else {
    serializedTxb = transactionBlock;
  }
  return await apiClient.callFunc<
    DryRunTXBParams<string, OmitToken<TxEssentials>>,
    DryRunTransactionBlockResponse
  >(
    'txn.dryRunTransactionBlock',
    {
      transactionBlock: serializedTxb,
      context: context,
    },
    {
      withAuth: true,
    }
  );
}

export default function useDryRunTransactionBlock(
  transactionBlock: TransactionBlock | undefined
) {
  const apiClient = useApiClient();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  const { data, ...rest } = useQuery({
    enabled: !!transactionBlock && !!network && !!appContext,
    queryKey: [
      'txn.dryRunTransactionBlock',
      transactionBlock?.serialize(),
      appContext.accountId,
      network,
    ],
    queryFn: () =>
      dryRunTransactionBlock({
        transactionBlock,
        apiClient,
        context: {
          network: network as Network,
          walletId: appContext.walletId,
          accountId: appContext.accountId,
        },
      }),
  });

  return {
    data,
    ...rest,
  };
}
