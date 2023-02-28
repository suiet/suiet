import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StatusBar } from 'expo-status-bar';
import * as Random from 'expo-random';
import { AuthApi, WalletApi } from '@suiet/core';

import ReactNativeStorage from './src/utils/storage';
import Coin from './src/screens/Coin';

const storage = new ReactNativeStorage();

import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useInterFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts as useWorkSansFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import { SvgXml } from 'react-native-svg';
import { Gray_100, Gray_500, Gray_700, Gray_900 } from '@styles/colors';
import { SvgClockRewind, SvgCoins, SvgGrid } from '@components/icons/constants';
import { createStackNavigator } from '@react-navigation/stack';
import { Send } from './src/screens/Coin/components/Send';
import { Header } from './src/screens/Coin/components/Header';
import { Settings } from './src/screens/Coin/components/Settings';

function HomeScreen() {
  const [random, setRandom] = useState<Uint8Array>();
  useEffect(() => {
    setInterval(() => {
      Random.getRandomBytesAsync(16).then((bytes) => {
        setRandom(bytes);
      });
    }, 1000);
  }, []);

  const [password] = useState<string>('P@ssw0rd');
  const [token, setToken] = useState<string>();
  const [mnemonic, setMnemonic] = useState<string>();

  // useEffect(() => {
  //   const execute = async () => {
  //     const authApi = new AuthApi(storage);
  //     const walletApi = new WalletApi(storage);

  //     const t = Date.now();

  //     await storage.reset();
  //     await authApi.initPassword(password);
  //     await authApi.updatePassword({ oldPassword: password, newPassword: password });
  //     // console.log('time to updatePassword', Date.now() - t);
  //     const token = await authApi.loadTokenWithPassword(password);
  //     // console.log('time to loadTokenWithPassword', Date.now() - t);
  //     const wallet = await walletApi.createWallet({ token });
  //     // console.log('time to createWallet', Date.now() - t);
  //     const mnemonic = await walletApi.revealMnemonic({ walletId: wallet.id, token });

  //     console.log('time to create a wallet: ', Date.now() - t);

  //     setToken(token);
  //     setMnemonic(mnemonic);
  //   };

  //   setTimeout(async () => {
  //     await execute();
  //   }, 500);
  // }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>random string: {JSON.stringify(random)}</Text>
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Coin: undefined;

  Home: undefined;
  Home1: undefined;
  Home2: undefined;

  Send: undefined;
  Settings: undefined;
};

// const RootStack = createNativeStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const TabBarIcon: React.FC<{ focused: boolean; iconSvg: string }> = ({ focused, iconSvg }) => {
  return (
    <View style={{ backgroundColor: focused ? Gray_100 : 'transparent', borderRadius: 9999 }}>
      <SvgXml style={{ margin: 16 }} width={24} height={24} color={focused ? Gray_900 : Gray_500} xml={iconSvg} />
    </View>
  );
};

function Home() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
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
}

function App() {
  const [fontsInterLoaded] = useInterFonts({
    Inter_700Bold,
  });

  const [fontsWorkSansLoaded] = useWorkSansFonts({
    WorkSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsInterLoaded && fontsWorkSansLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsInterLoaded, fontsWorkSansLoaded]);

  if (!fontsInterLoaded || !fontsWorkSansLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          </RootStack.Group>
          <RootStack.Group
            screenOptions={{
              presentation: 'modal',
              gestureDirection: 'vertical',
              gestureEnabled: true,
            }}
          >
            <RootStack.Screen
              name="Send"
              component={Send}
              options={({ route }) => {
                const r = getFocusedRouteNameFromRoute(route);
                if (r === 'SendInputAddress') {
                  return {
                    header: ({ navigation, route: { name } }) => (
                      <Header
                        title={name}
                        onLeftAction={() => navigation.navigate('SendSelectCoin')}
                        onRightAction={() => navigation.goBack()}
                      />
                    ),
                  };
                }
                return {
                  header: ({ navigation, route: { name } }) => (
                    <Header title={name} onRightAction={() => navigation.goBack()} />
                  ),
                };
              }}
            />
            <RootStack.Screen
              name="Settings"
              component={Settings}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={name} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;
