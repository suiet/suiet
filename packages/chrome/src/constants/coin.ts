import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { CoinDto } from '../hooks/coin/useCoins';

export const DEFAULT_SUI_COIN: CoinDto = {
  type: SUI_TYPE_ARG,
  symbol: 'SUI',
  balance: '0',
  decimals: 9,
  isVerified: true,
  bridge: null,
  iconURL: null,
  pricePercentChange24h: null,
  usd: null,
  wrappedChain: null,
};

export const DEFAULT_GAS_BUDGET = 20_000_000;
