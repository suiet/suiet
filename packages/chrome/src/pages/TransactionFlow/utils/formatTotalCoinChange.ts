import { CoinBalanceChangeItem } from '../../../types/gql/transactions';
import { formatCurrency } from '../../../utils/format';
import { TxItemDisplayType } from '../TransactionItem';

export default function formatTotalCoinChange(
  coinBalanceChanges: CoinBalanceChangeItem[]
): string {
  return coinBalanceChanges
    .map((item) => {
      let coinChange = formatCurrency(item.balance, {
        decimals: item.metadata.decimals,
      });
      if (!coinChange.startsWith('-')) {
        coinChange = '+' + coinChange;
      }
      return `${coinChange} ${item.symbol}`;
    })
    .join(', ');
}
