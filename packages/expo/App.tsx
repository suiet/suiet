import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Send } from '@/screens/Coin/components/Send';
import { Header } from '@/screens/Coin/components/Header';
import { Settings } from '@/screens/Coin/components/Settings';
import { useFonts } from '@/hooks/useFonts';
import { useSetAndroidNavigation } from '@/hooks/useSetAndroidNavigation';
import { CreateNew } from '@/screens/CreateNew';
import { BackupAndDone } from '@/screens/BackupAndDone';
import { ImportOld } from '@/screens/ImportOld';
import { ScanQRCode } from '@/screens/ScanQRCode';
import { persistor, store } from '@/store';
import { useWallets } from '@/hooks/useWallets';
import { Welcome } from '@/screens/Welcome';
import { Home } from '@/screens/Home';
import { SelectWallet } from '@/screens/SelectWallet';
import { EditWallet } from '@/screens/EditWallet';
import { Receive } from '@/screens/Receive';
// import { LoadingAvatars, LoadingDots } from '@/components/Loading';

// SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  Welcome: undefined;
  CreateNew: undefined;
  ImportOld: undefined;
  BackupAndDone: {
    mnemonic: string;
    address: string;
  };
  Coin: undefined;

  ScanQRCode: undefined;
  SelectWallet: undefined;

  Home: undefined;
  Home1: undefined;
  Home2: undefined;

  Send: undefined;
  Receive: undefined;
  Settings: undefined;
  EditWallet: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

function App() {
  const { isLoading: isWalletsLoading, isEmpty: isWalletsEmpty /* loadWallets */, wallets } = useWallets();

  return (
    <>
      <StatusBar style="dark" translucent={true} />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={isWalletsEmpty ? 'Welcome' : 'Home'}>
          <RootStack.Group>
            <RootStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <RootStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <RootStack.Screen name="BackupAndDone" component={BackupAndDone} options={{ headerShown: false }} />
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
                    // gestureEnabled: false,
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
                  // gestureEnabled: false,
                  header: ({ navigation, route: { name } }) => (
                    <Header title={name} onRightAction={() => navigation.goBack()} />
                  ),
                };
              }}
            />
            <RootStack.Screen
              name="Receive"
              component={Receive}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Receive'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="Settings"
              component={Settings}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="CreateNew"
              component={CreateNew}
              options={{
                title: 'Create New',
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Create New'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="ImportOld"
              component={ImportOld}
              options={{
                title: 'Import Old',
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Import Old'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="SelectWallet"
              component={SelectWallet}
              options={{
                title: 'Wallet List',
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Wallet List'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="EditWallet"
              component={EditWallet}
              options={{
                title: 'Wallet List',
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />

            <RootStack.Screen
              name="ScanQRCode"
              component={ScanQRCode}
              options={{
                title: 'Scan QR Code',
                header: () => null,
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}

const client = new ApolloClient({
  uri: 'https://devnet.suiet.app/query',
  cache: new InMemoryCache(),
});

function Root() {
  const [isFontsLoaded] = useFonts();
  const [isAndroidNavigationSet] = useSetAndroidNavigation();

  useEffect(() => {
    AsyncStorage.getAllKeys().then((keys) => {
      console.log('all keys', keys);
      for (const key of keys) {
        AsyncStorage.getItem(key).then((value) => {
          console.log(key, value);
        });
      }
    });
  }, []);

  if (!isFontsLoaded || !isAndroidNavigationSet) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate /* loading={<LoadingAvatars />} */ persistor={persistor}>
          <App />
          <Toast />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}

export default Root;
