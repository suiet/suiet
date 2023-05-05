import { Network } from '@suiet/core';
import { useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { dryRunTransactionBlock } from '../../../hooks/transaction/useDryRunTransactionBlock';
import createTransferCoinTxb from '../utils/createTransferCoinTxb';
import { useApiClient } from '../../../hooks/useApiClient';
import { DEFAULT_GAS_BUDGET } from '../../../constants';
import formatDryRunError from '@suiet/core/src/utils/format/formatDryRunError';
import { queryGasBudgetFromDryRunResult } from '../../../hooks/transaction/useGasBudgetFromDryRun';
import useGasBudgetWithFallback from '../../../hooks/transaction/useGasBudgetWithFallback';
import { getTotalGasUsed } from '@mysten/sui.js';

export default function useGasBudgetForTransferCoin(params: {
  coinType: string;
  recipient: string;
  network: Network | undefined;
  walletId: string;
  accountId: string;
}) {
  const apiClient = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [gasBudget, setGasBudget] = useGasBudgetWithFallback();
  const [estimatedGasFee, setEstimatedGasFee] = useState<string>('0');

  useAsyncEffect(async () => {
    if (!params.network) return;
    if (!params.coinType) return;
    if (!params.recipient) return;
    if (loading) return;

    const txEssentials = {
      network: params.network,
      walletId: params.walletId,
      accountId: params.accountId,
    };

    const txb = await createTransferCoinTxb({
      apiClient: apiClient,
      context: txEssentials,
      recipient: params.recipient,
      coinType: params.coinType,
      amount: '1', // placeholder for dry run
    });
    txb.setGasBudget(DEFAULT_GAS_BUDGET);

    setLoading(true);
    try {
      const dryRunResult = await dryRunTransactionBlock({
        transactionBlock: txb,
        apiClient: apiClient,
        context: {
          network: params.network,
          walletId: params.walletId,
          accountId: params.accountId,
        },
      });
      const gasBudgetResult = await queryGasBudgetFromDryRunResult({
        apiClient,
        dryRunResult,
        network: params.network,
      });
      setGasBudget(gasBudgetResult);

      if (dryRunResult.effects) {
        const totalGasUsed = getTotalGasUsed(dryRunResult.effects) ?? 0n;
        setEstimatedGasFee(String(totalGasUsed));
      }
      setError(undefined);
    } catch (e: any) {
      const formattedErrMsg = formatDryRunError(e);
      setError(formattedErrMsg);
      setEstimatedGasFee('0');
    } finally {
      setLoading(false);
    }
  }, [params.network, params.coinType, params.recipient]);

  return {
    data: {
      gasBudget,
      estimatedGasFee,
    },
    loading,
    error,
  };
}
