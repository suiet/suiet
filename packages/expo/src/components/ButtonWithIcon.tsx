import { Gray_100, Gray_400, Gray_700, Primary_500, White_100 } from '@styles/colors';
import { Text, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgSui, SvgToken } from '@components/icons/constants';

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
        }}
      >
        <SvgXml style={{ marginRight: 8 }} color={Gray_700} width={20} height={20} xml={iconSvg}></SvgXml>
        <Text style={{ fontWeight: '600', fontSize: 16, lineHeight: 24, color: Gray_700 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
