import { TransactionBlock } from '@mysten/sui.js';

/**
 * Serialize a transaction block to a string representation.
 * @param input A TransactionBlock object or a serialized string
 * @returns A serialized string representation of the transaction block
 */
export default function serializeTransactionBlock(
  input: string | TransactionBlock
): string {
  if (typeof input === 'string') {
    // If it's already a string, assume it's already serialized
    return input;
  } else if (TransactionBlock.is(input)) {
    // If it's a TransactionBlock object, serialize it
    return input.serialize();
  } else {
    throw new Error('Invalid input type for serializeTransactionBlock');
  }
}
