import { CoinBalanceChangeItem } from '../../../types/gql/transactions';
import { formatCurrency } from '../../../utils/format';
import { TxItemDisplayType } from '../TransactionItem';

export default function formatTotalCoinChange(
  type: TxItemDisplayType,
  coinBalanceChanges: CoinBalanceChangeItem[]
): string {
  const operator = type === 'received' ? '+' : '-';
  return (
    operator +
    coinBalanceChanges
      .map(
        (item) =>
          `${formatCurrency(item.balance, {
            decimals: item.metadata.decimals,
          })} ${item.symbol}`
      )
      .join(', ')
  );
}
