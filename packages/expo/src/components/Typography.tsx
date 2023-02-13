import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { Gray_400, Primary_500, White_100 } from '@styles/colors';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgSui, SvgToken } from '@components/icons/constants';

const Title: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[{ fontWeight: '700', fontSize: 24, lineHeight: 36 }, style]} {...props} />;
};
const Small: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[{ fontWeight: '600', fontSize: 16, lineHeight: 20 }, style]} {...props} />;
};
const Normal: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[{ fontWeight: '700', fontSize: 24, lineHeight: 36 }, style]} {...props} />;
};
const Hints: React.FC<TextProps> = ({ style, ...props }) => {
  return <Text style={[{ fontWeight: '700', fontSize: 24, lineHeight: 36 }, style]} {...props} />;
};

export default {
  Title,
  Small,
  Normal,
  Hints,
};
