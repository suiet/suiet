import {
  DryRunTransactionBlockResponse,
  is,
  TransactionBlock,
  getTotalGasUsedUpperBound,
} from '@mysten/sui.js';
import { useFeatureFlagsWithNetwork } from '../useFeatureFlags';

import useDryRunTransactionBlock from './useDryRunTransactionBlock';
import { bigint } from 'superstruct';

export function getEstimatedGasFeeFromDryRunResult(
  dryRunRes: DryRunTransactionBlockResponse | undefined,
  fallback: bigint = 0n
) {
  if (!dryRunRes) return fallback;
  try {
    const res = getTotalGasUsedUpperBound(dryRunRes.effects); // infer est budget from dryRun result
    // return estimated budget based on the response of dryRun
    return is(res, bigint()) ? res : fallback;
  } catch (e) {
    // if failed, return default gas budget
    return fallback;
  }
}
export default function useEstimatedGasFee(
  transactionBlock: TransactionBlock | undefined
) {
  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasFee = BigInt(
    featureFlags?.move_call_gas_budget ?? 1_000_000_000
  );

  const txb = new TransactionBlock(transactionBlock);
  txb.setGasBudget(1_000_000_000);

  const { data, ...rest } = useDryRunTransactionBlock(txb);
  return {
    data: getEstimatedGasFeeFromDryRunResult(data, fallbackGasFee),
    ...rest,
  };
}
