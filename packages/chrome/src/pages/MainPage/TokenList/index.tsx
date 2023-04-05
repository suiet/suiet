import classnames from 'classnames';
import type { StyleExtendable } from '../../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { Coin, useCoins } from '../../../hooks/useCoins';
import { isNonEmptyArray } from '../../../utils/check';
import { useMemo } from 'react';
import { Extendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import TokenIcon from '../../../components/TokenIcon';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import IconToken from '../../../assets/icons/token.svg';
import { formatCurrency } from '../../../utils/format';
// import TokenItem from '../../../components/TokenItem';
import { ReactComponent as VerifiedIcon } from '../../../assets/icons/verified.svg';
// export type TokenListProps = StyleExtendable;
import { useNetwork } from '../../../hooks/useNetwork';
import { Link, useNavigate } from 'react-router-dom';
import Network from '../../SettingsPage/network';
import { useQuery } from '@apollo/client';
import { GET_DELEGATED_STAKES } from '../../../utils/graphql/query';

export type TokenListProps = StyleExtendable;

type TokenItemProps = Extendable & {
  symbol: string;
  amount?: number | string;
};

const TokenItem = (props: TokenItemProps) => {
  const { amount = 0 } = props;
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: network } = useNetwork(appContext.networkId);

  const { address } = useAccount(appContext.accountId);
  const { data: delegatedStakesResult, loading: stakesLoading } = useQuery(
    GET_DELEGATED_STAKES,
    {
      variables: {
        address,
      },
      skip: !address,
    }
  );
  const delegatedStakes = delegatedStakesResult?.delegatedStakes;
  const stakedBalance =
    delegatedStakes?.reduce((accumulator, current) => {
      const sum = current.stakes.reduce(
        (stakesAccumulator, stake) => stakesAccumulator + stake.principal,
        0
      );
      return accumulator + sum;
    }, 0) ?? 0;
  return (
    <Link
      className={classnames(
        styles['token-item'],

        // fixme: should not use symbol to determine coin
        props.symbol === 'SUI' ? styles['token-item-sui'] : null
      )}
      to={'/coin/detail/' + props.symbol}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex">
          <TokenIcon
            icon={props.symbol === 'SUI' ? IconWaterDrop : IconToken}
            alt="water-drop"
            className={
              props.symbol === 'SUI' ? '' : styles['icon-wrap-default']
            }
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
            <div className="flex gap-1">
              <Typo.Small
                className={classnames(
                  styles['token-amount'],
                  props.symbol === 'SUI' ? styles['token-amount-sui'] : null
                )}
              >
                {/* TODO: pass decimals for each different coin */}
                {formatCurrency(amount, { decimals: 9, withAbbr: false })}
              </Typo.Small>

              {props.symbol === 'SUI' && network?.enableStaking && (
                <>
                  <Typo.Small
                    className={classnames('inline', styles['token-amount'])}
                    style={{ color: 'rgba(0,0,0,0.3)' }}
                  >
                    +
                  </Typo.Small>
                  <Typo.Small
                    className={classnames(
                      'inline',
                      styles['token-amount'],
                      props.symbol === 'SUI' ? styles['token-amount'] : null
                    )}
                    style={{ color: '#0096FF' }}
                  >
                    {formatCurrency(stakedBalance, {
                      decimals: 9,
                      withAbbr: false,
                    })}{' '}
                    Staked
                  </Typo.Small>
                </>
              )}
            </div>
          </div>
        </div>
        {/* {props.symbol === 'SUI' && network?.enableStaking && (
          <button
            className={styles['click-button']}
            onClick={(e) => {
              // to={'/staking'}
              e.preventDefault();
              e.stopPropagation();
              navigate('/staking');
            }}
          >
            Stake
          </button>
        )} */}
      </div>
    </Link>
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
