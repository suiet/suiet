import {
  ICoinChangeObject,
  INftChangeObject,
  IObjectChangeObject,
  OriginalObjectChangeType,
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
}

export function formatCoinChange(
  input: ICoinChangeObject
): FormatAssetChangeOutput {
  const symbol = Coin.getCoinSymbol(input.coinType).toUpperCase();

  const operator = input.changeType === 'increase' ? '+' : '-';
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
    changeTitleColor: input.changeType === 'increase' ? 'green' : 'red',
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
  if (input.changeType === 'increase') {
    changeTitle = '+1 NFT';
    changeTitleColor = 'green';
  } else if (input.changeType === 'decrease') {
    changeTitle = '-1 NFT';
    changeTitleColor = 'red';
  } else if (input.changeType === 'modify') {
    changeTitle = 'MODIFY';
    changeTitleColor = 'orange';
  } else {
    changeTitle = verbForOriginalChangeType(input.type);
    changeTitleColor = colorForOriginalChangeType(input.type);
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

const originalChangeTypeColorMap = {
  created: 'green',
  mutated: 'orange',
  deleted: 'red',
  published: 'green',
  transferred: 'red',
  wrapped: 'orange',
};
function colorForOriginalChangeType(type: OriginalObjectChangeType): string {
  return originalChangeTypeColorMap[type] || 'orange';
}
const originalChangeTypeVerbMap = {
  created: 'CREATE',
  mutated: 'MUTATE',
  deleted: 'DELETE',
  published: 'PUBLISH',
  transferred: 'TRANSFER',
  wrapped: 'WRAP',
};
function verbForOriginalChangeType(type: OriginalObjectChangeType): string {
  return originalChangeTypeVerbMap[type];
}

export function formatObjectChange(
  input: IObjectChangeObject
): FormatAssetChangeOutput {
  let changeTitle = '';
  let changeDesc = '';
  let changeTitleColor = '';
  if (input.changeType === 'increase') {
    changeTitle = '+1 Object';
    changeTitleColor = 'green';
  } else if (input.changeType === 'decrease') {
    changeTitle = '-1 Object';
    changeTitleColor = 'red';
  } else if (input.changeType === 'modify') {
    changeTitle = 'MODIFY';
    changeTitleColor = 'orange';
  } else {
    changeTitle = verbForOriginalChangeType(input.type);
    changeTitleColor = colorForOriginalChangeType(input.type);
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
