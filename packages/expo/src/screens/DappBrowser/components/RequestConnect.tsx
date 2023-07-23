import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { Address } from '@/components/Address';
import { Button } from '@/components/Button';
import { SvgCheck, SvgLink01, SvgXClose } from '@/components/icons/svgs';
import Typography from '@/components/Typography';
import { AVATARS } from '@/utils/constants';
import { Wallet } from '@/utils/wallet';
import { useNavigation } from '@react-navigation/native';
import { Gray_100, Gray_300, Gray_400, Gray_500, Gray_800, Gray_900, Success_500, White } from '@styles/colors';
import { tips } from '@suiet/chrome-ext/src/scripts/background/permission';
import { DappMessageContext } from '@suiet/chrome-ext/src/scripts/background/types';
import { isNonEmptyArray } from '@suiet/core/src/utils';

export const RequestConnect: React.FC<{
  context: DappMessageContext;
  permissions: string[];
  wallet: Wallet;
  onConnect?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}> = ({ context, permissions, wallet, onConnect, onCancel }) => {
  useEffect(() => {
    console.log('context', context);
  }, [context]);

  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flexGrow: 1 }}>
      <View style={{ paddingHorizontal: 24 }}>
        <View style={{ flexDirection: 'row', gap: -32, alignItems: 'center' }}>
          <Image
            style={{ width: 72, height: 72, marginRight: 4, borderRadius: 9999, backgroundColor: Gray_100 }}
            source={{ uri: context.favicon }}
          />
          <Image
            style={{ width: 64, height: 64, marginRight: 4, borderRadius: 9999, borderWidth: 2, borderColor: White }}
            source={AVATARS[wallet.avatar]}
          />
        </View>

        <View style={{ height: 16 }} />

        <View>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', marginBottom: 4 }}>
            <SvgXml width={16} height={16} color={Gray_400} xml={SvgLink01} />
            <Typography.Body children={context.origin} color={Gray_400} />
          </View>

          <View>
            <Typography.Title color={Gray_900} children={context.name} />
            <Typography.Title color={Gray_900} children="wants to connect to" />
          </View>
        </View>

        <View style={{ height: 16 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image style={{ width: 32, height: 32, marginRight: 4 }} source={AVATARS[wallet.avatar]} />
          <Typography.Subtitle children={wallet.name} color={Gray_900} />
          <Address wallet={wallet!} />
        </View>

        <View style={{ height: 24 }} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Gray_400 }} />
        <View style={{ height: 24 }} />

        <View>
          <Typography.Label children="This app will be avaliable to: " color={Gray_800} />
          <View style={{ height: 16 }} />
          <View style={{ gap: 8 }}>
            {isNonEmptyArray(permissions)
              ? permissions.map((item) => (
                  <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <SvgXml width={16} height={16} color={Success_500} xml={SvgCheck} />
                    <Typography.Body children={tips[item]} color={Gray_500} />
                  </View>
                ))
              : null}
          </View>
        </View>

        <View style={{ height: 24 }} />

        <View>
          <Typography.Label children="This app will NOT be available to: " color={Gray_800} />
          <View style={{ height: 16 }} />
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <SvgXml width={16} height={16} color={Gray_300} xml={SvgXClose} />
              <Typography.Body children={'Move tokens & NFTs without your approval'} color={Gray_300} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexGrow: 1 }} />

      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          padding: 16,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: Gray_100,
        }}
      >
        <Button
          title="Cancel"
          type="Secondary"
          innerStyle={{ width: undefined, flexGrow: 1 }}
          onPress={async () => {
            await onCancel?.();
            navigation.goBack();
          }}
        />
        <Button
          title="Connect"
          type="Primary"
          innerStyle={{ width: undefined, flexGrow: 1 }}
          onPress={async () => {
            await onConnect?.();
            navigation.goBack();
          }}
        />
      </View>

      <View style={{ height: bottom }} />
    </View>
  );
};
