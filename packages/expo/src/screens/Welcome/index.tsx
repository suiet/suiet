import { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native';
import { Gray_100, Gray_400, Gray_700 } from '@styles/colors';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { RootStackParamList } from '@/../App';
import { useWallets } from '@/hooks/useWallets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFakeKeychain, useKeychain } from '@/hooks/useKeychain';
import { FontFamilys } from '@/hooks/useFonts';

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
          <Text style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 48, lineHeight: 54 }}>Welcome</Text>
          <Text style={{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 48, lineHeight: 54 }}>Suiet</Text>
          <View style={{ height: 8 }} />
          <Text style={{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 14, lineHeight: 20, color: Gray_400 }}>
            The wallet for everyone.
          </Text>
        </View>

        <View>
          <Button
            title={'Create New Wallet'}
            innerStyle={{ marginBottom: 8 }}
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
            innerStyle={{ backgroundColor: Gray_100, marginBottom: 8 }}
            textStyle={{ color: Gray_700 }}
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

      <View style={{ height: bottom }} />
    </View>
  );
};
