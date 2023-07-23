import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import dayjs from 'dayjs';

import type { RootStackParamList } from '@/../App';
import { Error_100, Error_500, Gray_100, Gray_500, Gray_900, Primary_100, Primary_500 } from '@/styles/colors';
import { SvgInbox01, SvgSend02 } from '@/components/icons/svgs';
import { SvgXml } from 'react-native-svg';
import { formatSUI } from '@/utils/format';
import Typography from '@/components/Typography';
import { formatTxType } from '@/screens/TxHistory';
import { CoinBalanceChangeItem, TransactionForHistory } from '@/hooks/useTransactionListForHistory';
import { upperFirst } from 'lodash-es';
import { isNonEmptyArray } from '@suiet/core/src/utils';
import { ViewInExplorer } from '@/components/ViewInExplorer';
import { NamedCopiableMono } from '@/components/NamedCopiableMono';

export const TxDetail: React.FC<StackScreenProps<RootStackParamList, 'TxDetail'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();
  // const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  const { tx } = route.params;
  const txType = formatTxType(tx.type, tx.kind, tx.category);

  const renderIcon = (tx: TransactionForHistory) => {
    const iconType = ['received', 'sent'].includes(txType) ? txType : 'default';

    const colorBg = tx.status === 'failure' ? Error_100 : Primary_100;
    const colorFg = tx.status === 'failure' ? Error_500 : Primary_500;

    if (iconType === 'received') {
      return (
        <View style={{ backgroundColor: colorBg, borderRadius: 9999, padding: 12 }}>
          <SvgXml width={32} height={32} xml={SvgInbox01} color={colorFg} />
        </View>
      );
    } else if (iconType === 'sent') {
      return (
        <View style={{ backgroundColor: colorBg, borderRadius: 9999, padding: 12 }}>
          <SvgXml width={32} height={32} xml={SvgSend02} color={colorFg} />
        </View>
      );
    } else {
      return (
        <View style={{ backgroundColor: colorBg, borderRadius: 9999, padding: 12 }}>
          <SvgXml width={32} height={32} xml={SvgInbox01} color={colorFg} />
        </View>
      );
    }
  };

  const renderTitle = (tx: TransactionForHistory) => {
    const txType = formatTxType(tx.type, tx.kind, tx.category);
    return <Typography.Title>{upperFirst(txType)}</Typography.Title>;
  };

  // function renderCopiableMonoText(text: string, textToCopy?: string) {
  //   const copy = async (text: string) => {
  //     try {
  //       await Clipboard.setStringAsync(textToCopy ?? text);
  //       Toast.show({
  //         type: 'info',
  //         text1: 'Copied to clipboard!',
  //         props: {
  //           icon: require('@assets/magic_wand.png'),
  //         } as ToastProps,
  //       });
  //     } catch (e) {}
  //   };

  //   return (
  //     <TouchableOpacity
  //       style={{
  //         flexGrow: 1,
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         justifyContent: 'flex-end',
  //         gap: 4,
  //         maxWidth: '60%',
  //       }}
  //       onPress={() => copy(text)}
  //     >
  //       <Typography.Mono
  //         style={{ flexShrink: 1, textAlign: 'right' }}
  //         color={Gray_500}
  //         children={text}
  //         numberOfLines={1}
  //       />
  //       <SvgXml width={14} height={14} color={Gray_500} xml={SvgCopy03} />
  //     </TouchableOpacity>
  //   );
  // }

  function renderAddressesByType(type: 'From' | 'To', addresses: string[] | null) {
    return (
      isNonEmptyArray(addresses) && (
        <View>
          {addresses.map((address, i) => (
            <NamedCopiableMono name={i === 0 ? type : ''} text={address} />
          ))}
        </View>
      )
    );
  }

  function renderDigest(digest: string) {
    return <NamedCopiableMono name={'Transaction ID'} text={digest} />;
  }

  function renderGasFee(gasFee: number) {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Typography.LabelS color={Gray_900} children="Gas Fee" />
        <Typography.Mono
          style={{ flexGrow: 1, textAlign: 'right' }}
          color={Gray_500}
          children={`${formatSUI(gasFee)} SUI`}
        />
      </View>
    );
  }

  function renderTime(timestamp: number) {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Typography.LabelS color={Gray_900} children="Time" />
        <Typography.Mono
          style={{ flexGrow: 1, textAlign: 'right' }}
          color={Gray_500}
          children={dayjs(timestamp).format('YYYY.MM.DD HH:mm:ss')}
        />
      </View>
    );
  }

  function renderViewInExplorer(digest: string, networkId: string) {
    return (
      <ViewInExplorer
        link={`https://explorer.sui.io/transactions/` + encodeURIComponent(digest) + `?network=${networkId}`}
      />
    );
  }

  function renderTokenChanges(coinBalanceChanges: CoinBalanceChangeItem[]) {
    return null;
    // TODO: render token changes
    // return state.category === 'tranfer_coin' ? (
    //   <div className="transaction-detail-item">
    //     <span className="transaction-detail-item-key">Token</span>
    //     <span>
    //       {formatCurrency(state.balance, {
    //         decimals: 9,
    //         withAbbr: false,
    //       })}{' '}
    //       {object.symbol}
    //     </span>
    //   </div>
    // ) : null;
  }

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 24,
        }}
      >
        {renderIcon(tx)}
        {renderTitle(tx)}
        <View style={{ height: 1, backgroundColor: Gray_100, width: '100%' }} />

        <View style={{ flexDirection: 'column', width: '100%', gap: 16 }}>
          {renderDigest(tx.digest)}
          {renderAddressesByType('From', tx.fromAddresses)}
          {renderAddressesByType('To', tx.toAddresses)}
          {renderTokenChanges(tx.coinBalanceChanges)}
          {renderGasFee(tx.gasFee)}
          {renderTime(tx.timestamp)}
          <View />
          {renderViewInExplorer(tx.digest, 'testnet')}
        </View>
      </View>
      <View style={{ height: bottom }} />
    </View>
  );
};
