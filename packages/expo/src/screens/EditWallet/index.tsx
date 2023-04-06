import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Gray_200, Gray_400 } from '@/styles/colors';
import { useState } from 'react';
import { useWallets } from '@/hooks/useWallets';
import { FontFamilys } from '@/hooks/useFonts';
import { AVATARS, AVATARS_BG } from '@/utils/constants';
import Typography from '@/components/Typography';

const AvatarSelector: React.FC<{ initialSelectedAvatar: number; onChange?: (selectedAvatar: number) => void }> = ({
  initialSelectedAvatar,
  onChange,
}) => {
  const { width, height } = Dimensions.get('screen');
  const [selectedAvatar, setSelectedAvatar] = useState<number>(initialSelectedAvatar);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 24, columnGap: 20 }}>
      {AVATARS.map((item, i) => {
        const itemWith = (width - 24 * 2 - 20 * 2) / 3;
        const itemHeight = itemWith;
        return (
          <TouchableOpacity
            activeOpacity={0.6}
            key={item}
            style={{
              width: itemWith,
              height: itemHeight,
              position: 'relative',
            }}
            onPress={() => {
              setSelectedAvatar(i);
              onChange?.(i);
            }}
          >
            <Image
              source={item}
              style={{ width: itemWith, height: itemWith }}
              resizeMethod="scale"
              resizeMode="contain"
            />

            {i === selectedAvatar && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  // { borderRadius: 9999, borderWidth: 4, borderColor: 'rgba(230, 97, 189, 0.5)' },
                  { borderRadius: 9999, borderWidth: 4, borderColor: AVATARS_BG[i] },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const EditWallet: React.FC<StackScreenProps<RootStackParamList, 'EditWallet'>> = ({ navigation }) => {
  const { width, height } = Dimensions.get('screen');
  const { top, bottom } = useSafeAreaInsets();
  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  const [textInputValue, setTextInputValue] = useState<string>(
    wallets.find((item) => item.address === selectedWallet)?.name!
  );

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ paddingHorizontal: 24 }} overScrollMode="never">
        <View style={{ marginVertical: 24 }}>
          <Typography.Headline color="black" children="Edit" />
          <Typography.Headline color="black" children="Wallet" />
          <View style={{ height: 8 }} />
          <Typography.Body color={Gray_400} children="Customize your wallet." />
        </View>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Gray_200,
            height: 40,
            width: '100%',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,

            fontSize: 14,
            // lineHeight: 20,
          }}
          value={textInputValue}
          onChangeText={(text) => {
            // updateWallets((wallets) => {
            //   wallets[selectedWallet].name = text;
            //   return [...wallets];
            // })

            updateWallets(
              wallets.map((item) => {
                if (item.address === selectedWallet) {
                  return {
                    ...item,
                    name: text,
                  };
                }
                return item;
              })
            );

            setTextInputValue(text);
          }}
        />

        <View style={{ height: 24 }} />

        <AvatarSelector
          initialSelectedAvatar={wallets.find((item) => item.address === selectedWallet)?.avatar!}
          onChange={(avatar) => {
            updateWallets(
              wallets.map((item) => {
                if (item.address === selectedWallet) {
                  return {
                    ...item,
                    avatar,
                  };
                }
                return item;
              })
            );
          }}
        />
      </ScrollView>
      <View style={{ height: bottom }} />
    </View>
  );
};
