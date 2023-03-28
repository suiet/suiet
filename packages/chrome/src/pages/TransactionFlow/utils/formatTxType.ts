import { TxItemDisplayType } from '../TransactionItem';

export default function formatTxType(
  type: string,
  kind?: string
): TxItemDisplayType {
  if (type === 'incoming') return 'received';
  if (type === 'outgoing') {
    if (kind === 'Call') return 'moveCall';
    return 'sent';
  }
  return 'unknown';
}
