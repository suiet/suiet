import {
  Error_50,
  Error_500,
  Error_700,
  Gray_100,
  Gray_700,
  Green_100,
  Green_700,
  Warning_100,
  Warning_50,
  Warning_500,
  Warning_700,
  White,
} from '@/styles/colors';
import React from 'react';
import { View } from 'react-native';
import { Label } from './Label';
import Typography from './Typography';

export interface BadgeProps {
  title: string;
  variant?: 'warning' | 'error' | 'success' | 'info';

  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
}

interface BadgeVariants {
  backgroundColor: string;
  titleColor: string;
  defaultTitle?: string;
}

export const Badge: React.FC<BadgeProps> = ({ title, variant = 'info', leftLabel, rightLabel, ...props }) => {
  let VARIANTS: Record<Exclude<BadgeProps['variant'], undefined>, BadgeVariants> = {
    warning: {
      backgroundColor: Warning_50,
      titleColor: Warning_700,
      defaultTitle: 'Warning',
    },
    error: {
      backgroundColor: Error_50,
      titleColor: Error_700,
      defaultTitle: 'Error',
    },
    success: {
      backgroundColor: Green_100,
      titleColor: Green_700,
      defaultTitle: 'Success',
    },
    info: {
      backgroundColor: Gray_100,
      titleColor: Gray_700,
      defaultTitle: '',
    },
  };

  let variants: BadgeVariants = VARIANTS[variant];

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 4,
        height: 32,
        borderRadius: 16,
        backgroundColor: variants.backgroundColor,
        gap: 8,
        alignItems: 'center',
      }}
    >
      {leftLabel ??
        (variants.defaultTitle ? (
          <Label variant={variant} title={variants.defaultTitle} />
        ) : (
          <View style={{ width: 0 }} />
        ))}

      <Typography.Body {...props} children={title} color={variants.titleColor} style={{ flexGrow: 1 }} />

      {rightLabel}
    </View>
  );
};
