import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import IconToken from '../../../assets/icons/token.svg';
import styles from './index.module.scss';
import TokenIcon from '../../../components/TokenIcon';
import Typo from '../../../components/Typo';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { fullyFormatCurrency } from '../../../utils/format';
import { Coin, useCoins } from '../../../hooks/useCoins';
import { isNonEmptyArray } from '../../../utils/check';
import { useMemo } from 'react';

export type TokenListProps = StyleExtendable;

type TokenItemProps = Extendable & {
  symbol: string;
  amount?: number | string;
};

const TokenItem = (props: TokenItemProps) => {
  const { amount = 0 } = props;

  return (
    <div
      className={classnames(
        styles['token-item'],
        props.symbol === 'SUI' ? styles['token-item-sui'] : null
      )}
    >
      <div className="flex items-center">
        <TokenIcon
          icon={props.symbol === 'SUI' ? IconWaterDrop : IconToken}
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
            {props.symbol}
          </Typo.Normal>
          <Typo.Small
            className={classnames(
              styles['token-amount'],
              props.symbol === 'SUI' ? styles['token-amount-sui'] : null
            )}
          >
            {fullyFormatCurrency(amount)}
          </Typo.Small>
        </div>
      </div>
    </div>
  );
};

const TokenList = (props: TokenListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const { data: coins } = useCoins(address, appContext.networkId);
  const coinsWithSuiOnTop = useMemo(() => {
    if (!isNonEmptyArray(coins)) return [];

    const result = coins as Coin[];
    const suiCoinIndex = result.findIndex((item) => item.symbol === 'SUI');
    if (suiCoinIndex !== -1) {
      const suiCoin = result[suiCoinIndex];
      result.splice(suiCoinIndex, 1);
      result.unshift(suiCoin);
    }
    return result;
  }, [coins]);

  if (!isNonEmptyArray(coinsWithSuiOnTop)) {
    return (
      <div className={classnames(props.className)} style={props.style}>
        <TokenItem key={'SUI'} symbol={'SUI'} amount={0} />
      </div>
    );
  }
  return (
    <div className={classnames(props.className)} style={props.style}>
      {coinsWithSuiOnTop.map((coin) => {
        return (
          <TokenItem
            key={coin.symbol}
            symbol={coin.symbol}
            amount={coin.balance}
          />
        );
      })}
    </div>
  );
};

export default TokenList;
