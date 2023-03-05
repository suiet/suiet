import classnames from 'classnames';
import type { StyleExtendable } from '../../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { Coin, useCoins } from '../../../hooks/useCoins';
import { isNonEmptyArray } from '../../../utils/check';
import { useMemo } from 'react';
import TokenItem from '../../../components/TokenItem';

export type TokenListProps = StyleExtendable;

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
