import { TransactionType } from '@mysten/sui.js';

export default function isMoveCall(tx: TransactionType): boolean {
  return tx?.kind === 'MoveCall';
}
