import React from 'react';
import { View } from 'react-native';
import Typography from '@/components/Typography';
import { Gray_300, Gray_700 } from '@/styles/colors';

export const Mnemonic: React.FC<{ mnemonic: string; dark?: boolean }> = ({ mnemonic, dark }) => {
  const textColor1 = dark ? 'rgba(255,255,255,0.5)' : Gray_300;
  const textColor2 = dark ? 'rgba(255,255,255,1.0)' : Gray_700;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {mnemonic?.split(' ').map((word, item) => {
        return (
          <View key={item} style={{ width: '33.3%', flexDirection: 'row', paddingVertical: 8, gap: 8 }}>
            <Typography.Mono children={item + 1} color={textColor1} style={{ width: 20, textAlign: 'right' }} />
            <Typography.MonoBold children={word} color={textColor2} />
          </View>
        );
      })}
    </View>
  );
};
