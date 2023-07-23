import { ScrollView } from 'react-native';
import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { useWallets } from '@/hooks/useWallets';

import { CoinsNew } from '@/components/Coins';
import type { RootStackParamList } from '@/../App';

export const SelectToken: React.FC<StackScreenProps<RootStackParamList, 'SelectToken'>> = ({ navigation }) => {
  const { selectedWallet } = useWallets();
  if (!selectedWallet) {
    return null;
  }

  return (
    <ScrollView style={{ paddingHorizontal: 24, backgroundColor: '#fff' }} overScrollMode="never">
      <CoinsNew
        address={selectedWallet}
        onChooseCoin={() => {
          navigation.goBack();
        }}
      />
    </ScrollView>
  );
};
