import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import { useState } from 'react';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import {
  SvgPlus,
  SvgArrowDown,
  SvgArrowUp,
  SvgSwitchHorizontal01,
  SvgChevronDown,
  SvgCreditCard02,
  // SvgScan,
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
import { CoinsNew } from '@/components/Coins';
import { FAB } from '@/components/FAB';
import { FontFamilys } from '@/hooks/useFonts';
import Typography from '@/components/Typography';
import { Airdrop } from '@/components/Airdrop';
import Toast, { ToastProps } from 'react-native-toast-message';
import { Nfts } from '@/components/Nfts';
import { useNetwork } from '@/hooks/useNetwork';
import * as Haptics from 'expo-haptics';
export const Coin: React.FC<BottomTabScreenProps<RootStackParamList, 'Coin'>> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const [scrollIndicatorY, setScrollIndicatorY] = useState<number>();
  const [showCollapse, setShowCollapse] = useState(false);

  const { wallets, selectedWallet } = useWallets();
  const walletsByAddress = React.useMemo(
    () => Object.fromEntries(wallets.map((wallet) => [wallet.address, wallet])),
    [wallets]
  );

  const { networkId } = useNetwork();
  const [refreshControl, setRefreshControl] = React.useState(Date.now());
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshControl(Date.now());
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={33}
        overScrollMode="never"
      >
        <View style={{ paddingTop: 24 }}>
          <Image style={{ width: 64, height: 64 }} source={AVATARS[wallet.avatar]} />

          <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          {networkId === 'mainnet' ? (
            <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <FAB
                svg={SvgCreditCard02}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('DappBrowser', {
                    url: `https://pay.suiet.app/?wallet_address=${wallet.address}`,
                  });
                }}
              />
              <Typography.Comment children={'Buy'} color={Gray_500} />
            </View>
          ) : (
            <Airdrop recipient={selectedWallet} />
          )}

          {[
            // {
            //   svg: SvgPlus,
            //   text: 'Buy',
            //   disabled: true,
            // },
            {
              svg: SvgArrowDown,
              text: 'Receive',
              disabled: false,
            },
            {
              svg: SvgArrowUp,
              text: 'Send',
              disabled: false,
            },
            // {
            //   svg: SvgSwitchHorizontal01,
            //   text: 'Swap',
            //   disabled: true,
            // },
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
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (disabled) {
                    Toast.show({
                      type: 'info',
                      text1: `This feature is WIP`,
                      visibilityTime: 3000,
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

        <View style={{ gap: 8, paddingBottom: 24 }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography.Subtitle children="Coins" color={Gray_900} style={{ marginLeft: 4 }} />
            {/* <Text style={{ color: Gray_400 }}>See all</Text>
            <SvgXml style={{ margin: 2 }} width={16} height={16} color={Gray_700} xml={SvgChevronRight}></SvgXml> */}
          </View>
          <CoinsNew address={selectedWallet} refreshControl={refreshControl} />

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Typography.Subtitle children="NFTs" color={Gray_900} style={{ marginLeft: 4 }} />
            {/* <Text style={{ color: Gray_400 }}>See all</Text>
            <SvgXml style={{ margin: 2 }} width={16} height={16} color={Gray_700} xml={SvgChevronRight}></SvgXml> */}
          </View>
          <Nfts
            address={selectedWallet}
            refreshControl={refreshControl}
            onChoose={(nft) => {
              navigation.navigate('NftDetail', { nft });
            }}
          />
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

        {/* <TouchableOpacity>
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgScan} />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate('Settings');
          }}
        >
          <SvgXml style={{ margin: 4 }} width={24} height={24} color={Gray_700} xml={SvgSettings02} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
