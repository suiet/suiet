import useGasBudgetWithFallback from '../../../hooks/transaction/useGasBudgetWithFallback';
import { useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { TransactionBlock } from '@mysten/sui.js';
import { dryRunTransactionBlock } from '../../../hooks/transaction/useDryRunTransactionBlock';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { useApiClient } from '../../../hooks/useApiClient';
import { formatDryRunError } from '@suiet/core';
import { queryGasBudgetFromDryRunResult } from '../../../hooks/transaction/useGasBudgetFromDryRun';
import { isValidSuiAddress } from '@mysten/sui.js';

export default function useGasBudgetForNftSend(params: {
  recipient: string;
  objectId: string;
  objectType: string;
  senderKioskId: string | undefined;
  prepareTransferNftTxb: (params: any) => Promise<TransactionBlock>;
}) {
  const [gasBudget, setGasBudget] = useGasBudgetWithFallback();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const apiClient = useApiClient();
  const { networkId, walletId, accountId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: network } = useNetwork(networkId);

  const [txb, setTxb] = useState<TransactionBlock | null>(null);
  const [txbLoading, setTxbLoading] = useState(false);

  useAsyncEffect(async () => {
    if (!isValidSuiAddress(params.recipient)) {
      setTxb(null);
      return;
    }
    if (txbLoading) return;

    setTxbLoading(true);
    try {
      const txbResult = await params.prepareTransferNftTxb({
        objectId: params.objectId,
        objectType: params.objectType,
        recipient: params.recipient,
        senderKioskId: params.senderKioskId,
      });

      if (txbResult) {
        setTxb(txbResult);
      } else {
        setTxb(null);
      }
    } catch {
      setTxb(null);
    } finally {
      setTxbLoading(false);
    }
  }, [params.recipient]);

  useAsyncEffect(async () => {
    if (!txb || !network) return;
    if (loading) return;

    setLoading(true);
    try {
      txb.setGasBudget(BigInt(gasBudget));
      const dryRunResult = await dryRunTransactionBlock({
        transactionBlock: txb,
        apiClient,
        context: {
          network,
          walletId,
          accountId,
        },
      });
      const gasBudgetResult = await queryGasBudgetFromDryRunResult({
        dryRunResult,
        apiClient,
        network,
      });
      setGasBudget(gasBudgetResult);
      setError(undefined);
    } catch (error) {
      setError(formatDryRunError(error));
    } finally {
      setLoading(false);
    }
  }, [txb, network]);

  return {
    data: {
      gasBudget,
    },
    loading,
    error,
  };
}
