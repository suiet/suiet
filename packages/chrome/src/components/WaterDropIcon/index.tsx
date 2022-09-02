import React from 'react';
import TokenIcon, { TokenIconProps } from '../TokenIcon';
import IconWaterDrop from '../../assets/icons/waterdrop.svg';

const WaterDropIcon = (props: Omit<TokenIconProps, 'icon'>) => {
  return <TokenIcon {...props} icon={IconWaterDrop} alt="water-drop" />;
};

export default WaterDropIcon;
