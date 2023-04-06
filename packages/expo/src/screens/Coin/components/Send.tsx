import { View, Platform, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import * as React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontFamilys } from '@/hooks/useFonts';
import { useWallets } from '@/hooks/useWallets';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

import { Error_500, Gray_100, Gray_400, Gray_500, Gray_900, Primary_50, Primary_900 } from '@styles/colors';

import { CoinIcon } from '@/components/CoinIcon';
import { Coins } from '@/components/Coins';
import { Button } from '@/components/Button';
import type { RootStackParamList } from '@/../App';
import { TextInput } from '@/components/TextInput';
import Typography from '@/components/Typography';
import { TokenAmountInput } from '@/screens/Swap';
import { useMemo, useState } from 'react';

// import { COIN_TYPE_ARG_REGEX } from '@suiet/core/src/object';
import { Provider } from '@suiet/core/src/provider';
import { Vault } from '@suiet/core/src/vault/Vault';
import { derivationHdPath } from '@suiet/core/src/crypto';
import { addressEllipsis, formatCurrency } from '@/utils/format';
import { useKeychain } from '@/hooks/useKeychain';
import { Coin } from '@/utils/gql';
import { Header } from './Header';
import { AddressBadge } from '@/components/AddressBadge';
import { LoadingDots } from '@/components/Loading';
import Toast from 'react-native-toast-message';
import { getExecutionStatusType, getExecutionStatusError } from '@mysten/sui.js';
import { isNumeric } from '@/utils/check';
import { ToastProps } from '@/components/Toast';

type SendStackParamList = {
  SendSelectCoin: undefined;
  SendInputAddress: { coin: Coin };
  SendInputAmount: { coin: Coin; address: string };
} & RootStackParamList;

const SendStackNavgiator = createStackNavigator<SendStackParamList>();

const SelectedCoin: React.FC<{ coin: Coin }> = ({ coin }) => {
  if (!coin) {
    return null;
  }

  return (
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
        <CoinIcon symbol={coin.symbol} scale={0.6} />
      </View>

      <View style={{ flexGrow: 1, flexShrink: 0 }}>
        <Typography.Label children={coin.symbol} color={Primary_900} />
      </View>
      <View style={{ flexGrow: 0, flexShrink: 0 }}>
        <Typography.Num children={formatCurrency(coin.balance)} color={Primary_900} />
      </View>
    </View>
  );
};

const SelectCoin: React.FC<StackScreenProps<SendStackParamList, 'SendSelectCoin'>> = ({ navigation }) => {
  const { selectedWallet } = useWallets();

  if (typeof selectedWallet === 'undefined') {
    return null;
  }

  return (
    <ScrollView style={{ paddingHorizontal: 24, backgroundColor: '#fff' }} overScrollMode="never">
      <View style={{ marginVertical: 24 }}>
        <Typography.Headline children="Choose" color="black" />
        <Typography.Headline children="Token" color="black" />
        <View style={{ height: 8 }} />
        <Typography.Body children="Which token do you want to send?" color={Gray_400} />
      </View>

      <Coins
        address={selectedWallet}
        onChooseCoin={(coin) => {
          navigation.navigate('SendInputAddress', { coin });
        }}
      />
    </ScrollView>
  );
};

