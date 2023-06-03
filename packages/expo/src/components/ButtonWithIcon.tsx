import React from 'react';
import { Gray_100, Gray_400, Gray_700, Primary_500, White } from '@styles/colors';
import { Text, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { FontFamilys } from '@/hooks/useFonts';
import Typography from './Typography';

export const ButtonWithIcon: React.FC<{ iconSvg: string; title: string } & TouchableOpacityProps> = ({
  iconSvg,
  title,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          borderRadius: 20,
          height: 40,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: Gray_100,
          gap: 8,
        }}
      >
        <SvgXml color={Gray_700} width={20} height={20} xml={iconSvg}></SvgXml>
        <Typography.Label children={title} color={Gray_700} />
      </View>
    </TouchableOpacity>
  );
};
