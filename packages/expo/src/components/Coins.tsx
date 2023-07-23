import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native';

import { Badge } from '@/components/Badge';
import { LoadingDots } from '@/components/Loading';
import Typography from '@/components/Typography';
import { useNetwork } from '@/hooks/useNetwork';
import { useSkipFirstEffect } from '@/hooks/useSkipFirstEffect';
import { formatCurrency } from '@/utils/format';
import { useQuery } from '@apollo/client';
import { CoinIcon } from '@components/CoinIcon';
import { SUI_TYPE_ARG } from '@mysten/sui.js';
import { Gray_100, Gray_400, Gray_900, Green_100, Green_500, Primary_25, Red_100, Red_400 } from '@styles/colors';
import { DEFAULT_SUI_COIN } from '@suiet/chrome-ext/src/constants/coin';
import { useCoins } from '@suiet/chrome-ext/src/hooks/coin/useCoins';
import isNonEmptyArray from '@suiet/chrome-ext/src/utils/check/isNonEmptyArray';
import isSuiToken from '@suiet/chrome-ext/src/utils/check/isSuiToken';
import { GET_DELEGATED_STAKES } from '@suiet/chrome-ext/src/utils/graphql/query';

import type { CoinDto } from '@suiet/chrome-ext/src/hooks/coin/useCoins';
const ListItem: React.FC<{ item: CoinDto; showStaking?: boolean; address: string } & ViewProps> = ({
  item,
  style,
  item: props,
  address,
  showStaking,
}) => {
  const isSUI = isSuiToken(props.type);
  const { network } = useNetwork();

  const { data: delegatedStakesResult, loading: stakesLoading } = useQuery(GET_DELEGATED_STAKES, {
    variables: {
      address,
    },
    skip: !address || !showStaking,
  });

  const delegatedStakes = delegatedStakesResult?.delegatedStakes;
  const stakedBalance =
    // @ts-ignore
    delegatedStakes?.reduce((accumulator, current) => {
      // @ts-ignore
      const sum = current.stakes.reduce((stakesAccumulator, stake) => stakesAccumulator + stake.principal, 0);
      return accumulator + sum;
    }, 0) ?? 0;

  return (
    <View
      style={[
        {
          height: 72,
          borderRadius: 16,
          backgroundColor: Primary_25,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          marginTop: 6,
          marginBottom: 6,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ marginRight: 12 }}>
        <CoinIcon symbol={item.symbol} />
      </View>
      <View style={{ flexGrow: 1, flexShrink: 0 }}>
        <View style={{ flexDirection: 'column' }}>
          <Typography.Label children={item.symbol} color={Gray_900} />
          <Typography.NumS color={Gray_400}>
            {props.balance && (
              <>
                {formatCurrency(item.balance, {
                  decimals: item.decimals,
                  withAbbr: false,
                })}{' '}
                {item.symbol}
              </>
            )}

            {isSUI && network?.enable_staking && showStaking && (
              <>
                <Text style={{ color: 'rgba(0,0,0,0.3)' }}> + </Text>
                <Text style={{ color: '#0096FF' }}>
                  {formatCurrency(stakedBalance, {
                    decimals: 9,
                    withAbbr: false,
                  })}{' '}
                  Staked
                </Text>
              </>
            )}
          </Typography.NumS>
        </View>
      </View>
      <View style={{ flexGrow: 0, flexShrink: 0 }}>
        {props.usd && (
          <Typography.Label>
            $
            {formatCurrency(Number(props.usd) * 10000, {
              decimals: 4,
            })}
          </Typography.Label>
        )}
        {props.pricePercentChange24h && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text
              style={[
                {
                  borderRadius: 6,
                  paddingHorizontal: 4,
                  height: 20,
                },
                Number(props.pricePercentChange24h) > 0 && {
                  backgroundColor: Green_100,
                },
                Number(props.pricePercentChange24h) === 0 && {
                  backgroundColor: Gray_100,
                },
                Number(props.pricePercentChange24h) < 0 && {
                  backgroundColor: Red_100,
                },
              ]}
            >
              <Typography.NumS
                children={
                  <>
                    {Number(props.pricePercentChange24h) > 0 && '+'}
                    {Number(props.pricePercentChange24h) === 0 && ''}
                    {Number(props.pricePercentChange24h).toFixed(2)}%
                  </>
                }
                color={
                  StyleSheet.flatten([
                    Number(props.pricePercentChange24h) > 0 && {
                      color: Green_500,
                    },
                    Number(props.pricePercentChange24h) === 0 && {
                      color: Gray_400,
                    },
                    Number(props.pricePercentChange24h) < 0 && {
                      color: Red_400,
                    },
                  ]).color
                }
              />
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const CoinsNew: React.FC<{
  address: string;
  refreshControl?: number;
  onChooseCoin?: (coin: CoinDto) => void;
}> = ({ address, refreshControl, onChooseCoin }) => {
  const {
    data: coins,
    loading,
    error,
    refetch,
  } = useCoins(address, {
    pollInterval: 0,
    fetchPolicy: 'network-only',
  });

  const coinsWithSuiOnTop = React.useMemo(() => {
    if (!isNonEmptyArray(coins)) return [DEFAULT_SUI_COIN];
    return coins.slice().sort((a, b) => {
      if (a.type === SUI_TYPE_ARG) {
        return -1;
      } else if (b.type === SUI_TYPE_ARG) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [coins]);

  useSkipFirstEffect(() => {
    refetch();
  }, [refreshControl]);

  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <LoadingDots />
      </View>
    );
  }

  if (error) {
    return <Badge title="Failed to load coins" variant="error" />;
  }

  return (
    <>
      {coinsWithSuiOnTop.map((item, i) => {
        const backgroundColor = Primary_25;
        const textColor = Gray_900;
        const listItem = <ListItem address={address} item={item} showStaking />;
        if (typeof onChooseCoin === 'function') {
          return (
            <TouchableOpacity key={i} onPress={() => onChooseCoin(item)}>
              {listItem}
            </TouchableOpacity>
          );
        } else {
          return <React.Fragment key={i}>{listItem}</React.Fragment>;
        }
      })}
    </>
  );
};