const InputAddress: React.FC<StackScreenProps<SendStackParamList, 'SendInputAddress'>> = ({ navigation, route }) => {
  // {
  //   "address": "0xb914b4d42ffb417f4a760ea8e90c05fb69f8ec9c"
  // }
  const [textInputValue, setTextInputValue] = React.useState<string>(
    '0xc21498bda0aa97e51f4227271d0d6d75d4091c4c1d1804806fd6fd9bc306a899'
  );

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
          overScrollMode="never"
        >
          <SelectedCoin coin={route.params.coin} />

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

          <View style={{ height: 16 }} />

          <AddressBadge address={textInputValue} />
        </ScrollView>

        <View style={{ height: 1, backgroundColor: Gray_100, width }} />
        <View style={{ padding: 12 }}>
          <Button
            title="Next Step"
            disabled={!textInputValue}
            onPress={() => {
              navigation.navigate('SendInputAmount', { coin: route.params.coin, address: textInputValue! });
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const InputAmount: React.FC<StackScreenProps<SendStackParamList, 'SendInputAmount'>> = ({ navigation, route }) => {
  const { width, height } = Dimensions.get('screen');
  // const [scrollViewLayout, setScrollViewLayout] = useState<LayoutRectangle>();
  const { top, bottom } = useSafeAreaInsets();
  const featureFlags = useFeatureFlags();
  const network = featureFlags?.networks?.[featureFlags.default_network];
  const { loadMnemonic } = useKeychain();
  const { selectedWallet } = useWallets();

  const txProvider = useMemo(() => {
    if (!network) {
      return;
    }
    return new Provider(network?.full_node_url, network?.full_node_url, network?.version_cache_timout_in_seconds);
  }, []);

  const [amount, setAmount] = useState<string>();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>();
  const [inputHasError, setInputHasError] = useState<boolean>();

  const coin = route.params.coin;
  const balance = Number(coin.balance);
  const gasBudget = Number(network?.pay_coin_gas_budget!);
  const max = useMemo(() => {
    if (balance > gasBudget) {
      return (balance - gasBudget) / 10 ** coin.metadata.decimals;
    } else {
      return 0;
    }
  }, [balance, gasBudget]);

  if (!route.params.coin) {
    return null;
  }

  if (!featureFlags) {
    return null;
  }

  if (!selectedWallet) {
    return null;
  }

  return (
    <View style={{ backgroundColor: 'white', flexGrow: 1 }}>
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
          style={{ flexGrow: 1, flexDirection: 'column' }}
          contentContainerStyle={{ paddingHorizontal: 24, minHeight: '100%' }}
          overScrollMode="never"
        >
          <SelectedCoin coin={coin} />

          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <TokenAmountInput
              editable={!buttonLoading}
              value={amount}
              onChangeText={(text) => {
                if (isNumeric(text)) {
                  setInputHasError(false);
                  if (Number(text) > max) {
                    setHasError(true);
                    setButtonDisabled(true);
                  } else {
                    setHasError(false);
                    setButtonDisabled(false);
                  }
                } else {
                  setInputHasError(true);
                  setHasError(false);
                  setButtonDisabled(true);
                }

                setAmount(text);
              }}
              wrapperStyle={{ flexGrow: 1 }}
              style={
                hasError || inputHasError
                  ? {
                      color: Error_500,
                    }
                  : undefined
              }
            />
            <Button
              title={'MAX'}
              type="Secondary"
              innerStyle={{ width: 64, height: 40 }}
              onPress={() => {
                setAmount(max.toString());
              }}
            />
          </View>
          <View style={{ width: '100%', flexGrow: 1 }} />
        </ScrollView>

        <View style={{ paddingHorizontal: 24, gap: 16, marginBottom: 24, backgroundColor: 'white' }}>
          <View style={{ height: 1, backgroundColor: Gray_100, width: '100%' }} />

          <View style={{ flexDirection: 'row' }}>
            <Typography.LabelS color={Gray_900} children="To" />
            <Typography.Mono
              style={{ flexGrow: 1, textAlign: 'right' }}
              color={Gray_500}
              children={addressEllipsis(route.params.address)}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Typography.LabelS color={Gray_900} children="Gas Fee Budget" />
            <Typography.Mono
              style={{ flexGrow: 1, textAlign: 'right' }}
              color={Gray_500}
              children={
                (Number(network?.pay_coin_gas_budget!) / 10 ** coin.metadata.decimals).toFixed(coin.metadata.decimals) +
                ' ' +
                coin.symbol
              }
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Typography.LabelS color={Gray_900} children="Balance" />
            <Typography.Mono
              style={{ flexGrow: 1, textAlign: 'right' }}
              color={hasError ? Error_500 : Gray_500}
              children={
                (Number(coin.balance) / 10 ** coin.metadata.decimals).toFixed(coin.metadata.decimals) +
                ' ' +
                coin.symbol
              }
            />
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: Gray_100, width }} />
        <View style={{ padding: 12 }}>
          {buttonLoading ? (
            <View
              style={{
                height: 48,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LoadingDots />
            </View>
          ) : (
            <Button
              title="Confirm"
              disabled={!amount || buttonDisabled}
              onPress={async () => {
                if (!txProvider) {
                  return;
                }

                setButtonDisabled(true);
                // FIXME(hzy): wait for animation
                await new Promise((resolve) => setTimeout(resolve, 500));
                try {
                  const mnemonic = await loadMnemonic(selectedWallet);
                  // const [, coinType] = coin.type.match(COIN_TYPE_ARG_REGEX)!;

                  setButtonLoading(true);
                  // FIXME(hzy): wait for animation
                  await new Promise((resolve) => setTimeout(resolve, 500));

                  const res = await txProvider.transferCoin(
                    coin.type,
                    BigInt(Math.ceil(parseFloat(amount!) * Math.pow(10, coin?.metadata.decimals || 0))),
                    route.params.address,
                    await Vault.fromMnemonic(derivationHdPath(0), mnemonic)
                    // network?.pay_coin_gas_budget!
                  );

                  const statusType = getExecutionStatusType(res);
                  const statusError = getExecutionStatusError(res);

                  if (statusType === 'success') {
                    navigation.navigate('History');
                    Toast.show({
                      type: 'success',
                      text1: 'Send successfully!',
                      visibilityTime: 6000,
                      props: {
                        beautifulBorder: true,
                        icon: require('@assets/grinning_face.png'),
                      } as ToastProps,
                    });
                    return;
                  }

                  if (statusType === 'failure') {
                    if (typeof statusError === 'string') {
                      Toast.show({
                        type: 'error',
                        text1: `Failed to send: ${statusError}`,
                        visibilityTime: 6000,
                        props: {
                          icon: require('@assets/red_exclamation_mark.png'),
                        } as ToastProps,
                      });
                      return;
                    }
                  }
                } catch (e: any) {
                  console.log('Error', e);
                } finally {
                  setButtonDisabled(false);
                  setButtonLoading(false);
                }

                Toast.show({
                  type: 'error',
                  text1: 'Unknown error',
                  visibilityTime: 6000,
                  props: {
                    icon: require('@assets/red_exclamation_mark.png'),
                  } as ToastProps,
                });
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// @ts-ignore
export const Send = ({ navigation: __navigation }) => {
  return (
    <SendStackNavgiator.Navigator>
      <SendStackNavgiator.Group>
        <SendStackNavgiator.Screen
          name="SendSelectCoin"
          component={SelectCoin}
          options={{
            headerMode: 'float',
            header: ({ navigation, route: { name } }) => (
              <Header title={'Send'} onRightAction={() => __navigation.goBack()} />
            ),
          }}
        />
        <SendStackNavgiator.Screen
          name="SendInputAddress"
          component={InputAddress}
          options={{
            headerMode: 'float',
            header: ({ navigation, route: { name } }) => (
              <Header
                title={'Send'}
                onLeftAction={() => navigation.goBack()}
                onRightAction={() => __navigation.goBack()}
              />
            ),
          }}
        />
        <SendStackNavgiator.Screen
          name="SendInputAmount"
          component={InputAmount}
          options={{
            headerMode: 'float',
            header: ({ navigation, route: { name } }) => (
              <Header
                title={'Send'}
                onLeftAction={() => navigation.goBack()}
                onRightAction={() => __navigation.goBack()}
              />
            ),
          }}
        />
      </SendStackNavgiator.Group>
    </SendStackNavgiator.Navigator>
  );
};
