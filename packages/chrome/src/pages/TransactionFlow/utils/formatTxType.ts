import { TxItemDisplayType } from '../TransactionItem';

export default function formatTxType(
  type: string,
  kind?: string,
  category?: string
): TxItemDisplayType {
  if (category === 'transfer_coin') {
    if (type === 'incoming') return 'received';
    if (type === 'outgoing') return 'sent';
  }

  return kind as TxItemDisplayType;
}
