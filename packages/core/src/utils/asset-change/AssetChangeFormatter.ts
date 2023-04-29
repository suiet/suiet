import {
  ICoinChangeObject,
  INftChangeObject,
  IObjectChangeObject,
} from './AssetChangeAnalyzer';
import { Coin, SUI_TYPE_ARG } from '@mysten/sui.js';
import { formatCurrency } from '../format';

export type FormatAssetChangeOutput = {
  title: string;
  desc: string;
  icon: 'coin' | 'sui' | 'object' | string;
  iconShape: 'circle' | 'square';
  iconColor: 'gray' | 'blue' | 'purple';
  changeTitle: string;
  changeDesc: string;
  changeTitleColor: 'red' | 'green' | 'orange' | 'gray';
};

export type FormatAssetChangeInput =
  | IObjectChangeObject
  | ICoinChangeObject
  | INftChangeObject;

export default class AssetChangeFormatter {
  static format(input: FormatAssetChangeInput) {
    if ('amount' in input) {
      return formatCoinChange(input as ICoinChangeObject);
    }
    if ('display' in input) {
      return formatNftChange(input as INftChangeObject);
    }
    return formatObjectChange(input as IObjectChangeObject);
  }

  static title(input: FormatAssetChangeInput): string {
    return AssetChangeFormatter.format(input).title;
  }

  static desc(input: FormatAssetChangeInput): string {
    return AssetChangeFormatter.format(input).desc;
  }

  static changeTitle(input: FormatAssetChangeInput): string {
    return AssetChangeFormatter.format(input).changeTitle;
  }

  static changeTitleColor(input: FormatAssetChangeInput): string {
    return AssetChangeFormatter.format(input).changeTitleColor;
  }
}

export function formatCoinChange(
  input: ICoinChangeObject
): FormatAssetChangeOutput {
  const symbol = Coin.getCoinSymbol(input.coinType).toUpperCase();

  const operator = input.changeType === 'receive' ? '+' : '-';
  const amountValue = input.amount.replace('-', '');
  const amount = formatCurrency(amountValue, {
    withAbbr: false,
    decimals: input.coinType === SUI_TYPE_ARG ? 9 : input.decimals,
  });

  return {
    title: `${symbol}`,
    desc: input.coinType,
    icon: input.coinType === SUI_TYPE_ARG ? 'sui' : 'coin',
    iconShape: 'circle',
    iconColor: input.coinType === SUI_TYPE_ARG ? 'blue' : 'purple',
    changeTitle: `${operator}${amount} ${symbol}`,
    changeDesc: '',
    changeTitleColor: input.changeType === 'receive' ? 'green' : 'red',
  };
}

function handleNftDisplay(display: Record<string, any>): {
  name: string;
  imageUrl: string;
} {
  return {
    name: display.description || display.name || 'Object',
    imageUrl: display.image_url || 'object',
  };
}

export function formatNftChange(
  input: INftChangeObject
): FormatAssetChangeOutput {
  let changeTitle = '';
  let changeDesc = '';
  let changeTitleColor = '';
  if (input.changeType === 'receive') {
    changeTitle = '+1 NFT';
    changeTitleColor = 'green';
  } else if (input.changeType === 'send') {
    changeTitle = '-1 NFT';
    changeTitleColor = 'red';
  } else if (input.changeType === 'update') {
    changeTitle = 'MODIFIED';
    changeTitleColor = 'orange';
  }

  const { name, imageUrl } = handleNftDisplay(input.display);

  return {
    title: name,
    desc: input.objectId,
    icon: imageUrl,
    iconShape: 'square',
    iconColor: 'gray',
    changeTitle,
    changeTitleColor: changeTitleColor as any,
    changeDesc,
  };
}

export function formatObjectChange(
  input: IObjectChangeObject
): FormatAssetChangeOutput {
  let changeTitle = '';
  let changeDesc = '';
  let changeTitleColor = '';
  if (input.changeType === 'receive') {
    changeTitle = '+1 Object';
    changeTitleColor = 'green';
  } else if (input.changeType === 'send') {
    changeTitle = '-1 Object';
    changeTitleColor = 'red';
  } else if (input.changeType === 'update') {
    changeTitle = 'MODIFIED';
    changeTitleColor = 'orange';
  }
  return {
    title: 'Object',
    desc: input.objectType,
    icon: 'object',
    iconShape: 'square',
    iconColor: 'gray',
    changeTitle,
    changeTitleColor: changeTitleColor as any,
    changeDesc,
  };
}
