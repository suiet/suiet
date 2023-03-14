import { StackScreenProps } from '@react-navigation/stack';
import { Dimensions, View, Platform, Image, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/../App';
import { Button } from '@/components/Button';
import { useWallets } from '@/hooks/useWallets';

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
        <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 48, lineHeight: 54, color: 'white' }}>Welcome</Text>
        <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 48, lineHeight: 54, color: 'white' }}>to Your</Text>
        <Text style={{ fontFamily: 'WorkSans_700Bold', fontSize: 48, lineHeight: 54, color: 'white' }}>New Wallet</Text>
        <View style={{ height: 8 }} />
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, color: 'rgba(255,255,255,0.7)' }}>
          Copy and save your recovery phrase.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {route.params?.mnemonic?.split(' ').map((word, item) => {
          return (
            <View key={item} style={{ width: '33.3%', flexDirection: 'row', paddingVertical: 8 }}>
              <Text
                style={{
                  fontFamily: Platform.select({
                    ios: 'Menlo',
                    android: 'monospace',
                  }),
                  fontSize: 14,
                  lineHeight: 20,
                  width: 20,
                  marginRight: 8,
                  textAlign: 'right',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {item + 1}
              </Text>
              <Text
                style={{
                  fontFamily: Platform.select({
                    ios: 'Menlo',
                    android: 'monospace',
                  }),
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 20,
                  color: 'rgba(255,255,255,1)',
                }}
              >
                {word}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={{ flexGrow: 1 }} />

      <Button
        title={'Copy and Done'}
        innerStyle={{ marginBottom: 8 }}
        onPressOut={() => {
          const existingWallets = wallets ?? [];
          const address = route.params?.address;
          if (typeof address === 'string') {
            updateWallets([
              ...existingWallets,
              {
                name: `Wallet ${existingWallets.length + 1}`,
                address,
                avatar: '',
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
