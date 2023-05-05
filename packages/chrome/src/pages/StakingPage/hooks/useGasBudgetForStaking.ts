import useGasBudgetWithFallback from '../../../hooks/transaction/useGasBudgetWithFallback';
import { useAsyncEffect } from 'ahooks';
import { createStakeTransaction } from '../utils';
import { DEFAULT_GAS_BUDGET } from '../../../constants';
import { dryRunTransactionBlock } from '../../../hooks/transaction/useDryRunTransactionBlock';
import { useApiClient } from '../../../hooks/useApiClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNetwork } from '../../../hooks/useNetwork';
import { useState } from 'react';
import { queryGasBudgetFromDryRunResult } from '../../../hooks/transaction/useGasBudgetFromDryRun';

export default function useGasBudgetForStaking(params: {
  selectedValidator: string;
}) {
  const [gasBudget, setGasBudget] = useGasBudgetWithFallback();
  const { selectedValidator } = params;
  const apiClient = useApiClient();
  const { walletId, accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { data: network } = useNetwork(networkId);
  const [loading, setLoading] = useState(false);

  useAsyncEffect(async () => {
    if (!selectedValidator) return;
    if (loading) return;

    // 1 SUI is the minimum amount to stake
    const MIN_STAKE_SUI_AMOUNT = 1_000_000_000;
    const tx = createStakeTransaction(
      BigInt(MIN_STAKE_SUI_AMOUNT),
      selectedValidator
    );
    tx.setGasBudget(DEFAULT_GAS_BUDGET);
    setLoading(true);
    try {
      const dryRunResult = await dryRunTransactionBlock({
        transactionBlock: tx,
        apiClient,
        context: {
          walletId,
          accountId,
          network,
        },
      });
      const gasBudgetResult = await queryGasBudgetFromDryRunResult({
        apiClient,
        dryRunResult,
        network,
      });
      setGasBudget(gasBudgetResult);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedValidator]);

  return {
    data: gasBudget,
    loading,
  };
}
