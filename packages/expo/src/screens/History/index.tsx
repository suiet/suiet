import React, { useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import dayjs from 'dayjs';

import {
  useTransactionListForHistory,
  TransactionForHistory,
  CoinBalanceChangeItem,
} from '@/hooks/useTransactionListForHistory';
import { useWallets } from '@/hooks/useWallets';
import { LoadingDots } from '@/components/Loading';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVATARS } from '@/utils/constants';
import { Wallet } from '@/utils/wallet';
import Typography from '@/components/Typography';
import { Error_500, Gray_100, Gray_400, Gray_900, White_100 } from '@/styles/colors';
import { groupBy, uniqBy, upperFirst, mapValues } from 'lodash-es';
import { CoinIcon } from '@/components/CoinIcon';
import { addressEllipsis, formatCurrency } from '@/utils/format';
import { isNonEmptyArray } from '@suiet/core/src/utils';
import { SvgArrowDown, SvgArrowUp } from '@/components/icons/svgs';
import { Badge } from '@/components/Badge';

function formatTotalCoinChange(coinBalanceChanges: CoinBalanceChangeItem[]): string {
  return coinBalanceChanges
    .map((item) => {
      let coinChange = formatCurrency(item.balance, {
        decimals: item.metadata.decimals,
      });
      if (!coinChange.startsWith('-')) {
        coinChange = '+' + coinChange;
      }
      return `${coinChange} ${item.symbol}`;
    })
    .join(', ');
}

function formatTxType(type: string, kind: string, category?: string): string {
  if (category === 'transfer_coin') {
    if (type === 'incoming') return 'received';
    if (type === 'outgoing') return 'sent';
  }

  return kind;
}

function formatTxDate(timestamp: number, currentTimestamp?: number): string {
  currentTimestamp ??= Date.now();
  if (dayjs(timestamp).isSame(currentTimestamp, 'day')) {
    return 'Today';
  } else if (dayjs(timestamp).isSame(currentTimestamp, 'week')) {
    return 'Last Week';
  } else {
    return dayjs(timestamp).format('MMM, YYYY');
  }
}

const DateItem: React.FC<{ title: string }> = ({ title }) => (
  <View style={{ paddingHorizontal: 24, marginBottom: 16, backgroundColor: White_100 }}>
    <Typography.Subtitle color={Gray_900} children={title} />
  </View>
);

const TypeItem: React.FC<{ title: string }> = ({ title }) => {
  let icon: React.ReactNode = null;

  if (title === 'received') {
    icon = <SvgXml width={14} height={14} color={Gray_400} xml={SvgArrowDown} />;
  } else if (title === 'sent') {
    icon = <SvgXml width={14} height={14} color={Gray_400} xml={SvgArrowUp} />;
  }

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 4, backgroundColor: White_100 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {icon}
        <Typography.Comment color={Gray_400} children={upperFirst(title)} />
      </View>
    </View>
  );
};

const TransactionItem: React.FC<{ item: TransactionForHistory }> = ({ item }) => {
  const type = formatTxType(item.type, item.kind, item.category);

  function renderAddress(fromAddresses: string[] | null, toAddresses: string[] | null) {
    let addresses: string[] = [];
    if (isNonEmptyArray(fromAddresses)) {
      if (type === 'received') {
        addresses = addresses.concat(fromAddresses);
      }
    }
    if (isNonEmptyArray(toAddresses)) {
      if (type === 'sent') {
        addresses = addresses.concat(toAddresses);
      }
    }

    let msg: string | undefined = undefined;
    if (isNonEmptyArray(addresses)) {
      const address = addresses[0];
      if (addresses.length > 1) {
        msg = `From ${addressEllipsis(address)} and ${addresses.length - 1} more`;
      }
      msg = `From ${addressEllipsis(address)}`;
    }

    return <Typography.Comment style={{ flexGrow: 1 }} color={Gray_400} children={msg ?? ''} />;
  }

  function renderAmount(item: TransactionForHistory) {
    let color = Gray_400;
    if (type === 'sent') {
      color = '#F04438';
    } else if (type === 'received') {
      color = '#3FB534';
    }

    return (
      <Typography.Num
        color={color}
        children={item.status === 'failure' ? 'Failed' : formatTotalCoinChange(item.coinBalanceChanges)}
      />
    );
  }

  const symbol = isNonEmptyArray(item.coinBalanceChanges) ? item.coinBalanceChanges[0].symbol : 'Unknown';

  return (
    <TouchableHighlight
      onPress={() => {
        console.log('onPress', item);
      }}
    >
      <View style={{ paddingHorizontal: 24, backgroundColor: White_100, paddingVertical: 6 }}>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
          <CoinIcon symbol={symbol} scale={0.8} />
          <View style={{ flexDirection: 'column', flexGrow: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography.Label style={{ flexGrow: 1 }} color={Gray_900} children={symbol} />
              {renderAmount(item)}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {renderAddress(item.fromAddresses, item.toAddresses)}
              <Typography.Comment color={Gray_400} children={dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export const HistoryList: React.FC<{ address: string }> = ({ address }) => {
  const {
    data: txHistoryList,
    loading,
    error,
    fetchMore,
    refetch,
    hasMore,
  } = useTransactionListForHistory(address, {
    // limit: 4,
    // fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (!address) return;
    const polling = setInterval(() => {
      refetch();
    }, 5 * 1000);
    return () => {
      clearInterval(polling);
    };
  }, [address]);

  const data = useMemo(() => {
    const a = mapValues(
      groupBy(txHistoryList, (tx) => formatTxDate(tx.timestamp)),
      (txHistoryList) =>
        mapValues(
          groupBy(txHistoryList, (tx) => formatTxType(tx.type, tx.kind, tx.category)),
          (v) => v // TODO: any other groupBy
        )
    );

    // [key, sticky, JSX]
    const items = [] as [string, boolean, JSX.Element][];
    for (const date in a) {
      items.push([date, true, <DateItem title={date} />]);
      for (const type in a[date]) {
        items.push([`${date}-${type}`, false, <TypeItem title={upperFirst(type)} />]);
        for (const tx of a[date][type]) {
          items.push([`${date}-${type}-${tx.digest}`, false, <TransactionItem item={tx} />]);
        }
        items.push([`${date}-${type}-separator`, false, <View style={{ height: 12 }} />]);
      }
      items.push([`${date}-separator`, false, <View style={{ height: 12 }} />]);
    }

    return items;
  }, [txHistoryList]);

  const stickyIndices = useMemo(
    () =>
      data
        .map(([_, isSticky], i) => [isSticky, i] as const)
        .filter(([isSticky]) => isSticky)
        .map(([_, i]) => i),
    [data]
  );

  if (loading) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <LoadingDots />
      </View>
    );
  }

  if (error) {
    return <Badge title="Failed to load transcation history" variant="error" />;
  }

  return (
    <FlatList
      style={{ backgroundColor: White_100 }}
      data={data}
      keyExtractor={(item) => item[0]}
      renderItem={({ item }) => item[2]}
      stickyHeaderIndices={stickyIndices}
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

export const History: React.FC = () => {
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

      <HistoryList address={selectedWallet} />
    </View>
  );
};
