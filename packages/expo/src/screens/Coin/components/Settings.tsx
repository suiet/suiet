import {
  SvgChevronRight,
  SvgGlobe01,
  SvgLock01,
  SvgLockKeyholeCircle,
  SvgRefreshCcw04,
  SvgWallet02,
} from '@/components/icons/svgs';
import { SvgDiscord, SvgGithub, SvgTwitter } from '@/components/icons/constants';
import { FontFamilys } from '@/hooks/useFonts';
import { Gray_100, Gray_400, Gray_900 } from '@/styles/colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { Fragment } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { RootStackParamList } from '@/../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVATARS } from '@/utils/constants';
import { useWallets } from '@/hooks/useWallets';
import { Address } from '@/components/Address';
import { getAllGenericPasswordServices, resetGenericPassword } from 'react-native-keychain';
import { Alert } from 'react-native';
import Typography from '@/components/Typography';

export const Settings: React.FC<BottomTabScreenProps<RootStackParamList, 'Settings'>> = ({ navigation }) => {
  const { wallet } = useWallets();

  const renderItem = (
    title: string,
    touchableProps: TouchableHighlightProps,
    iconSvgLeft: string,
    iconSvgLeftColor?: string,
    iconSvgRight?: string
  ) => {
    return (
      <TouchableHighlight {...touchableProps} activeOpacity={0.9} underlayColor={Gray_900}>
        <View
          style={{
            flexDirection: 'row',
            height: 56,
            paddingHorizontal: 24,
            alignItems: 'center',
            backgroundColor: 'white',
          }}
        >
          <SvgXml style={{ marginRight: 16 }} width={24} height={24} xml={iconSvgLeft} color={iconSvgLeftColor} />
          <Typography.Label color={Gray_900} children={title} style={{ flexGrow: 1 }} />
          {iconSvgRight && <SvgXml width={24} height={24} color={Gray_400} xml={iconSvgRight} />}
        </View>
      </TouchableHighlight>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff', paddingHorizontal: 16 }}>
      {wallet && (
        <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <Image style={{ width: 64, height: 64 }} source={AVATARS[wallet.avatar]} />

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Typography.Title children={wallet.name} color={Gray_900} />
          </View>

          <Address wallet={wallet} />
        </View>
      )}

      <View
        style={{
          borderWidth: 2,
          borderColor: Gray_100,
          borderRadius: 16,
          // paddingVertical: 8,

          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {[
          [SvgWallet02, 'Wallet', '#F1821B'],
          [SvgGlobe01, 'Network', '#6172F3'],
          [SvgLock01, 'Security', '#33BD78'],
        ].map(([svg, item, color]) => (
          <Fragment key={item}>
            {renderItem(
              item,
              {
                onPress: () => {
                  if (item === 'Wallet') {
                    navigation.navigate('EditWallet');
                  }
                },
              },
              svg,
              color,
              SvgChevronRight
            )}
          </Fragment>
        ))}
      </View>

      <View
        style={{
          borderWidth: 2,
          borderColor: Gray_100,
          borderRadius: 16,
          // paddingVertical: 8,

          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {[
          [SvgLockKeyholeCircle, 'Lock', '#2E90FA'],
          [SvgRefreshCcw04, 'Reset All', '#F04438'],
        ].map(([svg, item, color]) => (
          <Fragment key={item}>
            {renderItem(
              item,
              {
                onPress: async () => {
                  if (item === 'Reset All') {
                    Alert.alert('Reset All', 'Are you sure you want to reset all data?', [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'YES',
                        style: 'destructive',
                        onPress: async () => {
                          {
                            const a = await getAllGenericPasswordServices();
                            console.log(a);
                            for (const service of a) {
                              await resetGenericPassword({ service });
                            }
                            const b = await getAllGenericPasswordServices();
                            console.log(b);
                          }

                          await AsyncStorage.clear();

                          const { default: RNRestart } = await import('react-native-restart');
                          RNRestart.restart();
                        },
                      },
                    ]);
                  }
                },
              },
              svg,
              color,
              undefined
            )}
          </Fragment>
        ))}
      </View>

      <View
        style={{
          borderWidth: 2,
          borderColor: Gray_100,
          borderRadius: 16,
          // paddingVertical: 8,

          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {[
          [SvgGithub, 'Developer'],
          [SvgDiscord, 'Discord'],
          [SvgTwitter, 'Twitter'],
        ].map(([svg, item]) => (
          <Fragment key={item}>{renderItem(item, {}, svg, undefined, undefined)}</Fragment>
        ))}
      </View>
    </ScrollView>
  );
};
