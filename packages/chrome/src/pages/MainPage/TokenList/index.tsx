import classnames from 'classnames';
import type { StyleExtendable } from '../../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { isNonEmptyArray, isSuiToken } from '../../../utils/check';
import { useMemo } from 'react';
import { Extendable } from '../../../types';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import TokenIcon from '../../../components/TokenIcon';
import IconWaterDrop from '../../../assets/icons/waterdrop.svg';
import IconToken from '../../../assets/icons/token.svg';
import { formatCurrency } from '@suiet/core';
import { useNetwork } from '../../../hooks/useNetwork';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_DELEGATED_STAKES } from '../../../utils/graphql/query';
import useCoins from '../../../hooks/coin/useCoins';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { DEFAULT_SUI_COIN } from '../../../constants/coin';

export type TokenListProps = StyleExtendable;

type TokenItemProps = Extendable & {
  type: string;
  symbol: string;
  balance: string;
  decimals: number;
};

const TokenItem = (props: TokenItemProps) => {
  const { balance = '0', decimals = 0 } = props;
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
  const isSUI = isSuiToken(props.type);

  function handleClick() {
    // TODO: support other coins for detail page
    if (isSUI) {
      navigate(`/coin/detail/${props.type}`);
    }
  }
  return (
    <div
      className={classnames(
        styles['token-item'],
        // fixme: should not use symbol to determine coin
        isSUI ? styles['token-item-sui'] : null,
        { 'cursor-pointer': isSUI }
      )}
      onClick={handleClick}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex">
          <TokenIcon
            icon={isSUI ? IconWaterDrop : IconToken}
            alt="water-drop"
            className={isSUI ? '' : styles['icon-wrap-default']}
          />
          <div className={'flex flex-col ml-[32px]'}>
            <Typo.Normal
              className={classnames(
                styles['token-name'],
                isSUI ? styles['token-name-sui'] : null
              )}
            >
              {props.symbol}
            </Typo.Normal>
            <div className="flex gap-1">
              <Typo.Small
                className={classnames(
                  styles['token-amount'],
                  isSUI ? styles['token-amount-sui'] : null
                )}
              >
                {formatCurrency(balance, {
                  decimals: decimals,
                  withAbbr: false,
                })}
              </Typo.Small>

              {isSUI && network?.enableStaking && stakedBalance > 0 && (
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
                      isSUI ? styles['token-amount'] : null
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
        {/* {props.type === SUI_TYPE_ARG && network?.enableStaking && (
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
    </div>
  );
};

const TokenList = (props: TokenListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const { data: coins } = useCoins(address);
  const coinsWithSuiOnTop = useMemo(() => {
    if (!isNonEmptyArray(coins)) return [DEFAULT_SUI_COIN];

    const result = coins;
    const suiCoinIndex = result.findIndex((item) => item.type === SUI_TYPE_ARG);
    if (suiCoinIndex !== -1) {
      const suiCoin = result[suiCoinIndex];
      result.splice(suiCoinIndex, 1);
      result.unshift(suiCoin);
    }
    return result;
  }, [coins]);

  return (
    <div className={classnames(props.className)} style={props.style}>
      {coinsWithSuiOnTop.map((coin) => {
        return (
          <TokenItem
            key={coin.type}
            type={coin.type}
            symbol={coin.symbol}
            balance={coin.balance}
            decimals={coin.decimals}
          />
        );
      })}
    </div>
  );
};

export default TokenList;
