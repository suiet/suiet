import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Error_100, Error_500, Gray_400, Gray_900 } from '@/styles/colors';
import { SvgAlertCircle, SvgKey01, SvgMessageAlertSquare, SvgShare07 } from '@/components/icons/svgs';
import { SvgXml } from 'react-native-svg';
import { useWallets } from '@/hooks/useWallets';
import Typography from '@/components/Typography';
import Toast from 'react-native-toast-message';
import { ToastProps } from '@/components/Toast';
import { Button } from '@/components/Button';
import { useKeychain } from '@/hooks/useKeychain';
import { LoadingDots } from '@/components/Loading';

export const SecurityWarning: React.FC<StackScreenProps<RootStackParamList, 'SecurityWarning'>> = ({
  navigation,
  route,
}) => {
  const { top, bottom } = useSafeAreaInsets();

  const { selectedWallet } = useWallets();
  const { loadMnemonic } = useKeychain();
  const [confirming, setConfirming] = React.useState(false);

  if (!selectedWallet) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 24,

          flexGrow: 1,
        }}
      >
        <View style={{ backgroundColor: Error_100, borderRadius: 9999, padding: 12 }}>
          <SvgXml width={32} height={32} xml={SvgAlertCircle} color={Error_500} />
        </View>
        <Typography.Title children="Warning" />

        <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 24, flexGrow: 1 }}>
          {[
            {
              icon: SvgKey01,
              title: 'Full control of your wallet',
              description:
                'Anyone with the private key or recovery phrases can have full control of your wallet funds and assets.',
            },
            {
              icon: SvgShare07,
              title: 'Never share with anyone',
              description:
                'You should not share your private key or  recovery phrases with anyone, or type in any applications.',
            },
            {
              icon: SvgMessageAlertSquare,
              title: 'Suiet will never ask for it',
              description: 'Suiet will never ask for your private key or recovery phrases.',
            },
          ].map(({ icon, title, description }) => (
            <View key={title} style={{ flexDirection: 'column', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SvgXml width={16} height={16} xml={icon} color={Error_500} />
                <Typography.Label children={title} color={Gray_900} />
              </View>

              <Typography.Body children={description} color={Gray_400} />
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingVertical: 12, paddingHorizontal: 16, gap: 8 }}>
        {confirming ? (
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              // backgroundColor: Error_50,
            }}
          >
            <LoadingDots />
          </View>
        ) : (
          <Button
            title="Confirm"
            type="Error"
            onPress={async () => {
              if (route.params.next === 'Phrase') {
                try {
                  setConfirming(true);
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  const m = await loadMnemonic(selectedWallet);
                  navigation.replace('SecurityShow', { next: 'Phrase', content: m });
                } catch (e) {
                  Toast.show({
                    type: 'error',
                    text1: `Failed to load recovery phrases`,
                    visibilityTime: 6000,
                    props: {
                      icon: require('@assets/red_exclamation_mark.png'),
                    } as ToastProps,
                  });
                } finally {
                  setConfirming(false);
                }
              }
            }}
          />
        )}
        <Button
          title="Cancel"
          type="Secondary"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
      <View style={{ height: bottom }} />
    </View>
  );
};
