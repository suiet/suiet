import { TransactionBlock } from '@mysten/sui.js';

/**
 * Get a transaction block from a serialized string or a transaction block object.
 * @param input
 */
export default function getTransactionBlock(input: string | TransactionBlock) {
  if (typeof input === 'string') {
    // deserialize transaction block string
    return TransactionBlock.from(input);
  } else {
    return input;
  }
}
