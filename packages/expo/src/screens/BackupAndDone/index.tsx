import { StackScreenProps } from '@react-navigation/stack';
import { Dimensions, View, Platform, Image, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/../App';
import { Button } from '@/components/Button';
import { useWallets } from '@/hooks/useWallets';
import { FontFamilys } from '@/hooks/useFonts';
import Typography from '@/components/Typography';
import { White_100 } from '@/styles/colors';

export const BackupAndDone: React.FC<StackScreenProps<RootStackParamList, 'BackupAndDone'>> = ({
  route,
  navigation,
}) => {
  const source = Image.resolveAssetSource(require('@assets/bg.png'));
  const { width, height } = Dimensions.get('screen');

  const { top, bottom } = useSafeAreaInsets();

  const { wallets, updateWallets, selectedWallet, updateSelectedWallet } = useWallets();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white', paddingHorizontal: 24 }}>
      <Image style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="stretch" source={source} />

      <View style={{ flexGrow: 1, maxHeight: 150 }} />

      <View style={{ marginBottom: 40 }}>
        <Typography.Headline children="Welcome" color={White_100} />
        <Typography.Headline children="to Your" color={White_100} />
        <Typography.Headline children="New Wallet" color={White_100} />
        <View style={{ height: 8 }} />
        <Typography.Body children="Copy and save your recovery phrase." color={`rgba(255,255,255,0.7)`} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {route.params?.mnemonic?.split(' ').map((word, item) => {
          return (
            <View key={item} style={{ width: '33.3%', flexDirection: 'row', paddingVertical: 8, gap: 8 }}>
              <Typography.Mono
                children={item + 1}
                color={`rgba(255,255,255,0.5)`}
                style={{ width: 20, textAlign: 'right' }}
              />
              <Typography.MonoBold children={word} color={`rgba(255,255,255,1)`} />
            </View>
          );
        })}
      </View>

      <View style={{ flexGrow: 1 }} />

      <Button
        title={'Copy and Done'}
        innerStyle={{ marginBottom: 8 }}
        onPress={() => {
          const existingWallets = wallets ?? [];
          const address = route.params?.address;
          if (typeof address === 'string') {
            updateWallets([
              ...existingWallets,
              {
                name: `Wallet ${existingWallets.length + 1}`,
                address,
                avatar: 0,
              },
            ]);
            if (typeof selectedWallet === 'undefined') {
              updateSelectedWallet(address);
            }
          }
          navigation.popToTop();
          navigation.replace('Home');
        }}
      />

      <View style={{ height: bottom }} />
    </View>
  );
};
