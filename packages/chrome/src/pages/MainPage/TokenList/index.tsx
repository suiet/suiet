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
import { ReactComponent as VerifiedIcon } from '../../../assets/icons/verified.svg';
import { ReactComponent as UnverifiedIcon } from '../../../assets/icons/unverified.svg';
import Tooltip from '../../../components/Tooltip';
import classNames from 'classnames';
// const images = require.context('../../../assets/img', true);
// loadImage = imageName => (assets(`./${imageName}`).default);

export type TokenListProps = StyleExtendable;

type TokenItemProps = Extendable & {
  type: string;
  symbol: string;
  balance: string;
  decimals: number;
  isVerified: boolean;
  iconURL: string | null;
  usd: string | null;
  pricePercentChange24h: string | null;
  wrappedChain: string | null;
  bridge: string | null;
};

const TokenItem = (props: TokenItemProps) => {
  const { balance = '0', decimals = 0, isVerified = false } = props;
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
      className={classNames(
        'hover:bg-zinc-50',
        'px-[25px]',
        styles['token-item'],
        { 'cursor-pointer': isSUI }
      )}
    >
      <div
        className={classNames(
          'py-[20px]',
          'border-t',
          // 'border',
          'border-gray-100',
          'w-full'
        )}
        onClick={handleClick}
      >
        <div className="flex  w-full flex-row items-center justify-between">
          <div className="flex w-full justify-between">
            <div className="relative">
              {props.iconURL ? (
                <img
                  className={classNames(
                    'w-[40px]',
                    'h-[40px]',
                    'rounded-full',
                    'mr-[25px]'
                  )}
                  src={props.iconURL}
                ></img>
              ) : (
                <TokenIcon
                  icon={isSUI ? IconWaterDrop : IconToken}
                  alt="water-drop"
                  className={classNames(
                    [isSUI ? '' : styles['icon-wrap-default']],
                    'mr-[25px]',
                    'grow-0'
                  )}
                />
              )}
              {props.wrappedChain && (
                <div
                  className={classNames(
                    'w-[20px]',
                    'h-[20px]',
                    'absolute',
                    'right-[20px]',
                    'bottom-0'
                  )}
                >
                  <Tooltip
                    className={classNames()}
                    message={`Wrapped from ${props.wrappedChain.toUpperCase()}`}
                  >
                    <img
                      className={classNames(
                        'rounded-full',
                        // 'border',
                        // 'border-black/10',

                        'bg-white'
                      )}
                      style={{
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                      }}
                      // src={`https://assets.suiet.app/chains/${props.wrappedChain}.png`}
                      src={`https://assets.suiet.app/img/chains/${props.wrappedChain}.png`}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
            <div className={classNames('flex', 'flex-col', 'grow')}>
              <div className="flex items-center gap-1">
                <Tooltip message={props.type}>
                  <Typo.Normal
                    className={classNames(
                      styles['token-name'],
                      isSUI ? styles['token-name-sui'] : null
                    )}
                  >
                    {props.symbol}
                  </Typo.Normal>
                </Tooltip>
                {isVerified ? (
                  <Tooltip message={'Verified'}>
                    <VerifiedIcon width={14} height={14} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    message={
                      'Unverified: proceed with caution and research before use'
                    }
                  >
                    <UnverifiedIcon width={16} height={16} />
                  </Tooltip>
                )}
                {props.bridge && (
                  <Tooltip message={`${props.bridge} bridge`}>
                    <img
                      className={classNames(
                        'w-[16px]',
                        'h-[16px]',
                        'rounded-md'
                      )}
                      style={{
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                      }}
                      src={`https://assets.suiet.app/img/bridges/${props.bridge}.png`}
                    ></img>
                  </Tooltip>
                )}
              </div>

              <div className={classNames('flex', 'gap-1', 'grow-0')}>
                <Typo.Small
                  className={classNames(
                    'text-gray-400',
                    styles['token-amount'],
                    isSUI ? styles['token-amount-sui'] : null
                  )}
                  style={{
                    fontFamily: 'Inter',
                  }}
                >
                  {formatCurrency(balance, {
                    decimals,
                    withAbbr: false,
                  })}
                  {' ' + props.symbol}
                </Typo.Small>

                {isSUI && network?.enableStaking && stakedBalance > 0 && (
                  <>
                    <Typo.Small
                      className={classNames('inline', styles['token-amount'])}
                      style={{ color: 'rgba(0,0,0,0.3)' }}
                    >
                      +
                    </Typo.Small>

                    <Typo.Small
                      className={classNames(
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

            <div
              className={classNames(
                'flex',
                'flex-col',
                'items-end',
                'justify-center'
              )}
            >
              {props.usd && (
                <div
                  className={classNames('font-medium')}
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                  }}
                >
                  $
                  {formatCurrency(Number(props.usd) * 10000, {
                    decimals: 4,
                  })}
                </div>
              )}
              {props.pricePercentChange24h && (
                <div
                  className={classNames([
                    'rounded-lg',
                    'text-medium',
                    Number(props.pricePercentChange24h) > 0 && [
                      'text-green-600',
                      'bg-green-100',
                    ],
                    Number(props.pricePercentChange24h) === 0 && [
                      'text-gray-600',
                      'bg-gray-100',
                    ],
                    Number(props.pricePercentChange24h) < 0 && [
                      'text-red-600',
                      'bg-red-100',
                    ],
                  ])}
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    padding: '2px 4px',
                  }}
                >
                  {Number(props.pricePercentChange24h) > 0 && '+'}
                  {Number(props.pricePercentChange24h) === 0 && ''}
                  {Number(props.pricePercentChange24h).toFixed(2)}%
                </div>
              )}
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
    </div>
  );
};

const TokenList = (props: TokenListProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(appContext.accountId);
  const {
    data: coins,
    loading: isLoading,
    error: coinsError,
  } = useCoins(address);
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

  if (isLoading || coinsError) return null;
  return (
    <div className={classNames(props.className)} style={props.style}>
      {coinsWithSuiOnTop.map((coin) => {
        return (
          <TokenItem
            key={coin.type}
            type={coin.type}
            symbol={coin.symbol}
            balance={coin.balance}
            decimals={coin.decimals}
            isVerified={coin.isVerified}
            iconURL={coin.iconURL}
            usd={coin.usd}
            pricePercentChange24h={coin.pricePercentChange24h}
            wrappedChain={coin.wrappedChain}
            bridge={coin.bridge}
          />
        );
      })}
    </div>
  );
};

export default TokenList;
