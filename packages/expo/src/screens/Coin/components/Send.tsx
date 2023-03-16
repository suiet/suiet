import { Text, View, TextInput, Platform, ScrollView, Alert, Dimensions, KeyboardAvoidingView } from 'react-native';
import * as React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamilys } from '@/hooks/useFonts';
import { useWallets } from '@/hooks/useWallets';
import { Gray_100, Gray_200, Gray_400, Gray_500, Gray_700, Primary_50, Primary_900 } from '@styles/colors';
import { SvgCopyDotted, SvgQRCode } from '@components/icons/constants';

import { ButtonWithIcon } from '@components/ButtonWithIcon';
import { CoinIcon } from '@/components/CoinIcon';
import { Coins } from '@/components/Coins';
import { Button } from '@/components/Button';
import { ee } from '@/screens/ScanQRCode';
import { RootStackParamList } from '@/../App';

type SendStackParamList = {
  SendSelectCoin: undefined;
  SendInputAddress: undefined;
} & RootStackParamList;

const SendStackNavgiator = createStackNavigator<SendStackParamList>();

const SendSelectCoin: React.FC<StackScreenProps<SendStackParamList, 'SendSelectCoin'>> = ({ navigation }) => {
  const { selectedWallet } = useWallets();

  if (typeof selectedWallet === 'undefined') {
    return null;
  }

  return (
    <ScrollView style={{ paddingHorizontal: 24, backgroundColor: '#fff' }}>
      <View style={{ marginVertical: 24 }}>
        <Text style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 36, lineHeight: 40, color: 'black' }}>
          Choose
        </Text>
        <Text style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 36, lineHeight: 40, color: 'black' }}>
          Token
        </Text>
        <View style={{ height: 8 }} />
        <Text style={{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 14, lineHeight: 20, color: Gray_400 }}>
          Which token do you want to send?
        </Text>
      </View>

      <Coins
        address={selectedWallet}
        onChooseCoin={() => {
          navigation.navigate('SendInputAddress');
        }}
      />
    </ScrollView>
  );
};

const SendInputAddress: React.FC<StackScreenProps<SendStackParamList, 'SendInputAddress'>> = ({ navigation }) => {
  const textInputRef = React.useRef<TextInput>(null);
  const [toAddress, setToAddress] = React.useState<string>();

  const { width, height } = Dimensions.get('screen');
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flexGrow: 1, overflow: 'scroll', marginBottom: bottom - 8 }}
        behavior={'padding'}
        keyboardVerticalOffset={
          Platform.select({
            android: top,
            ios: top + 10,
            default: 0,
          }) + 68
        }
      >
        <ScrollView
          scrollEnabled={true}
          style={{ paddingHorizontal: 24 }}
          contentContainerStyle={{ minHeight: height }}
        >
          <View
            style={[
              {
                height: 56,
                borderRadius: 16,
                backgroundColor: Primary_50,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                marginTop: 6,
                marginBottom: 24,
              },
            ]}
          >
            <View style={{ marginRight: 12, width: 24, height: 24 }}>
              <CoinIcon symbol={'SUI'} scale={0.6} />
            </View>
            <Text
              style={{
                flexGrow: 1,
                flexShrink: 0,
                fontWeight: '600',
                fontSize: 16,
                lineHeight: 20,
                color: Primary_900,
              }}
            >
              SUI
            </Text>
            <Text
              style={{
                flexGrow: 0,
                flexShrink: 0,
                fontWeight: '600',
                fontSize: 20,
                lineHeight: 24,
                color: Primary_900,
              }}
            >
              1234.56
            </Text>
          </View>

          <View style={{ marginLeft: 8, marginRight: 8, marginBottom: 24 }}>
            <Text style={{ fontWeight: '700', fontSize: 24, lineHeight: 36, color: '#000000' }}>Input Address</Text>
            <Text style={{ fontWeight: '600', fontSize: 16, lineHeight: 20, color: Gray_400 }}>
              Enter and validate Address
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 16, columnGap: 8 }}>
            <ButtonWithIcon
              title="Paste"
              iconSvg={SvgCopyDotted}
              onPress={async () => {
                const { getStringAsync } = await import('expo-clipboard');
                try {
                  const text = await getStringAsync();
                  setToAddress(text);
                  textInputRef.current?.focus();
                } catch (e) {
                  Alert.alert('Error', "Can't get clipboard content. Please try again.");
                }
              }}
            />
            <ButtonWithIcon
              title="Scan QR Code"
              iconSvg={SvgQRCode}
              onPress={() => {
                navigation.navigate('ScanQRCode');
                ee.once('qrCodeScanned', (data) => {
                  textInputRef.current?.focus();
                  setToAddress(data);
                });
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <TextInput
              ref={textInputRef}
              value={toAddress}
              onChangeText={setToAddress}
              multiline
              editable
              numberOfLines={4}
              maxLength={40}
              keyboardType="email-address"
              style={{
                padding: 10,
                paddingLeft: 14,
                paddingRight: 14,
                borderWidth: 1,
                borderColor: Gray_200,
                borderRadius: 16,

                fontFamily: FontFamilys.RobotoMono_400Regular,
                fontSize: 16,
                color: Gray_700,

                ...Platform.select({
                  ios: {
                    minHeight: 100,
                  },
                }),
              }}
              placeholder="Enter SUI Address"
              placeholderTextColor={Gray_500}
              textAlignVertical="top"
            />
          </View>

          {/* <View style={{ height: 10, backgroundColor: 'red' }} /> */}
        </ScrollView>

        <View style={{ height: 1, backgroundColor: Gray_100, width }} />
        <View style={{ padding: 12 }}>
          <Button title="Next Step" disabled={!toAddress} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export const Send = () => {
  return (
    <SendStackNavgiator.Navigator>
      <SendStackNavgiator.Group>
        <SendStackNavgiator.Screen name="SendSelectCoin" component={SendSelectCoin} options={{ headerShown: false }} />
        <SendStackNavgiator.Screen
          name="SendInputAddress"
          component={SendInputAddress}
          options={{ headerShown: false }}
        />
      </SendStackNavgiator.Group>
    </SendStackNavgiator.Navigator>
  );
};
