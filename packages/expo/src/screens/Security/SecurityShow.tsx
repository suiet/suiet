import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Gray_100, Gray_400, Gray_50 } from '@/styles/colors';
import Typography from '@/components/Typography';
import { Mnemonic } from '@/components/Mnemonic';
import { Button } from '@/components/Button';
import { ToastProps } from 'react-native-toast-message';

export const SecurityShowRecoveryPharses: React.FC<{ content: string }> = ({ content }) => {
  return (
    <>
      <View style={{ marginVertical: 4, gap: 8 }}>
        <Typography.Headline children={`Recovery\nPhrases`} color="black" />
        <Typography.Body children="NEVER share with others." color={Gray_400} />
      </View>

      <View style={{ backgroundColor: Gray_50, borderRadius: 16, padding: 16 }}>
        <Mnemonic mnemonic={content} />
      </View>

      <Typography.Body
        children="Anyone with the private key or recovery phrases can have full control of your wallet funds and assets."
        color={Gray_400}
      />
    </>
  );
};

export const SecurityShowPrivateKey: React.FC<{ content: string }> = ({ content }) => {
  return (
    <>
      <View style={{ marginVertical: 4, gap: 8 }}>
        <Typography.Headline children={`Private\nKey`} color="black" />
        <Typography.Body children="NEVER share with others." color={Gray_400} />
      </View>

      <View style={{ backgroundColor: Gray_50, borderRadius: 16, padding: 16 }}>
        <Typography.Mono children={content} />
      </View>

      <Typography.Body
        children="Anyone with the private key or recovery phrases can have full control of your wallet funds and assets."
        color={Gray_400}
      />
    </>
  );
};

export const SecurityShow: React.FC<StackScreenProps<RootStackParamList, 'SecurityShow'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();

  const renderContent = () => {
    if (route.params.next === 'Phrase') {
      return <SecurityShowRecoveryPharses content={route.params.content} />;
    } else if (route.params.next === 'PrivateKey') {
      return <SecurityShowPrivateKey content={route.params.content} />;
    } else {
      return null;
    }
  };

  const handleCopy = async () => {
    const Clipboard = await import('expo-clipboard');
    const { default: Toast } = await import('react-native-toast-message');
    await Clipboard.setStringAsync(route.params.content);
    Toast.show({
      type: 'success',
      text1: 'Copied to clipboard!',
      props: {
        icon: require('@assets/magic_wand.png'),
      } as ToastProps,
    });

    navigation.goBack();
  };

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View
        style={{
          flexDirection: 'column',
          gap: 24,
          paddingHorizontal: 24,

          flexGrow: 1,
        }}
      >
        {renderContent()}
      </View>

      <View style={{ flexGrow: 1 }} />

      <View style={{ height: 1, backgroundColor: Gray_100, width: '100%' }} />
      <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
        <Button onPress={handleCopy} title="Copy" />
      </View>
      <View style={{ height: bottom - 8 }} />
    </View>
  );
};
