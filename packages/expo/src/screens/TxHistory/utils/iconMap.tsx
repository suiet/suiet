import type { AvailableIcon } from '@suiet/chrome-ext/src/components/icons/Icon';

import {
  SvgArrowDown,
  SvgArrowUp,
  SvgClockRewind,
  SvgCoins03,
  SvgCube01,
  SvgHash02,
  SvgInbox01,
  SvgSwitchHorizontal01,
  SvgXClose,
} from '@/components/icons/svgs';
import { SvgPlus } from '@/components/icons/svgs';

export const iconMap: Record<AvailableIcon, string | undefined> = {
  Up: SvgArrowUp,
  Down: SvgArrowDown,
  Add: SvgPlus,
  Txn: SvgInbox01,
  Mint: SvgInbox01,
  Swap: SvgSwitchHorizontal01,
  Coin: SvgCoins03,
  Object: SvgCube01,
  Sui: undefined,
  History: SvgClockRewind,
  Close: SvgXClose,
  HashTag: SvgHash02,
  Time: undefined,
  Wallet: undefined,
  Copy: undefined,
  Trash: undefined,
  Warning: undefined,
};
