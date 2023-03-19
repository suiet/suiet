import { Text, View, Platform, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import * as React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamilys } from '@/hooks/useFonts';
import { useWallets } from '@/hooks/useWallets';
import { Gray_100, Gray_400, Primary_50, Primary_900 } from '@styles/colors';

import { CoinIcon } from '@/components/CoinIcon';
import { Coins } from '@/components/Coins';
import { Button } from '@/components/Button';
import type { RootStackParamList } from '@/../App';
import { TextInput } from '@/components/TextInput';
import Typography from '@/components/Typography';

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
        <Typography.Headline children="Choose" color="black" />
        <Typography.Headline children="Token" color="black" />
        <View style={{ height: 8 }} />
        <Typography.Body children="Which token do you want to send?" color={Gray_400} />
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
  const [textInputValue, setTextInputValue] = React.useState<string>();

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

            <View style={{ flexGrow: 1, flexShrink: 0 }}>
              <Typography.Label children={'SUI'} color={Primary_900} />
            </View>
            <View style={{ flexGrow: 0, flexShrink: 0 }}>
              <Typography.Num children={'1256.45'} color={Primary_900} />
            </View>
          </View>

          <View style={{ marginLeft: 8, marginRight: 8, marginBottom: 24 }}>
            <Typography.Title color="black">Input Address</Typography.Title>
            <Typography.Body color={Gray_400}>Enter and validate Address</Typography.Body>
          </View>

          <TextInput
            value={textInputValue}
            onChangeText={setTextInputValue}
            placeholder="Enter SUI address"
            style={{
              fontFamily: FontFamilys.RobotoMono_400Regular,
              minHeight: 96,
            }}
          />
        </ScrollView>

        <View style={{ height: 1, backgroundColor: Gray_100, width }} />
        <View style={{ padding: 12 }}>
          <Button title="Next Step" disabled={!textInputValue} />
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
