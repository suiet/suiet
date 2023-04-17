import useCoins from './useCoins';
import { QueryHookOptions } from '@apollo/client';
import { useMemo } from 'react';

export default function useCoinBalance(
  address: string,
  coinType: string,
  options?: QueryHookOptions
) {
  const { getCoinBalance, ...rest } = useCoins(address, options);
  const coinBalance = useMemo(
    () => getCoinBalance(coinType),
    [getCoinBalance, coinType]
  );
  return {
    ...rest,
    data: coinBalance,
  };
}
