import React from 'react';
import { View } from 'react-native';

import type { TxDateContainerProps } from '@suiet/chrome-ext/src/components/tx-history/TxDateContainer';

import Typography from '@/components/Typography';
import { Gray_900, White } from '@/styles/colors';

export const TxDateContainer: React.FC<TxDateContainerProps> = ({ title }) => {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 16, backgroundColor: White }}>
      <Typography.Subtitle color={Gray_900} children={title} />
    </View>
  );
};
