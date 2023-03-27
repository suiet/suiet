import { Error_500, Gray_700, Warning_600, White_100 } from '@/styles/colors';
import { View, ViewProps } from 'react-native';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import Typography from './Typography';

export interface LabelProps {
  title: string;
  variant?: 'warning' | 'error' | 'info';

  rightIconSvg?: string;
}

interface LabelVariants {
  backgroundColor: string;
  textColor: string;
}

export const Label: React.FC<LabelProps & ViewProps> = ({ title, variant = 'info', rightIconSvg, style, ...props }) => {
  let VARIANTS: Record<Exclude<LabelProps['variant'], undefined>, LabelVariants> = {
    warning: {
      backgroundColor: Warning_600,
      textColor: White_100,
    },
    error: {
      backgroundColor: Error_500,
      textColor: White_100,
    },
    info: {
      backgroundColor: Gray_700,
      textColor: White_100,
    },
  };

  let variants: LabelVariants = VARIANTS[variant];

  return (
    <View
      {...props}
      style={[
        {
          height: 24,
          borderRadius: 16,
          backgroundColor: variants.backgroundColor,
          paddingVertical: 2,
          paddingHorizontal: 10,

          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        style,
      ]}
    >
      <Typography.Body children={title} color={White_100} />
      {rightIconSvg && <SvgXml width={12} height={12} color={White_100} xml={rightIconSvg} />}
    </View>
  );
};
