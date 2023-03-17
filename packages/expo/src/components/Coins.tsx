import { Text, View, ColorValue, ViewProps, TouchableOpacity } from 'react-native';
import * as React from 'react';
import { Gray_900, Secondary_50 } from '@styles/colors';
import { CoinIcon } from '@components/CoinIcon';
import { formatCurrency } from '@/utils/format';
import { useQuery } from '@apollo/client';
import { GET_COINS } from '@/utils/gql';
import { LoadingDots } from '@/components/Loading';
import { FontFamilys } from '@/hooks/useFonts';

const ListItem: React.FC<
  { backgroundColor: ColorValue; textColor: ColorValue; symbol: string; balance: string } & ViewProps
> = ({ backgroundColor, textColor, symbol, balance, style, ...props }) => {
  return (
    <View
      style={[
        {
          height: 72,
          borderRadius: 16,
          backgroundColor,
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
        <CoinIcon symbol={symbol} />
      </View>
      <Text
        style={{
          flexGrow: 1,
          flexShrink: 0,
          fontFamily: FontFamilys.Inter_600SemiBold,
          fontSize: 19,
          lineHeight: 19,
          color: textColor,
        }}
      >
        {symbol}
      </Text>
      <Text
        style={{
          flexGrow: 0,
          flexShrink: 0,
          fontFamily: FontFamilys.Inter_600SemiBold,
          fontSize: 19,
          lineHeight: 19,
          color: textColor,
        }}
      >
        {balance}
      </Text>
    </View>
  );
};

export const Coins: React.FC<{ address: string; onChooseCoin?: (coin: any) => void }> = ({ address, onChooseCoin }) => {
  const { loading, error, data } = useQuery<{
    coins: any[];
  }>(GET_COINS, {
    variables: {
      address,
      coin: [],
    },
    fetchPolicy: 'no-cache',
  });

  const normalizedCoins = React.useMemo(() => {
    const defaultCoin = {
      balance: '0',
      isVerified: true,
      iconURL: '',
      description: '',
      symbol: 'SUI',
      type: '0x2::coin::Coin<0x2::sui::SUI>',
      metadata: {
        decimals: 9,
      },
    };

    if (!data) {
      return [defaultCoin];
    }

    if (data.coins.length === 0) {
      return [defaultCoin];
    }

    return data.coins;
  }, [data]);

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

  return (
    <>
      {normalizedCoins.map((item, i) => {
        const backgroundColor = Secondary_50;
        const textColor = Gray_900;
        const listItem = (
          <ListItem
            backgroundColor={backgroundColor}
            textColor={textColor}
            symbol={item.symbol}
            balance={formatCurrency(item.balance, item.metadata?.decimals)}
          />
        );
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
