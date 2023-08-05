import React from 'react';
import { View, Text, Platform, TouchableWithoutFeedback } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { addressEllipsis } from '@/utils/format';
import { Wallet } from '@/utils/wallet';
import { Gray_700 } from '@/styles/colors';
import { SvgCopy03 } from '@/components/icons/svgs';
import Typography from '@/components/Typography';
import { ToastProps } from '@/components/Toast';
import * as Haptics from 'expo-haptics';
export const Address: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await Clipboard.setStringAsync(wallet.address);
          Toast.show({
            type: 'info',
            text1: 'Copied to clipboard!',
            props: {
              icon: require('@assets/magic_wand.png'),
            } as ToastProps,
          });
        } catch (e) {}
      }}
    >
      <View
        style={{
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
        <Typography.Mono children={addressEllipsis(wallet.address)} color={Gray_700} />
        <SvgXml style={{ margin: 4 }} width={14} height={14} color={Gray_700} xml={SvgCopy03}></SvgXml>
      </View>
    </TouchableWithoutFeedback>
  );
};
