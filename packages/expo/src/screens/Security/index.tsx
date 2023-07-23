import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/../App';
import { Gray_100, Gray_300, Gray_400, Gray_700, Success_500, Error_600 } from '@/styles/colors';
import Typography from '@/components/Typography';
import { Button } from '@/components/Button';
import Toast, { ToastProps } from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWallets } from '@/hooks/useWallets';
import { useNetwork } from '@/hooks/useNetwork';
import { LoadingDots } from '@/components/Loading';

export const Security: React.FC<StackScreenProps<RootStackParamList, 'Security'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();

  const { selectedWallet } = useWallets();
  const { networkId } = useNetwork();

  const [revokers, setRevokers] = useState<Record<string, () => Promise<void>>>({});
  const [refreshToken, setRefreshToken] = useState<number>(Date.now());
  const [loadingRevokers, setLoadingRevokers] = useState<boolean>(true);
  useEffect(() => {
    if (typeof selectedWallet === 'undefined' || typeof networkId === 'undefined') {
      return;
    }

    (async function () {
      try {
        const revokers: Record<string, Array<() => Promise<void>>> = {};
        const keys = await AsyncStorage.getAllKeys();
        keys.forEach((key) => {
          let match;
          if (
            (match = key.match(new RegExp(`^dappPermission::.*?::${selectedWallet}::${networkId}::https?://(.+)$`)))
          ) {
            const [, origin] = match;
            revokers[origin] ??= [];
            revokers[origin].push(async () => {
              console.log(`AsyncStorage.removeItem("${key}")`);
              await AsyncStorage.removeItem(key);
            });
          }
        });

        setRevokers(
          Object.fromEntries(
            Object.entries(revokers).map(([origin, revokers]) => [
              origin,
              async () => {
                await Promise.all(revokers.map((r) => r()));
              },
            ])
          )
        );
      } finally {
        setLoadingRevokers(false);
      }
    })();
  }, [refreshToken]);

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          // alignItems: 'center',
          gap: 32,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ marginVertical: 4, gap: 8 }}>
          <Typography.Headline children="Security" color="black" />
          <Typography.Body children="Check the security settings." color={Gray_400} />
        </View>

        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Typography.Subtitle children="Connected dApps" />
          <Typography.Body
            children="If you no longer use an app, you can revoke its access. You will be able to reconnect to the app later if needed."
            color={Gray_400}
          />
          <View />

          <View style={{ paddingVertical: 8, gap: 12, alignItems: 'center', minHeight: 32 }}>
            {Object.keys(revokers).length === 0 ? (
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {loadingRevokers ? (
                  <LoadingDots />
                ) : (
                  <Typography.Comment children="No connected dApps" color={Gray_400} />
                )}
              </View>
            ) : (
              Object.keys(revokers).map((origin) => (
                <View key={origin} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: Success_500 }} />
                  <Typography.Body
                    children={origin}
                    color={Gray_700}
                    style={{ flexShrink: 1, flexGrow: 1, textAlign: 'left' }}
                    numberOfLines={1}
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      setRefreshToken(Date.now());
                      try {
                        await revokers[origin]();
                        Toast.show({
                          type: 'info',
                          text1: `Revoked ${origin}`,
                          visibilityTime: 3000,
                        });
                      } catch (err) {
                        Toast.show({
                          type: 'error',
                          text1: `Failed to revoke ${origin}`,
                          visibilityTime: 3000,
                          props: { icon: require('@assets/red_exclamation_mark.png') } as ToastProps,
                        });
                      }
                    }}
                  >
                    <Typography.Body children="Revoke" color={Error_600} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Typography.Subtitle children="Recovery Phrases" />
          <Typography.Body
            children="A recovery phrase grants full access to all wallets generated by it. You can manage and export your recovery phrases."
            color={Gray_400}
          />
          <View />

          <Button
            onPress={() => {
              navigation.navigate('SecurityWarning', { next: 'Phrase' });
            }}
            type="Error"
            title="Show the Phrases"
          />
        </View>

        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Typography.Subtitle children="Private Key" />
          <Typography.Body
            children="The private key grants full access to the current wallet. You can export the wallet by exporting its private key."
            color={Gray_400}
          />
          <View />

          <Button
            onPress={() => {
              // navigation.navigate('SecurityWarning', { next: 'PrivateKey' });
              Toast.show({
                type: 'info',
                text1: `This feature is WIP`,
                visibilityTime: 3000,
              });
            }}
            type="Error"
            title="Show the Private Key"
          />
        </View>
      </View>
      <View style={{ height: bottom }} />
    </View>
  );
};
