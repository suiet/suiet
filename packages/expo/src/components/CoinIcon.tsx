import { Gray_400, Primary_500, White_100 } from '@styles/colors';
import { View, ViewProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgSui, SvgToken } from '@components/icons/constants';

const CoinIcon: React.FC<{ symbol: string; scale?: number } & ViewProps> = ({ symbol, scale = 1, style, ...props }) => {
  if (symbol === 'SUI') {
    return (
      <View
        style={[{ width: 40 * scale, height: 40 * scale, backgroundColor: Primary_500, borderRadius: 9999 }, style]}
        {...props}
      >
        <SvgXml
          style={{ margin: 10 * scale }}
          color={White_100}
          width={20 * scale}
          height={20 * scale}
          xml={SvgSui}
        ></SvgXml>
      </View>
    );
  }

  return (
    <View
      style={[{ width: 40 * scale, height: 40 * scale, backgroundColor: Gray_400, borderRadius: 9999 }, style]}
      {...props}
    >
      <SvgXml
        style={{ margin: 10 * scale }}
        color={White_100}
        width={20 * scale}
        height={20 * scale}
        xml={SvgToken}
      ></SvgXml>
    </View>
  );
};

export default CoinIcon;
