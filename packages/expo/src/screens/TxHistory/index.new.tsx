import React, { ReactElement, useMemo, useRef } from 'react';
import { View, FlatList, Image, Text } from 'react-native';
import dayjs from 'dayjs';

import { useTxnHistoryList } from '@suiet/chrome-ext/src/pages/txn/TxHistoryPage/hooks/useTxnHistoryList';
import { aggregateTxByTime } from '@suiet/chrome-ext/src/pages/txn/TxHistoryPage/utils/aggregateTxByTime';
import { orderTimeList } from '@suiet/chrome-ext/src/pages/txn/TxHistoryPage/utils/orderTimeList';
import { safe } from '@suiet/core/src/utils';

import { useWallets } from '@/hooks/useWallets';
import { LoadingDots } from '@/components/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVATARS } from '@/utils/constants';
import { Wallet } from '@/utils/wallet';
import Typography from '@/components/Typography';
import { Gray_400, Gray_900, TailwindColor, White } from '@/styles/colors';
import { Badge } from '@/components/Badge';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/../App';

import { TxSummaryContainer } from './components/TxSummaryContainer';
import { TxDateContainer } from './components/TxDateContainer';
import { TxSummaryItem } from './components/TxSummaryItem';

export const HistoryList: React.FC<{
  address: string;
  navigation: BottomTabNavigationProp<RootStackParamList, 'TxHistory'>;
}> = ({ address, navigation }) => {
  const {
    data: txnHistoryList,
    hasMore,
    error,
    fetchMore,
    loading,
  } = useTxnHistoryList(address, {
    limit: 10,
  });
  const today = useRef(dayjs().valueOf());

  const txByDateMap = useMemo(() => aggregateTxByTime(txnHistoryList, today.current), [txnHistoryList]);
  const days = useMemo(() => orderTimeList(Array.from(txByDateMap.keys())), [txByDateMap]);

  const data = useMemo(() => {
    // ComponentType, key, props
    // const items: Array<[string, string, Record<string, any>]> = [];
    const items: Array<ReactElement> = [];

    for (const day of days) {
      items.push(<TxDateContainer key={day} title={day} />);
      const txList = txByDateMap.get(day) ?? [];
      for (const txn of txList) {
        let { category, summary } = txn.display;

        items.push(
          <TxSummaryContainer
            key={safe(txn.digest)}
            category={safe(category?.text, 'Category')}
            categoryIcon={safe(category?.icon, '')}
            categoryColor={safe(category?.color, '') as TailwindColor}
            timestamp={safe(txn.timestamp, 0)}
          />
        );

        for (const [i, item] of summary.entries()) {
          const { assetChange, assetChangeDescription } = item;

          items.push(
            <TxSummaryItem
              key={item?.title + i}
              title={safe(item?.title, 'Unknown')}
              desc={safe(item?.description, '')}
              icon={safe(item?.icon, 'Txn')}
              changeTitle={safe(assetChange?.text, '')}
              changeTitleColor={safe(assetChange?.color, '')}
              changeDesc={safe(assetChangeDescription?.text, '')}
              changeDescColor={safe(assetChangeDescription?.color, '')}
              changeDescType={safe(assetChangeDescription?.icon, '') as any}
            />
          );
        }
      }

      items.push(<View key={day + '-end'} style={{ height: 8 }} />);
    }

    return items;
  }, [txByDateMap, days]);

  console.log(data);

  if (loading) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <LoadingDots />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ paddingHorizontal: 24 }}>
        <Badge title="Failed to load transcation history" variant="error" />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: White }}
      data={data}
      keyExtractor={(item) => String(item.key)}
      renderItem={({ item }) => item}
      stickyHeaderIndices={data
        .map((item, index) => [item, index] as const)
        .filter(([item]) => item.type === TxDateContainer)
        .map(([, index]) => index)}
      overScrollMode="never"
      onEndReached={() => {
        if (hasMore) {
          fetchMore();
        }
      }}
      ListFooterComponent={() => {
        if (hasMore) {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
              <LoadingDots />
            </View>
          );
        } else {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
              <Typography.Comment color={Gray_400} children="No more transactions" />
            </View>
          );
        }
      }}
      // ItemSeparatorComponent={
      //   process.env.NODE_ENV === 'development'
      //     ? () => <View style={{ height: 120, backgroundColor: Gray_100 }} />
      //     : undefined
      // }
    />
  );
};

export const TxHistory: React.FC<BottomTabScreenProps<RootStackParamList, 'TxHistory'>> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();

  const { selectedWallet, wallets } = useWallets();
  const walletsByAddress = React.useMemo(
    () => Object.fromEntries(wallets.map((wallet) => [wallet.address, wallet])),
    [wallets]
  );
  const wallet = walletsByAddress[selectedWallet!] as Wallet;

  if (!selectedWallet) {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top, paddingBottom: 64, flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 16 }}>
        <Image style={{ width: 32, height: 32 }} source={AVATARS[wallet.avatar]} />
        <Typography.Subtitle color={Gray_900} children={'History'} />
      </View>

      <HistoryList address={selectedWallet} navigation={navigation} />
    </View>
  );
};
