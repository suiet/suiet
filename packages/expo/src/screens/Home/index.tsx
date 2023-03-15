import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import { Gray_100, Gray_500, Gray_900 } from '@styles/colors';
import { SvgClockRewind, SvgCoins, SvgGrid } from '@components/icons/constants';

import { Coin } from '@/screens/Coin';
import { RootStackParamList } from '@/../App';

const Tab = createBottomTabNavigator<RootStackParamList>();

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

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
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgCoins} />,
          }}
        />
        <Tab.Screen
          name="Home1"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgGrid} />,
          }}
        />
        <Tab.Screen
          name="Home2"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} iconSvg={SvgClockRewind} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};
