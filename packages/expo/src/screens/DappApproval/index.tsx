import React from 'react';
import { View } from 'react-native';

import type { RootStackParamList } from '@/../App';
import type { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';

export const PENDINGS = new Map<string, DappRequest>();

export interface DappRequest {
  content:
    | React.ReactNode
    | ((navigation: StackNavigationProp<RootStackParamList, 'DappApproval', undefined>) => React.ReactNode);
}

export const DappApproval: React.FC<StackScreenProps<RootStackParamList, 'DappApproval'>> = ({ navigation, route }) => {
  const { id } = route.params;
  const { content } = PENDINGS.get(id) ?? {};
  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      {typeof content === 'function' ? content(navigation) : content}
    </View>
  );
};
