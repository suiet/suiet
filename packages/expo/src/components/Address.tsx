import React from 'react';
import { View, Text, Platform, TouchableWithoutFeedback } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { addressEllipsis } from '@/utils/format';
import { Wallet } from '@/utils/wallet';
import { Gray_700 } from '@/styles/colors';
import { SvgCopy } from './icons/constants';

export const Address: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  return (
    <TouchableWithoutFeedback
      onPress={async () => {
        try {
          await Clipboard.setStringAsync(wallet.address);
          Toast.show({
            type: 'info',
            text1: 'Copied to clipboard',
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
          {addressEllipsis(wallet.address)}
        </Text>
        <SvgXml style={{ margin: 4 }} width={12} height={12} color={Gray_700} xml={SvgCopy}></SvgXml>
      </View>
    </TouchableWithoutFeedback>
  );
};
