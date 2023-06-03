import { FontFamilys } from '@/hooks/useFonts';
import { TextProps, TextStyle } from 'react-native';
import { Text } from 'react-native';
import React from 'react';

export interface ColorProps {
  color?: TextStyle['color'];
}

const Label: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 16, lineHeight: 24 }, style, { color }]}
      {...props}
    />
  );
};

const LabelS: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.Inter_600SemiBold, fontSize: 14, lineHeight: 20 }, style, { color }]}
      {...props}
    />
  );
};

const Mono: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.RobotoMono_400Regular, fontSize: 14, lineHeight: 20 }, style, { color }]}
      {...props}
    />
  );
};

const MonoS: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.RobotoMono_400Regular, fontSize: 12, lineHeight: 16 }, style, { color }]}
      {...props}
    />
  );
};

const MonoBold: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.RobotoMono_500Medium, fontSize: 14, lineHeight: 20 }, style, { color }]}
      {...props}
    />
  );
};

const Num: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[
        { fontFamily: FontFamilys.BarlowSemiCondensed_500Medium, fontSize: 20, lineHeight: 20 },
        style,
        { color },
      ]}
      {...props}
    />
  );
};

const Display: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 48, lineHeight: 54 }, style, { color }]}
      {...props}
    />
  );
};

const Headline: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 36, lineHeight: 40 }, style, { color }]}
      {...props}
    />
  );
};

const Title: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 28, lineHeight: 36 }, style, { color }]}
      {...props}
    />
  );
};

const Subtitle: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.WorkSans_700Bold, fontSize: 18, lineHeight: 24 }, style, { color }]}
      {...props}
    />
  );
};

const Body: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 14, lineHeight: 20 }, style, { color }]}
      {...props}
    />
  );
};

const Comment: React.FC<TextProps & ColorProps> = ({ style, color, ...props }) => {
  return (
    <Text
      style={[{ fontFamily: FontFamilys.Inter_500Medium, fontSize: 12, lineHeight: 16 }, style, { color }]}
      {...props}
    />
  );
};

export default {
  Label,
  LabelS,
  Mono,
  MonoS,
  MonoBold,
  Num,
  Display,
  Headline,
  Title,
  Subtitle,
  Body,
  Comment,
};
