import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ColorValue,
  ViewProps,
  TextInput,
  Platform,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import {
  SvgPlus,
  SvgArrowDown,
  SvgArrowUp,
  SvgSwitchHorizontal01,
  SvgCopy,
  SvgChevronDown,
  SvgChevronRight,
  SvgClose,
  SvgCopyDotted,
  SvgQRCode,
  SvgScan,
  SvgSetting,
} from '@components/icons/constants';
import { Gray_100, Gray_200, Gray_400, Gray_500, Gray_700, Gray_900, Secondary_50, Primary_50 } from '@styles/colors';
import CoinIcon from '@components/CoinIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList } from '@/../App';
import { useWallets } from '@/hooks/useWallets';
import { Wallet } from '@/utils/wallet';
import { addressEllipsis } from '@/utils/format';

export const ListItem: React.FC<
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
          fontWeight: '600',
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
          fontWeight: '600',
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

const Coin: React.FC<BottomTabScreenProps<RootStackParamList, 'Coin'>> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const [scrollIndicatorY, setScrollIndicatorY] = useState<number>();
  const [showCollapse, setShowCollapse] = useState(false);

  const { wallets, selectedWallet } = useWallets();
  const walletsByAddress = React.useMemo(
    () => Object.fromEntries(wallets.map((wallet) => [wallet.address, wallet])),
    [wallets]
  );

  if (typeof selectedWallet === 'undefined' || typeof walletsByAddress[selectedWallet] === 'undefined') {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top }}>
      <ScrollView
        style={{ paddingHorizontal: 24 }}
        onScroll={({
          nativeEvent: {
            contentOffset: { y },
          },
        }) => {
          if (typeof scrollIndicatorY === 'number') {
            if (y > scrollIndicatorY) {
              setShowCollapse(true);
            } else {
              setShowCollapse(false);
            }
          }
        }}
        scrollEventThrottle={33}
      >
        <View style={{ paddingTop: 24 }}>
          <Image style={{ width: 64, height: 64 }} source={require('@assets/Avatar.png')} />

          <TouchableOpacity
            onPressOut={() => {
              navigation.navigate('SelectWallet');
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
              <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 32, lineHeight: 38, color: Gray_900 }}>
                {walletsByAddress[selectedWallet]?.name}
              </Text>
              <View style={{ backgroundColor: Gray_100, borderRadius: 9999, margin: 8 }}>
                <SvgXml style={{ margin: 4 }} width={16} height={16} color={Gray_700} xml={SvgChevronDown} />
              </View>
            </View>
          </TouchableOpacity>

          <View>
            <View
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#EFF1F5',
                borderRadius: 9999,
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: Platform.select({
                    ios: 'Menlo',
                    android: 'monospace',
                  }),
                  color: Gray_700,
                }}
              >
                {addressEllipsis(walletsByAddress[selectedWallet]?.address)}
              </Text>
              <SvgXml style={{ margin: 4 }} width={12} height={12} color={Gray_700} xml={SvgCopy}></SvgXml>
            </View>
          </View>
        </View>

        <View
          onLayout={({
            nativeEvent: {
              layout: { y },
            },
          }) => {
            setScrollIndicatorY(y);
          }}
        />

        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16, marginBottom: 16 }}>
          {[
            {
              svg: SvgPlus,
              text: 'Buy',
            },
            {
              svg: SvgArrowDown,
              text: 'Receive',
            },
            {
              svg: SvgArrowUp,
              text: 'Send',
            },
            {
              svg: SvgSwitchHorizontal01,
              text: 'Swap',
            },
          ].map(({ svg, text: title }, index) => (
            <TouchableOpacity key={title} onPress={() => navigation.navigate(title as any)}>
              <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <View style={{ backgroundColor: Gray_100, borderRadius: 9999 }}>
                  <SvgXml style={{ margin: 14 }} width={24} height={24} color={Gray_700} xml={svg} />
                </View>
                <Text style={{ color: Gray_500, fontSize: 12, lineHeight: 24 }}>{title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flexGrow: 1, fontWeight: '700', fontSize: 16, lineHeight: 20, color: Gray_900 }}>
              Tokens
            </Text>
            <Text style={{ color: Gray_400 }}>See all</Text>
            <SvgXml style={{ margin: 2 }} width={16} height={16} color={Gray_700} xml={SvgChevronRight}></SvgXml>
          </View>
          {['SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token', 'SUI', 'Token'].map(
            (item, i) => {
              const backgroundColor = Secondary_50;
              const textColor = Gray_900;
              return (
                <ListItem
                  key={i}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  symbol={item}
                  balance={'1234.56'}
                />
              );
            }
          )}
        </View>
      </ScrollView>

      <View
        style={[
          StyleSheet.absoluteFill,
          {
            height: 64,
            top,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
          },
          showCollapse && {
            backgroundColor: '#FFF',
            borderBottomColor: Gray_100,
            borderBottomWidth: 1,
            height: 65,
            zIndex: 999,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            style={[
              { flexDirection: 'row', alignItems: 'center', display: 'none' },
              showCollapse && { display: 'flex' },
            ]}
            onPress={() => {
              navigation.navigate('SelectWallet');
            }}
          >
            <Image style={{ width: 32, height: 32, marginRight: 4 }} source={require('../../../assets/Avatar.png')} />
            <Text
              style={{
                fontFamily: 'Inter_700Bold',
                fontSize: 16,
                lineHeight: 20,
                color: Gray_700,
                marginHorizontal: 4,
              }}
            >
              {walletsByAddress[selectedWallet]?.name}
            </Text>
            <SvgXml style={{ margin: 4 }} width={16} height={16} color={Gray_400} xml={SvgChevronDown} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgScan} />
        </TouchableOpacity>
        {/* <TouchableOpacityModal modalContent={<Settings />} modalProps={{ title: '' }}>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgSetting} />
        </TouchableOpacityModal> */}

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgSetting} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Coin;
