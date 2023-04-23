import useCoinBalance from './useCoinBalance';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { QueryHookOptions } from '@apollo/client';

export default function useSuiBalance(
  address: string,
  options?: QueryHookOptions
) {
  return useCoinBalance(address, SUI_TYPE_ARG, options);
}
