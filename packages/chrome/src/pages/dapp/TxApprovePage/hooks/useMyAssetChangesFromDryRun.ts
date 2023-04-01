import { useFeatureFlagsWithNetwork } from '../../../../hooks/useFeatureFlags';
import useDryRunTransactionBlock from '../../../../hooks/transaction/useDryRunTransactionBlock';
import { getEstimatedGasFeeFromDryRunResult } from '../../../../hooks/transaction/useEstimatedGasFee';
import {
  DryRunTransactionBlockResponse,
  TransactionBlock,
} from '@mysten/sui.js';

function getBalanceChangesFromDryRunResult(
  dryRunResult: DryRunTransactionBlockResponse | undefined,
  addressOwnder?: string
) {
  if (!dryRunResult) return;
  const balanceChanges = dryRunResult.balanceChanges.filter((item) => {
    return addressOwnder
      ? (item.owner as any)?.AddressOwner === addressOwnder
      : true;
  });
  return balanceChanges;
}

export default function useMyAssetChangesFromDryRun(
  address: string | undefined,
  transactionBlock: TransactionBlock | undefined
) {
  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasFee = BigInt(featureFlags?.move_call_gas_budget ?? 10000);
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
