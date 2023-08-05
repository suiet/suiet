import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AngularGradientToast } from '@/components/Toast';
import { useFonts } from '@/hooks/useFonts';
import { useNetwork } from '@/hooks/useNetwork';
import { NftGqlDto } from '@/hooks/useNftList';
import { useSetAndroidNavigation } from '@/hooks/useSetAndroidNavigation';
import { TransactionForHistory } from '@/hooks/useTransactionListForHistory';
import { useWallets } from '@/hooks/useWallets';
import { BackupAndDone } from '@/screens/BackupAndDone';
import { Header } from '@/screens/Coin/components/Header';
import { Send } from '@/screens/Coin/components/Send';
import { Settings } from '@/screens/Coin/components/Settings';
import { CreateNew } from '@/screens/CreateNew';
import { DappApproval } from '@/screens/DappApproval';
import { DappBrowser } from '@/screens/DappBrowser';
import { EditWallet } from '@/screens/EditWallet';
import { Home } from '@/screens/Home';
import { ImportOld } from '@/screens/ImportOld';
import { NftDetail } from '@/screens/NftDetail';
import { Receive } from '@/screens/Receive';
import { ScanQRCode } from '@/screens/ScanQRCode';
import { Security } from '@/screens/Security';
import { SecurityShow } from '@/screens/Security/SecurityShow';
import { SecurityWarning } from '@/screens/Security/SecurityWarning';
import { SelectNetwork } from '@/screens/SelectNetwork';
import { SelectToken } from '@/screens/SelectToken';
import { SelectWallet } from '@/screens/SelectWallet';
import { Swap } from '@/screens/Swap';
import { TxDetail } from '@/screens/TxDetail';
import { Welcome } from '@/screens/Welcome';
import { persistor, store } from '@/store';
import { ApolloProvider } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useCustomApolloClient } from '@suiet/chrome-ext/src/hooks/useCustomApolloClient';

import type { WebStorage } from '@suiet/chrome-ext/src/store/storage';
import { useAutoLoadFeatureFlags } from '@suiet/chrome-ext/src/hooks/useFeatureFlags';

// SplashScreen.preventAutoHideAsync();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList {
      DappConnect: undefined;
    }
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  CreateNew: undefined;
  ImportOld: undefined;
  BackupAndDone: {
    mnemonic: string;
    address: string;
  };
  Coin: undefined;
  Nft: undefined;
  NftDetail: { nft: NftGqlDto };
  TxHistory: undefined;
  TxDetail: { tx: TransactionForHistory };

  Dapp: undefined;
  DappBrowser: { url: string };
  DappApproval: { id: string; title: string };

  ScanQRCode: undefined;
  SelectWallet: undefined;

  SelectNetwork: undefined;

  Home: undefined;

  Send: undefined;
  Receive: undefined;
  Swap: undefined;
  SelectToken: undefined;
  Settings: undefined;
  EditWallet: undefined;

  Security: undefined;
  SecurityWarning: { next: 'Phrase' | 'PrivateKey' };
  SecurityShow: { next: 'Phrase' | 'PrivateKey'; content: string };
};

const RootStack = createStackNavigator<RootStackParamList>();

function App() {
  const { isLoading: isWalletsLoading, isEmpty: isWalletsEmpty /* loadWallets */, wallets } = useWallets();

  const featureFlags = useAutoLoadFeatureFlags();
  const { network, networkId } = useNetwork(featureFlags);
  // const network = featureFlags?.networks?.[featureFlags.default_network];

  console.log(network, networkId, featureFlags?.networks);
  const client = useCustomApolloClient(networkId!, 'suiet-app', '1.0.0', AsyncStorage as WebStorage);

  // this is added to avoid an selected network deleted from feature flags
  {
    const { networkId, updateNetworkId } = useNetwork();
    useEffect(() => {
      if (networkId && featureFlags && !featureFlags.available_networks.includes(networkId)) {
        updateNetworkId(featureFlags.default_network);
      }
    }, [featureFlags, networkId, updateNetworkId]);
  }

  if (!client) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <StatusBar style="dark" translucent={true} />
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={isWalletsEmpty ? 'Welcome' : 'Home'}>
          <RootStack.Group>
            <RootStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <RootStack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <RootStack.Screen name="BackupAndDone" component={BackupAndDone} options={{ headerShown: false }} />
            <RootStack.Screen name="DappBrowser" component={DappBrowser} options={{ headerShown: false }} />
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
              options={{
                header: () => null,
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
              name="Swap"
              component={Swap}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Swap'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="SelectToken"
              component={SelectToken}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Select Token'} onRightAction={() => navigation.goBack()} />
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
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Create New'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="ImportOld"
              component={ImportOld}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Import Old'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="SelectWallet"
              component={SelectWallet}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'Wallet List'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="EditWallet"
              component={EditWallet}
              options={{
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

            <RootStack.Screen
              name="SelectNetwork"
              component={SelectNetwork}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />

            <RootStack.Screen
              name="TxDetail"
              component={TxDetail}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />

            <RootStack.Screen
              name="NftDetail"
              component={NftDetail}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={'NFT Detail'} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />

            <RootStack.Screen
              name="Security"
              component={Security}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="SecurityWarning"
              component={SecurityWarning}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
            <RootStack.Screen
              name="SecurityShow"
              component={SecurityShow}
              options={{
                header: ({ navigation, route: { name } }) => (
                  <Header title={''} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />

            <RootStack.Screen
              name="DappApproval"
              component={DappApproval}
              options={{
                header: ({ navigation, route: { name, params } }) => (
                  // @ts-ignore
                  <Header title={params.title} onRightAction={() => navigation.goBack()} />
                ),
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

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
    <QueryClientProvider client={new QueryClient()}>
      <Provider store={store}>
        <PersistGate /* loading={<LoadingAvatars />} */ persistor={persistor}>
          <App />
          <Toast
            topOffset={60}
            config={{
              success: ({ text1, isVisible, props }) => (
                <AngularGradientToast key={text1!} isVisible={isVisible} text={text1!} {...props} />
              ),
              info: ({ text1, isVisible, props }) => (
                <AngularGradientToast key={text1!} isVisible={isVisible} text={text1!} {...props} />
              ),
              error: ({ text1, isVisible, props }) => (
                <AngularGradientToast key={text1!} isVisible={isVisible} text={text1!} {...props} />
              ),
            }}
          />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

export default Root;
