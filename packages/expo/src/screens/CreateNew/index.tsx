import { StyleSheet, Text, View, Image, Platform, Dimensions, Alert } from 'react-native';
import * as React from 'react';
import { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/../App';
import { Button } from '@/components/Button';
import { LoadingAvatars, LoadingDots } from '@/components/Loading';
import { Gray_400 } from '@/styles/colors';
import { useFakeKeychain, useKeychain } from '@/hooks/useKeychain';
import { FontFamilys } from '@/hooks/useFonts';
import Typography from '@/components/Typography';

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

export const CreateNew: React.FC<StackScreenProps<RootStackParamList, 'CreateNew'>> = ({ navigation }) => {
  // React.useEffect(() => {
  //   let id = setTimeout(async function () {
  //     const { generateMnemonic } = await import('@scure/bip39');
  //     const { wordlist } = await import('@scure/bip39/wordlists/english');
  //     const { Vault } = await import('@suiet/core/src/vault/Vault');

  //     const t1 = Date.now();
  //     const mnemonic = generateMnemonic(wordlist);
  //     console.log(`Create a new wallet with mnemonic "${mnemonic}" with in ${Date.now() - t1}ms`);

  //     const t2 = Date.now();
  //     const vault = await Vault.fromMnemonic(mnemonic);
  //     const address = vault.getAddress();
  //     const service = `SUIET_WALLET_MNEMONIC_${address}`;
  //     console.log(`Vault.fromMnemonic cost ${Date.now() - t2}ms`);

  //     if (true) {
  //       navigation.replace('BackupAndDone', { mnemonic, address });
  //       return;
  //     }

  //     try {
  //       await setGenericPassword(address, mnemonic, {
  //         service,

  //         accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
  //         authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
  //         accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  //         storage: STORAGE_TYPE.KC,
  //         securityLevel: SECURITY_LEVEL.SECURE_HARDWARE,
  //       });

  //       try {
  //         const saved = await getGenericPassword({
  //           service,
  //           authenticationPrompt: {
  //             title: 'Test your device authentication',
  //             description: "A accessing test is required to ensure your device's authentication is working properly",
  //             cancel: 'Cancel',
  //           },
  //         });

  //         // @ts-ignore
  //         if (saved && saved.username === address && saved.password === mnemonic) {
  //           {
  //             // @ts-ignore
  //             delete saved.username;
  //             // @ts-ignore
  //             delete saved.password;
  //           }
  //           navigation.replace('BackupAndDone', { mnemonic, address });
  //           return;
  //         }
  //       } catch (e) {}
  //       Alert.alert(
  //         'Error',
  //         'Something went wrong with your device authentication. We cannot accessing your just created wallet and it will be deleted.',
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => {
  //               navigation.goBack();
  //             },
  //           },
  //         ]
  //       );
  //     } catch (e) {
  //       Alert.alert('Error', "Failed to save your wallet to device's keychain. We cannot proceed.", [
  //         {
  //           text: 'OK',
  //           onPress: () => {
  //             navigation.goBack();
  //           },
  //         },
  //       ]);
  //     }

  //     resetGenericPassword({
  //       service,
  //     });
  //     // .then(async (reset) => {
  //     //   console.log('reset', reset);
  //     //   const a = await getAllGenericPasswordServices();
  //     //   console.log(a);
  //     //   for (const service of a) {
  //     //     await resetGenericPassword({ service });
  //     //   }

  //     //   const b = await getAllGenericPasswordServices();
  //     //   console.log(b);
  //     // });
  //   }, 1000);

  //   return () => {
  //     clearTimeout(id);
  //   };
  // }, []);

  const { saveMnemonic } = useKeychain();

  useEffect(() => {
    let id = setTimeout(async function () {
      const { generateMnemonic } = await import('@scure/bip39');
      const { wordlist } = await import('@scure/bip39/wordlists/english');
      const { Vault } = await import('@suiet/core/src/vault/Vault');
      const { derivationHdPath } = await import('@suiet/core/src/crypto');

      const mnemonic = generateMnemonic(wordlist);
      const vault = await Vault.fromMnemonic(derivationHdPath(0), mnemonic);
      const address = vault.getAddress();

      try {
        await saveMnemonic(address, mnemonic);
        navigation.replace('BackupAndDone', { address, mnemonic });
        return;
      } catch (e: any) {
        Alert.alert('Error', e.message, [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  });

  return (
    <View
      style={{
        flexDirection: 'column',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 24,
      }}
    >
      <LoadingAvatars />
      <View style={{ height: 24 }} />

      <Typography.Headline style={{ textAlign: 'center' }} color="black" children="Waiting..." />
      <View style={{ height: 4 }} />
      <Typography.Body style={{ textAlign: 'center' }} color={Gray_400} children="Your new wallet is creating now." />
      <View style={{ height: 24 }} />
      <LoadingDots />
      <View style={{ height: 80 }} />
    </View>
  );
};
