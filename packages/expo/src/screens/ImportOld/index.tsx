import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Gray_100, Gray_200, Gray_400, Gray_500, Primary_400 } from '@/styles/colors';
import ButtonWithIcon from '@/components/ButtonWithIcon';
import { SvgCopy, SvgQRCode } from '@/components/icons/constants';
import { useEffect, useState } from 'react';
import { ee } from '../ScanQRCode';
import { Button } from '@/components/Button';
// import {
//   setGenericPassword,
//   ACCESS_CONTROL,
//   AUTHENTICATION_TYPE,
//   ACCESSIBLE,
//   STORAGE_TYPE,
//   SECURITY_LEVEL,
//   getGenericPassword,
//   resetGenericPassword,
// } from 'react-native-keychain';
import { useFakeKeychain, useKeychain } from '@/hooks/useKeychain';
import { useWallets } from '@/hooks/useWallets';

export const ImportOld: React.FC<StackScreenProps<RootStackParamList, 'ImportOld'>> = ({ navigation }) => {
  const { width, height } = Dimensions.get('screen');
  const { top, bottom } = useSafeAreaInsets();

  const textInputRef = React.useRef<TextInput>(null);
  const [textInputValue, setTextInputValue] = useState<string>();

  const { saveMnemonic } = useKeychain();
  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView style={{}} behavior={'height'}>
        <ScrollView style={{ paddingHorizontal: 24 }}>
          <View style={{ marginVertical: 24 }}>
            <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 36, lineHeight: 40, color: 'black' }}>Input</Text>
            <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 36, lineHeight: 40, color: 'black' }}>
              Recovery
            </Text>
            <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 36, lineHeight: 40, color: 'black' }}>Phrase</Text>
            <View style={{ height: 8 }} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, color: Gray_400 }}>
              From an existing wallet.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            <ButtonWithIcon iconSvg={SvgCopy} title="Paste" style={{ marginRight: 8 }} />
            <ButtonWithIcon
              iconSvg={SvgQRCode}
              title="Scan QR Code"
              onPressOut={() => {
                navigation.navigate('ScanQRCode');
                ee.once('qrCodeScanned', (data) => {
                  textInputRef.current?.focus();
                  setTextInputValue(data);
                });
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <TextInput
              value={textInputValue}
              onChangeText={setTextInputValue}
              ref={textInputRef}
              multiline
              editable
              // numberOfLines={6}
              maxLength={40}
              style={{
                padding: 10,
                paddingLeft: 14,
                paddingRight: 14,
                borderWidth: 1,
                borderColor: Gray_200,
                borderRadius: 16,

                fontFamily: Platform.select({
                  ios: 'Menlo',
                  android: 'monospace',
                }),
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 20,

                minHeight: 168,
              }}
              placeholder="Input recovery phrase of old wallet"
              placeholderTextColor={Gray_500}
              textAlignVertical="top"
            />
          </View>

          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, color: Gray_400 }}>
            Recovery phrase was displayed when you first created your wallet.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ flexGrow: 1 }}></View>

      <View style={{ height: 1, backgroundColor: Gray_100, width }} />
      <View style={{ padding: 16 }}>
        <Button
          title="Confirm and Import"
          onPressOut={async () => {
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
                avatar: '',
              },
            ]);
            if (typeof selectedWallet === 'undefined') {
              updateSelectedWallet(address);
            }

            navigation.popToTop();
            navigation.replace('Home');
          }}
        />
      </View>

      <View style={{ height: bottom }} />
    </View>
  );
};
