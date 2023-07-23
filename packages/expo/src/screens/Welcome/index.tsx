import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Gray_400 } from '@styles/colors';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import type { RootStackParamList } from '@/../App';
import { useWallets } from '@/hooks/useWallets';
import { useKeychain } from '@/hooks/useKeychain';
import Typography from '@/components/Typography';

export const Welcome: React.FC<StackScreenProps<RootStackParamList, 'Welcome'>> = ({ navigation }) => {
  const source = Image.resolveAssetSource(require('@assets/welcome_bg.png'));
  const width = Dimensions.get('window').width;

  const { top, bottom } = useSafeAreaInsets();

  const { wallets, updateWallets } = useWallets();
  const { isSupported, alertUnsupportedDevice } = useKeychain();

  // const { isLoading: isWalletsLoading, isEmpty: isWalletsEmpty } = useWallets();
  // useEffect(() => {
  //   if (!isWalletsLoading) {
  //     if (!isWalletsEmpty) {
  //       navigation.replace('Home');
  //     }
  //   }
  // }, [isWalletsEmpty, isWalletsLoading]);

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <Image
        style={[StyleSheet.absoluteFill, { width, height: width * (source.height / source.width) }]}
        resizeMode="contain"
        source={source}
      />

      <View style={{ flexGrow: 1 }} />

      <View
        style={{
          paddingHorizontal: 16,
        }}
      >
        <View style={{ marginBottom: 80 }}>
          <Typography.Display children="Welcome" color={'black'} />
          <Typography.Display children="Suiet" color={'black'} />
          <View style={{ height: 8 }} />
          <Typography.Body children="The wallet for everyone." color={Gray_400} />
        </View>

        <View style={{ gap: 8 }}>
          <Button
            title={'Create New Wallet'}
            onPress={() => {
              // const { getSupportedBiometryType } = await import('react-native-keychain');
              // const supportedType = await getSupportedBiometryType();
              // if (supportedType === null) {
              //   Alert.alert(
              //     'Unsupported Device',
              //     'Unable to find a supported secure authentication method on this device. Due to security concerns, we cannot proceed.'
              //   );
              // } else {
              //   navigation.push('CreateNew');
              // }
              isSupported().then((supported) => {
                if (supported) {
                  navigation.push('CreateNew');
                } else {
                  alertUnsupportedDevice();
                }
              });
            }}

            // onPress={() => {
            //   updateWallets([
            //     ...(wallets ?? []),
            //     {
            //       address: '0x0000000',
            //       name: 'Wallet 1',
            //       avatar: 'https://avatars.githubusercontent.com/u/13744167?v=4',
            //     },
            //   ]);
            // }}
          />

          <Button
            title={'Import Old Wallet'}
            type="Secondary"
            onPress={() => {
              isSupported().then((supported) => {
                if (supported) {
                  navigation.push('ImportOld');
                } else {
                  alertUnsupportedDevice();
                }
              });
            }}
          />
        </View>
      </View>

      <View style={{ height: bottom + 4 }} />
    </View>
  );
};
