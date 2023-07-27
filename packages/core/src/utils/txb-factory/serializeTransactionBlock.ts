import { TransactionBlock } from '@mysten/sui.js';

/**
 * Get a transaction block from a serialized string or a transaction block object.
 * @param input
 */
export default function serializeTransactionBlock(
  input: string | TransactionBlock
) {
  if (TransactionBlock.is(input)) {
    // deserialize transaction block string
    return input.serialize();
  } else {
    return input;
  }
}
