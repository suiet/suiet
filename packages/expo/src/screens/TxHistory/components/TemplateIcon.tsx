import React from 'react';
import { View, Image } from 'react-native';
import type { TemplateIconProps, TemplateIconType } from '@suiet/chrome-ext/src/components/tx-history/TemplateIcon';
import type { IconContainerProps } from '@suiet/chrome-ext/src/components/icons/IconContainer';
import type { IconProps } from '@suiet/chrome-ext/src/components/icons/Icon';

import { Gray_100, Gray_400, Gray_500, Primary_500, Red_600, White } from '@/styles/colors';
import { SvgXml } from 'react-native-svg';
import { iconMap } from '@/screens/TxHistory/utils/iconMap';
import { resolveColor } from '@/screens/TxHistory/utils/color';

export const IconContainer: React.FC<React.PropsWithChildren<IconContainerProps>> = ({ shape, color, children }) => {
  let backgroundColor = Gray_400;

  if (color) {
    // 'gray' | 'blue' | 'purple' | 'red' | 'transparent'
    if (color === 'gray') {
      backgroundColor = Gray_500;
    } else if (color === 'blue') {
      backgroundColor = Primary_500;
    } else if (color === 'purple') {
      backgroundColor = '#7a5af8';
    } else if (color === 'red') {
      backgroundColor = Red_600;
    } else if (color === 'transparent') {
      backgroundColor = 'transparent';
    } else {
      backgroundColor = resolveColor(color);
    }
  }

  return (
    <View
      style={[
        shape === 'circle' ? { borderRadius: 9999 } : { borderRadius: 8 },
        {
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
        },
      ]}
    >
      {children}
    </View>
  );
};

export const Sui: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer shape={'circle'} color="blue">
      <SvgXml
        height={18}
        width={18}
        xml={`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.48761 14.8744C4.63809 16.8317 6.69879 18 8.99974 18C11.3007 18 13.361 16.8317 14.5119 14.8744C15.6624 12.9174 15.6624 10.5807 14.5119 8.62345L9.66384 0.376563C9.36869 -0.125522 8.6308 -0.125521 8.33565 0.376564L3.48761 8.62345C2.33714 10.5803 2.33714 12.9171 3.48761 14.8744ZM7.63405 4.29997L8.66767 2.5416C8.81527 2.29055 9.18422 2.29055 9.33182 2.5416L13.3083 9.30617C14.0389 10.5489 14.176 11.9872 13.7197 13.3034C13.6722 13.0887 13.6058 12.869 13.5163 12.647C12.967 11.2857 11.725 10.2351 9.82419 9.52437C8.51731 9.03752 7.68313 8.32146 7.34417 7.39598C6.90757 6.20314 7.36359 4.90237 7.63405 4.29997ZM5.8715 7.29828L4.69117 9.30617C3.7918 10.8361 3.7918 12.6624 4.69117 14.1924C5.59055 15.7223 7.20099 16.6353 8.99974 16.6353C10.1944 16.6353 11.3064 16.2322 12.1819 15.5131C12.2961 15.2308 12.6497 14.1973 12.2129 13.1321C11.8094 12.1484 10.8384 11.3632 9.32666 10.7976C7.61783 10.161 6.50764 9.16714 6.02758 7.84447C5.96145 7.66238 5.91008 7.47987 5.8715 7.29828Z" fill="white"/>
</svg>
`}
      />
    </IconContainer>
  );
};

export const Coin: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer shape={'circle'} color="purple">
      <SvgXml height={18} width={18} xml={iconMap['Coin']!} color={White} />
    </IconContainer>
  );
};

export const Txn: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer color={'gray'}>
      <SvgXml height={18} width={18} xml={iconMap['Txn']!} color={White} />
    </IconContainer>
  );
};

export const TxnError: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer color={'bg-error-100'} shape={'circle'}>
      <SvgXml height={18} width={18} xml={iconMap['Close']!} color="#d92d20" />
    </IconContainer>
  );
};

export const TxnSuccess: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer color={'bg-blue-50'} shape={'circle'}>
      <SvgXml height={18} width={18} xml={iconMap['Txn']!} color="#0096FF" />
    </IconContainer>
  );
};

export const ObjectIcon: React.FC<TemplateIconProps> = (props) => {
  return (
    <IconContainer color={'gray'} shape={'square'}>
      <SvgXml height={18} width={18} xml={iconMap['Object']!} color={White} />
    </IconContainer>
  );
};

export const TemplateIcon: React.FC<{ icon: TemplateIconType }> = (props) => {
  const { icon } = props;
  if (icon.startsWith('http') || icon.startsWith('data:image')) {
    return (
      <IconContainer shape={'square'} color={'transparent'}>
        <Image source={{ uri: icon }} style={{ width: 36, height: 36, backgroundColor: Gray_100 }} />
      </IconContainer>
    );
  }

  if (icon === 'Sui') {
    return <Sui />;
  } else if (icon === 'Coin') {
    return <Coin />;
  } else if (icon === 'Txn') {
    return <Txn />;
  } else if (icon === 'TxnError') {
    return <TxnError />;
  } else if (icon === 'TxnSuccess') {
    return <TxnSuccess />;
  } else if (icon === 'Object') {
    return <ObjectIcon />;
  } else {
    return <ObjectIcon />;
  }
};
