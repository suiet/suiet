import { SUI_TYPE_ARG } from '@mysten/sui.js';

export default function isSuiToken(coinType: unknown): boolean {
  return coinType === SUI_TYPE_ARG;
}
