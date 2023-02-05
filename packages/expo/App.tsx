import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StatusBar } from 'expo-status-bar';
import * as Random from 'expo-random';
import { AuthApi, WalletApi } from '@suiet/core';

import ReactNativeStorage from './src/utils/storage';
import Coin from './src/screens/Coin';

const storage = new ReactNativeStorage();

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

  useEffect(() => {
    const execute = async () => {
      const authApi = new AuthApi(storage);
      const walletApi = new WalletApi(storage);

      const t = Date.now();

      await storage.reset();
      await authApi.initPassword(password);
      await authApi.updatePassword({ oldPassword: password, newPassword: password });
      // console.log('time to updatePassword', Date.now() - t);
      const token = await authApi.loadTokenWithPassword(password);
      // console.log('time to loadTokenWithPassword', Date.now() - t);
      const wallet = await walletApi.createWallet({ token });
      // console.log('time to createWallet', Date.now() - t);
      const mnemonic = await walletApi.revealMnemonic({ walletId: wallet.id, token });

      console.log('time to create a wallet: ', Date.now() - t);

      setToken(token);
      setMnemonic(mnemonic);
    };

    setTimeout(async () => {
      await execute();
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>random string: {JSON.stringify(random)}</Text>
      <StatusBar style="auto" />
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Coin" component={Coin} />
        <Tab.Screen name="Home2" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
