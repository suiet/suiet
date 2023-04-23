import { useFeatureFlagsWithNetwork } from '../../../../hooks/useFeatureFlags';
import useDryRunTransactionBlock from '../../../../hooks/transaction/useDryRunTransactionBlock';
import { getEstimatedGasFeeFromDryRunResult } from '../../../../hooks/transaction/useEstimatedGasFee';
import {
  DryRunTransactionBlockResponse,
  TransactionBlock,
} from '@mysten/sui.js';
import { DEFAULT_GAS_BUDGET } from '../../../../constants';

function getBalanceChangesFromDryRunResult(
  dryRunResult: DryRunTransactionBlockResponse | undefined,
  addressOwner?: string
) {
  if (!dryRunResult) return;
  const balanceChanges = dryRunResult.balanceChanges.filter((item) => {
    return addressOwner
      ? (item.owner as any)?.AddressOwner === addressOwner
      : true;
  });
  return balanceChanges;
}

export default function useMyAssetChangesFromDryRun(
  address: string | undefined,
  transactionBlock: TransactionBlock | undefined
) {
  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasFee = BigInt(
    featureFlags?.move_call_gas_budget ?? DEFAULT_GAS_BUDGET
  );
  const { data: dryRunResult, ...rest } =
    useDryRunTransactionBlock(transactionBlock);
  const estimatedGasFee = getEstimatedGasFeeFromDryRunResult(
    dryRunResult,
    fallbackGasFee
  );
  const coinBalanceChanges = getBalanceChangesFromDryRunResult(
    dryRunResult,
    address
  );

  return {
    data: {
      estimatedGasFee,
      coinBalanceChanges,
    },
    ...rest,
  };
}
