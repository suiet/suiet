import { TransactionBlock } from '@mysten/sui.js';

export default function getGasBudgetFromTxb(
  txb: TransactionBlock | undefined,
  fallback?: string
): string | undefined {
  return txb?.blockData?.gasConfig?.budget ?? fallback;
}
