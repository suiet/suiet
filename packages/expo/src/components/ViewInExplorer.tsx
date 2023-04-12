import * as React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { View } from 'react-native';

import { Gray_400 } from '@/styles/colors';
import { SvgLinkExternal01 } from '@/components/icons/svgs';
import { SvgXml } from 'react-native-svg';
import Typography from '@/components/Typography';

export const ViewInExplorer: React.FC<{ link: string }> = ({ link }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(link);
        }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 }}
      >
        <Typography.Comment color={Gray_400} children="View in explorer" />
        <SvgXml width={14} height={14} xml={SvgLinkExternal01} color={Gray_400} />
      </TouchableOpacity>
    </View>
  );
};
``;
