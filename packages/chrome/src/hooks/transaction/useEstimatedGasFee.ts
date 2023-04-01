import {
  DryRunTransactionBlockResponse,
  getTotalGasUsed,
  is,
  TransactionBlock,
} from '@mysten/sui.js';
import { useFeatureFlagsWithNetwork } from '../useFeatureFlags';

import useDryRunTransactionBlock from './useDryRunTransactionBlock';
import { bigint } from 'superstruct';

export function getEstimatedGasFeeFromDryRunResult(
  dryRunRes: DryRunTransactionBlockResponse | undefined,
  fallback: bigint = 0n
) {
  if (!dryRunRes) return;
  try {
    const res = getTotalGasUsed(dryRunRes.effects); // infer est budget from dryRun result
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
  const { data, ...rest } = useDryRunTransactionBlock(transactionBlock);
  const featureFlags = useFeatureFlagsWithNetwork();
  const fallbackGasFee = BigInt(featureFlags?.move_call_gas_budget ?? 10000);
  return {
    data: getEstimatedGasFeeFromDryRunResult(data, fallbackGasFee),
    ...rest,
  };
}
