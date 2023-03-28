import { CoinBalanceChangeItem } from '../../../types/gql/transactions';
import { formatCurrency } from '../../../utils/format';
import { TxItemDisplayType } from '../TransactionItem';

export default function formatTotalCoinChange(
  type: TxItemDisplayType,
  coinBalanceChanges: CoinBalanceChangeItem[]
): string {
  return coinBalanceChanges
    .map(
      (item) =>
        `${formatCurrency(item.balance, {
          decimals: item.metadata.decimals,
        })} ${item.symbol}`
    )
    .join(', ');
}
