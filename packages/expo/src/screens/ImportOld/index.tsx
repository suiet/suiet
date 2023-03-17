import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, ScrollView, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Gray_100, Gray_200, Gray_400, Gray_500, Primary_500 } from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { SvgCopy, SvgCopyDotted, SvgQRCode } from '@/components/icons/constants';
import { useState } from 'react';
import { ee } from '../ScanQRCode';
import { Button } from '@/components/Button';
import { useKeychain } from '@/hooks/useKeychain';
import { useWallets } from '@/hooks/useWallets';
import { FontFamilys } from '@/hooks/useFonts';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { TextInput } from '@/components/TextInput';

export const ImportOld: React.FC<StackScreenProps<RootStackParamList, 'ImportOld'>> = ({ navigation }) => {
  const { width, height } = Dimensions.get('screen');
  const { top, bottom } = useSafeAreaInsets();

  const [textInputValue, setTextInputValue] = useState<string>();

  const { saveMnemonic } = useKeychain();
  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView style={{ flexGrow: 1 }} behavior={'height'}>
        <ScrollView style={{ paddingHorizontal: 24 }}>
          <View style={{ marginVertical: 24 }}>
            <Text style={{ fontFamily: FontFamilys.Inter_700Bold, fontSize: 36, lineHeight: 40, color: 'black' }}>
              Input
            </Text>
            <Text style={{ fontFamily: FontFamilys.Inter_700Bold, fontSize: 36, lineHeight: 40, color: 'black' }}>
              Recovery
            </Text>
            <Text style={{ fontFamily: FontFamilys.Inter_700Bold, fontSize: 36, lineHeight: 40, color: 'black' }}>
              Phrase
            </Text>
            <View style={{ height: 8 }} />
            <Text style={{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 14, lineHeight: 20, color: Gray_400 }}>
              From an existing wallet.
            </Text>
          </View>

          <TextInput
            value={textInputValue}
            onChangeText={setTextInputValue}
            style={{
              minHeight: 168,
            }}
            placeholder="Input recovery phrase of old wallet"
          />

          <View style={{ height: 16 }} />

          <Text style={{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 14, lineHeight: 20, color: Gray_400 }}>
            Recovery phrase was displayed when you first created your wallet.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* <View style={{ flexGrow: 1 }}></View> */}

      <View style={{ height: 1, backgroundColor: Gray_100, width }} />
      <View style={{ padding: 12 }}>
        <Button
          title="Confirm and Import"
          onPress={async () => {
            if (!textInputValue) {
              return;
            }

            const { Vault } = await import('@suiet/core/src/vault/Vault');

            const mnemonic = textInputValue;
            let address: string;
            try {
              const vault = await Vault.fromMnemonic(mnemonic);
              address = vault.getAddress();
            } catch (e: any) {
              Alert.alert('Error', 'Your recovery phrase is invalid.', [
                {
                  text: 'OK',
                  onPress: () => {
                    // navigation.goBack();
                  },
                },
              ]);
              return;
            }

            if (wallets.some((wallet) => wallet.address === address)) {
              Alert.alert('Error', 'This wallet already exists.', [
                {
                  text: 'OK',
                  onPress: () => {
                    // navigation.goBack();
                  },
                },
              ]);
              return;
            }

            try {
              await saveMnemonic(address, mnemonic);
            } catch (e: any) {
              Alert.alert('Error', e.message, [
                {
                  text: 'OK',
                  onPress: () => {
                    // navigation.goBack();
                  },
                },
              ]);
              return;
            }

            updateWallets([
              ...wallets,
              {
                name: `Wallet ${wallets.length + 1}`,
                address,
                avatar: 0,
              },
            ]);
            if (typeof selectedWallet === 'undefined') {
              updateSelectedWallet(address);
            }

            navigation.popToTop();
            navigation.replace('Home');
          }}
          disabled={!textInputValue}
        />
      </View>

      <View style={{ height: bottom - 8 }} />
    </View>
  );
};
