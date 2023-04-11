import { CoinBalanceChangeItem } from '../../../types/gql/transactions';
import { formatCurrency } from '@suiet/core';

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
