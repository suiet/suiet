import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { CoinDto } from '../hooks/coin/useCoins';

export const DEFAULT_SUI_COIN: CoinDto = {
  type: SUI_TYPE_ARG,
  symbol: 'SUI',
  balance: '0',
  decimals: 9,
  isVerified: true,
};

export const DEFAULT_GAS_BUDGET = 3_000_000;
