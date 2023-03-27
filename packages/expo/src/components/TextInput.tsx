import * as React from 'react';
import { View, TextInput as ReactNativeTextInput, TextInputProps, Alert, Platform } from 'react-native';

import { Gray_200, Gray_500, Gray_700, Primary_500 } from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { SvgCopy07, SvgQrCode01 } from '@/components/icons/svgs';
import { useState } from 'react';
import { FontFamilys } from '@/hooks/useFonts';
import { useCameraPermission } from '@/hooks/useCameraPermission';
import { ee } from '@/screens/ScanQRCode';
import { useNavigation } from '@react-navigation/native';

export const TextInput: React.FC<TextInputProps> = ({ style, onChangeText, ...props }) => {
  const navigation = useNavigation();
  const { ensureCameraPermission } = useCameraPermission();
  const textInputRef = React.useRef<ReactNativeTextInput>(null);
  const [textInputFocused, setTextInputFocused] = useState<boolean>(false);

  return (
    <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, columnGap: 8 }}>
        <ButtonWithIcon
          title="Paste"
          iconSvg={SvgCopy07}
          onPress={async () => {
            const { getStringAsync } = await import('expo-clipboard');

            let text: string;
            try {
              text = await getStringAsync();
            } catch (e) {
              Alert.alert('Error', "Can't get clipboard content. Please try again.");
              return;
            }

            if (typeof text === 'undefined' || text === '') {
              // do nothing
            } else {
              onChangeText?.(text);
              textInputRef.current?.focus();
            }
          }}
        />
        <ButtonWithIcon
          iconSvg={SvgQrCode01}
          title="Scan QR Code"
          onPress={async () => {
            if (await ensureCameraPermission()) {
              // @ts-ignore
              navigation.navigate('ScanQRCode');
              ee.once('qrCodeScanned', (data) => {
                onChangeText?.(data);
                textInputRef.current?.focus();
              });
            } else {
              Alert.alert('Error', "Can't get camera permission. Please try again.");
            }
          }}
        />
      </View>
      <ReactNativeTextInput
        ref={textInputRef}
        onFocus={() => setTextInputFocused(true)}
        onBlur={() => setTextInputFocused(false)}
        multiline
        editable
        style={[
          {
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: 10,
            borderWidth: 1,
            borderColor: Gray_200,
            borderRadius: 16,

            fontFamily: FontFamilys.Inter_500Medium,
            fontSize: 14,
            color: Gray_500,
          },
          textInputFocused && { borderColor: Primary_500 },
          style,
        ]}
        placeholderTextColor={Gray_500}
        textAlignVertical="top"
        {...props}
        onChangeText={onChangeText}
      />
    </>
  );
};
