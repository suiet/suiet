import classnames from 'classnames';
import type { Extendable, StyleExtendable } from '../../../types';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import styles from './index.module.scss';
import TokenIcon from '../../../components/TokenIcon';
import { useSupportedCoins } from '../../../hooks/useSupportedCoins';
import Typo from '../../../components/Typo';
import { useCoinBalance } from '../../../hooks/useCoinBalance';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';

export type TokenListProps = StyleExtendable;

type TokenItemProps = Extendable & {
  symbol: string;
  amount?: number | string;
};

const TokenItem = (props: TokenItemProps) => {
  const { amount = 0 } = props;
  return (
    <div className={styles['token-item']}>
      <div className="flex items-center">
        <TokenIcon icon={IconWaterDrop} alt="water-drop" />
        <div className={'flex flex-col ml-[32px]'}>
          <Typo.Normal className={classnames(styles['token-name'])}>
            {props.symbol}
          </Typo.Normal>
          <Typo.Small className={classnames(styles['token-amount'])}>
            {amount ?? '0'}
          </Typo.Small>
        </div>
      </div>
    </div>
  );
};

const TokenList = (props: TokenListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: supportedCoins } = useSupportedCoins();
  const { account } = useAccount(appContext.accountId);
  const { getBalance } = useCoinBalance(account.address);

  if (!supportedCoins) return null;
  return (
    <div className={classnames(props.className)} style={props.style}>
      {supportedCoins.map((coin) => {
        return (
          <TokenItem
            key={coin.packageId}
            symbol={coin.symbol}
            amount={getBalance(coin.symbol)}
          />
        );
      })}
    </div>
  );
};

export default TokenList;
