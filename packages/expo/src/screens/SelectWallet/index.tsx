import * as React from 'react';
import { Image, Animated, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';

import type { RootStackParamList } from '@/../App';
import {
  Error_100,
  Error_500,
  Gray_100,
  Gray_500,
  Gray_900,
  Primary_400,
  Primary_500,
  White_100,
} from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { SvgCheck, SvgDownload01, SvgMinus, SvgPlus } from '@/components/icons/svgs';
import { Swipeable } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useWallets } from '@/hooks/useWallets';
import { Wallet } from '@/utils/wallet';
import { addressEllipsis } from '@/utils/format';
import { AVATARS } from '@/utils/constants';
import Typography from '@/components/Typography';

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
          <Typography.Subtitle color={Gray_900} children={wallet.name} />
          <Typography.MonoS color={Gray_500} children={addressEllipsis(wallet.address)} />
        </View>

        <View style={{ flex: 1 }} />
        {wallet.address === selectedWallet && (
          <View style={{ padding: 4, backgroundColor: Primary_500, borderRadius: 9999 }}>
            <SvgXml width={14} height={14} color={White_100} xml={SvgCheck} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, justifyContent: 'center', gap: 8 }}>
        <ButtonWithIcon
          iconSvg={SvgPlus}
          title="Create New"
          onPress={() => {
            navigation.navigate('CreateNew');
          }}
        />
        <ButtonWithIcon
          iconSvg={SvgDownload01}
          title="Import Old"
          onPress={() => {
            navigation.navigate('ImportOld');
          }}
        />
      </View>

      <ScrollView overScrollMode="never">
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
                        <View style={{ padding: 4, backgroundColor: Error_500, borderRadius: 9999 }}>
                          <SvgXml width={14} height={14} color={White_100} xml={SvgMinus} />
                        </View>
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
