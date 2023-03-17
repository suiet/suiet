import * as React from 'react';
import { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, Image, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
// import * as Brightness from 'expo-brightness';

import type { RootStackParamList } from '@/../App';
import { Gray_200, Gray_400, Gray_700 } from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { SvgChevronDown, SvgCopy, SvgShare } from '@/components/icons/constants';
import { useWallets } from '@/hooks/useWallets';
import QRCode from 'react-native-qrcode-svg';
import { AVATARS } from '@/utils/constants';
import { SvgXml } from 'react-native-svg';
import { FontFamilys } from '@/hooks/useFonts';
import Toast from 'react-native-toast-message';

export const Receive: React.FC<StackScreenProps<RootStackParamList, 'Receive'>> = ({ navigation }) => {
  // useEffect(() => {
  //   let brigheness: number;

  //   (async () => {
  //     // let permissions = await Brightness.getPermissionsAsync();
  //     // if (permissions.status !== 'granted' && permissions.canAskAgain) {
  //     //   permissions = await Brightness.requestPermissionsAsync();
  //     // }
  //     // if (permissions.status === 'granted') {
  //     //   brigheness = await Brightness.getBrightnessAsync();
  //     //   await Brightness.setBrightnessAsync(1);
  //     // }

  //     brigheness = await Brightness.getBrightnessAsync();
  //     await Brightness.setBrightnessAsync(1);
  //   })();

  //   return () => {
  //     if (typeof brigheness !== 'undefined') {
  //       console.log("brigheness", brigheness);
  //       Brightness.setBrightnessAsync(brigheness);
  //     }
  //   };
  // }, []);

  const { wallet } = useWallets();
  if (!wallet) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View style={{ flexGrow: 2 }} />

      <View
        style={{
          padding: 24,
          borderRadius: 36,
          borderWidth: 1,
          borderColor: Gray_200,
          alignSelf: 'center',
        }}
      >
        <QRCode size={224} value={wallet.address} />
      </View>

      <View style={{ height: 30 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity
          style={[{ flexDirection: 'row', alignItems: 'center', display: 'none' }, { display: 'flex' }]}
          onPress={() => {
            navigation.navigate('SelectWallet');
          }}
        >
          <Image style={{ width: 32, height: 32, marginRight: 4 }} source={AVATARS[wallet.avatar]} />
          <Text
            style={{
              fontFamily: FontFamilys.Inter_700Bold,
              fontSize: 16,
              lineHeight: 20,
              color: Gray_700,
              marginHorizontal: 4,
            }}
          >
            {wallet.name}
          </Text>
          <SvgXml style={{ margin: 4 }} width={16} height={16} color={Gray_400} xml={SvgChevronDown} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 16 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: FontFamilys.RobotoMono_400Regular,
            fontSize: 14,
            lineHeight: 20,
            color: Gray_400,
            maxWidth: 250,

            textAlign: 'center',
          }}
          children={wallet.address}
        />
      </View>

      <View style={{ height: 32 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: 8 }}>
        <ButtonWithIcon
          iconSvg={SvgCopy}
          title="Copy"
          onPress={async () => {
            await Clipboard.setStringAsync(wallet.address);
            Toast.show({
              type: 'info',
              text1: 'Copied to clipboard',
            });
          }}
        />
        <ButtonWithIcon
          iconSvg={SvgShare}
          title="Share"
          onPress={async () => {
            try {
              const result = await Share.share({
                message: wallet.address,
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error: any) {
              Alert.alert(error.message);
            }
          }}
        />
      </View>

      <View style={{ flexGrow: 5 }} />
    </View>
  );
};
