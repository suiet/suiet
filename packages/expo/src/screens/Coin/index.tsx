import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import {
  SvgPlus,
  SvgArrowDown,
  SvgArrowUp,
  SvgSwitchHorizontal01,
  SvgChevronDown,
  SvgScan,
  SvgSettings02,
} from '@components/icons/svgs';
import { Gray_100, Gray_400, Gray_500, Gray_700, Gray_900 } from '@styles/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList } from '@/../App';
import { useWallets } from '@/hooks/useWallets';
import { Wallet } from '@/utils/wallet';
import { AVATARS } from '@/utils/constants';
import { Address } from '@/components/Address';
import { Coins } from '@/components/Coins';
import { FAB } from '@/components/FAB';
import { FontFamilys } from '@/hooks/useFonts';
import Typography from '@/components/Typography';
import { Airdrop } from '@/components/Airdrop';
import Toast, { ToastProps } from 'react-native-toast-message';

export const Coin: React.FC<BottomTabScreenProps<RootStackParamList, 'Coin'>> = ({ navigation }) => {
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

  const wallet = walletsByAddress[selectedWallet] as Wallet;
  if (!wallet) {
    return null;
  }

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top, flexGrow: 1 }}>
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
        overScrollMode="never"
      >
        <View style={{ paddingTop: 24 }}>
          <Image style={{ width: 64, height: 64 }} source={AVATARS[wallet.avatar]} />

          <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SelectWallet');
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                <Typography.Headline style={{ color: Gray_900 }} children={wallet.name} />
                <View style={{ backgroundColor: Gray_100, borderRadius: 9999, margin: 8 }}>
                  <SvgXml style={{ margin: 4 }} width={16} height={16} color={Gray_700} xml={SvgChevronDown} />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'flex-start' }}>
            <Address wallet={wallet} />
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
          <Airdrop recipient={selectedWallet} />
          {[
            {
              svg: SvgPlus,
              text: 'Buy',
              disabled: true,
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
              disabled: true,
            },
          ].map(({ svg, text: title, disabled }, index) => (
            // <TouchableOpacity key={title} onPress={() => navigation.navigate(title as any)}>
            //   <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            //     <View style={{ backgroundColor: Gray_100, borderRadius: 9999 }}>
            //       <SvgXml style={{ margin: 14 }} width={24} height={24} color={Gray_700} xml={svg} />
            //     </View>
            //     <Text style={{ color: Gray_500, fontSize: 12, lineHeight: 24 }}>{title}</Text>
            //   </View>
            // </TouchableOpacity>
            <View
              key={title}
              style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <FAB
                svg={svg}
                onPress={() => {
                  if (disabled) {
                    Toast.show({
                      type: 'info',
                      text1: 'This feature is WIP',
                    });
                  } else {
                    navigation.navigate(title as any);
                  }
                }}
              />
              <Typography.Comment children={title} color={Gray_500} />
            </View>
          ))}
        </View>

        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography.Subtitle children="Tokens" color={Gray_900} />
            {/* <Text style={{ color: Gray_400 }}>See all</Text>
            <SvgXml style={{ margin: 2 }} width={16} height={16} color={Gray_700} xml={SvgChevronRight}></SvgXml> */}
          </View>
          <Coins address={selectedWallet} />
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
              { flexDirection: 'row', alignItems: 'center', display: 'none', gap: 4 },
              showCollapse && { display: 'flex' },
            ]}
            onPress={() => {
              navigation.navigate('SelectWallet');
            }}
          >
            <Image style={{ width: 32, height: 32, marginRight: 4 }} source={AVATARS[wallet.avatar]} />
            <Typography.Subtitle children={wallet.name} color={Gray_900} />
            <SvgXml width={16} height={16} color={Gray_400} xml={SvgChevronDown} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgScan} />
        </TouchableOpacity>
        {/* <TouchableOpacityModal modalContent={<Settings />} modalProps={{ title: '' }}>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgSetting} />
        </TouchableOpacityModal> */}

        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgSettings02} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
