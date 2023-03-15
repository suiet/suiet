import * as React from 'react';
import { Image, Animated, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Platform, ScrollView } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Error_100, Gray_100, Gray_500, Gray_900 } from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { SvgCheck, SvgCopy, SvgDownload, SvgMinus, SvgPlus, SvgQRCode } from '@/components/icons/constants';
import { FontFamilys } from '@/hooks/useFonts';
import { Swipeable } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useWallets } from '@/hooks/useWallets';
import { Wallet } from '@/utils/wallet';
import { addressEllipsis } from '@/utils/format';
import { AVATARS } from '@/utils/constants';

export const SelectWallet: React.FC<StackScreenProps<RootStackParamList, 'SelectWallet'>> = ({ navigation }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  const renderItem = (wallet: Wallet) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: Gray_100,
        borderRadius: 16,
        padding: 16,
        height: 72,
        marginHorizontal: 16,
        backgroundColor: 'white',
      }}
    >
      <TouchableOpacity
        activeOpacity={wallet.address === selectedWallet ? 1 : 0.5}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          updateSelectedWallet(wallet.address);
        }}
      >
        <Image
          source={AVATARS[wallet.avatar]}
          style={{ width: 32, height: 32 }}
          resizeMethod="scale"
          resizeMode="contain"
        />

        <View style={{ paddingLeft: 16 }}>
          <Text
            style={{
              fontFamily: FontFamilys.WorkSans_700Bold,
              fontSize: 16,
              lineHeight: 24,
              color: Gray_900,
            }}
            children={wallet.name}
          />

          <Text
            style={{
              fontWeight: '400',
              fontSize: 12,
              lineHeight: 16,
              fontFamily: Platform.select({
                ios: 'Menlo',
                android: 'monospace',
              }),
              color: Gray_500,
            }}
            children={addressEllipsis(wallet.address)}
          />
        </View>

        <View style={{ flex: 1 }} />
        {wallet.address === selectedWallet && <SvgXml width={24} height={24} xml={SvgCheck} />}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'center' }}>
        <ButtonWithIcon
          iconSvg={SvgPlus}
          title="Cretae New"
          style={{ marginRight: 8 }}
          onPress={() => {
            navigation.navigate('CreateNew');
          }}
        />
        <ButtonWithIcon
          iconSvg={SvgDownload}
          title="Import Old"
          onPress={() => {
            navigation.navigate('ImportOld');
          }}
        />
      </View>

      <ScrollView>
        {wallets.map((wallet) => (
          <React.Fragment key={wallet.address}>
            {selectedWallet === wallet.address ? (
              renderItem(wallet)
            ) : (
              <Swipeable
                overshootRight={false}
                renderRightActions={(progress, dragX) => {
                  const opacity = dragX.interpolate({
                    inputRange: [-10, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  });
                  return (
                    <Animated.View
                      style={[
                        {
                          borderRadius: 16,
                          height: 72,
                          width: 88,

                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 16,
                          marginLeft: -40,
                          marginRight: 16,
                          backgroundColor: Error_100,

                          justifyContent: 'flex-end',
                        },
                        { opacity },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Confirm',
                            `Delete wallet "${wallet.name}"?`,
                            [
                              {
                                text: 'YES',
                                style: 'destructive',
                                onPress: () => {
                                  updateWallets(wallets.filter((w) => w.address !== wallet.address));
                                },
                              },
                              {
                                text: 'NO',
                                style: 'cancel',
                              },
                            ],
                            {
                              cancelable: true,
                            }
                          );
                        }}
                      >
                        <SvgXml width={24} height={24} xml={SvgMinus} />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                }}
              >
                {renderItem(wallet)}
              </Swipeable>
            )}

            <View style={{ height: 16 }} />
          </React.Fragment>
        ))}
      </ScrollView>

      <View style={{ height: bottom }} />
    </View>
  );
};
