import { Gray_400, Primary_500, White_100 } from '@styles/colors';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgSui, SvgToken } from '@components/icons/constants';

const CoinIcon: React.FC<{ symbol: string }> = ({ symbol }) => {
  if (symbol === 'SUI') {
    return (
      <View style={{ width: 40, height: 40, backgroundColor: Primary_500, borderRadius: 9999 }}>
        <SvgXml style={{ margin: 10 }} color={White_100} width={20} height={20} xml={SvgSui}></SvgXml>
      </View>
    );
  }

  return (
    <View style={{ width: 40, height: 40, backgroundColor: Gray_400, borderRadius: 9999 }}>
      <SvgXml style={{ margin: 10 }} color={White_100} width={20} height={20} xml={SvgToken}></SvgXml>
    </View>
  );
};

export default CoinIcon;
