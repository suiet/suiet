import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { SvgPlus, SvgArrowDown, SvgArrowUp, SvgSwitchHorizontal01 } from '@components/icons/constants';
import { GrayCool_100, GrayCool_500, GrayCool_600, GrayCool_700 } from '@styles/colors';

const Coin: React.FC = () => {
  return (
    <View style={{ backgroundColor: '#FFF', display: 'flex', flexDirection: 'row' }}>
      {[
        {
          svg: SvgPlus,
          text: 'Buy',
        },
        {
          svg: SvgArrowDown,
          text: 'Receive',
        },
        {
          svg: SvgArrowUp,
          text: 'Send',
        },
        {
          svg: SvgSwitchHorizontal01,
          text: 'Swap',
        },
      ].map(({ svg, text }, index) => (
        <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={text}>
          <View style={{ backgroundColor: GrayCool_100, borderRadius: 9999 }}>
            <SvgXml style={{ margin: 14 }} width={24} height={24} color={GrayCool_700} xml={svg} />
          </View>
          <Text style={{ color: GrayCool_500, fontSize: 12, lineHeight: 24 }}>{text}</Text>
        </View>
      ))}
    </View>
  );
};

export default Coin;
