import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import { Gray_100, Gray_500, Gray_900 } from '@styles/colors';
import { SvgClockRewind, SvgCoins03, SvgGrid01 } from '@components/icons/svgs';

import { Coin } from '@/screens/Coin';
import { Dapp } from '@/screens/Dapp';
import { TxHistory } from '@/screens/TxHistory';
import type { RootStackParamList } from '@/../App';

const Tab = createBottomTabNavigator<RootStackParamList>();

const TabBarIcon: React.FC<{ focused: boolean; iconSvg: string }> = ({ focused, iconSvg }) => {
  return (
    <View style={{ backgroundColor: focused ? Gray_100 : 'transparent', borderRadius: 9999 }}>
      <SvgXml style={{ margin: 16 }} width={24} height={24} color={focused ? Gray_900 : Gray_500} xml={iconSvg} />
    </View>
  );
};

export const Home: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 88,
            paddingBottom: 20,
            paddingTop: 12,
            paddingHorizontal: '18%',
          },
          tabBarItemStyle: { marginHorizontal: 12 },
        }}
      >
        <Tab.Screen
          name="Coin"
          component={Coin}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgCoins03} />,
          }}
        />
        <Tab.Screen
          name="Dapp"
          component={Dapp}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgGrid01} />,
          }}
        />
        <Tab.Screen
          name="TxHistory"
          component={TxHistory}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgClockRewind} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
