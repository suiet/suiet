import { TxItemDisplayType } from '../TransactionItem';

export default function formatTxType(
  type: string,
  kind?: string,
  category?: string
): TxItemDisplayType {
  if (category === 'transfer_coin') {
    if (type === 'incoming') return 'received';
    if (type === 'outgoing') {
      if (kind === 'Call') return 'moveCall';
      return 'sent';
    }
  }

  return kind as TxItemDisplayType;
}
