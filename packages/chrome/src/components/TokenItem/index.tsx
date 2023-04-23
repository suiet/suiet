import type { Extendable } from '../../types';
import classnames from 'classnames';
import { formatCurrency } from '@suiet/core';
import TokenIcon from '../TokenIcon';
import Typo from '../Typo';
import IconWaterDrop from '../../assets/icons/waterdrop.svg';
import IconToken from '../../assets/icons/token.svg';
import styles from './index.module.scss';
import { useState } from 'react';

type TokenItemProps = Extendable & {
  symbol: string;
  amount?: number | string;
  iconUrl?: string;
  decimals?: number;
  onClick?: (symbol: string) => void;
  selected?: boolean;
  isVerified: boolean;
};

const TokenIconUrl: Record<string, string> = {
  SUI: IconWaterDrop,
  DEFAULT: IconToken,
};

const TokenItem = (props: TokenItemProps) => {
  const {
    amount = 0,
    symbol,
    iconUrl,
    decimals = 0,
    onClick,
    selected,
    isVerified,
  } = props;

  let tokenIcon = TokenIconUrl[symbol] || TokenIconUrl.DEFAULT;
  if (iconUrl) {
    tokenIcon = iconUrl;
  }

  return (
    <div
      className={classnames(
        styles['token-item'],
        symbol === 'SUI' ? styles['token-item-sui'] : null,
        selected && styles['selected'],
        onClick && styles['clickable']
      )}
      onClick={() => {
        onClick && onClick(symbol);
      }}
    >
      <div className="flex items-center">
        <TokenIcon
          icon={tokenIcon}
          alt="water-drop"
          className={props.symbol === 'SUI' ? '' : styles['icon-wrap-default']}
        />
        <div className={'flex flex-col ml-[32px]'}>
          <Typo.Normal
            className={classnames(
              styles['token-name'],
              props.symbol === 'SUI' ? styles['token-name-sui'] : null
            )}
          >
            {symbol}
          </Typo.Normal>
          <Typo.Small
            className={classnames(
              styles['token-amount'],
              props.symbol === 'SUI' ? styles['token-amount-sui'] : null
            )}
          >
            {formatCurrency(amount, { decimals })}
          </Typo.Small>
        </div>
      </div>
    </div>
  );
};

export default TokenItem;
