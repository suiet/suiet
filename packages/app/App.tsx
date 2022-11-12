import './shims';
import React, { useEffect, useState, type PropsWithChildren } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

import { AuthApi, WalletApi } from '@suiet/core';
import ReactNativeStorage from './src/storage';

const storage = new ReactNativeStorage();

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [password] = useState<string>('P@ssw0rd');
  const [token, setToken] = useState<string>();
  const [mnemonic, setMnemonic] = useState<string>();

  useEffect(() => {
    const execute = async () => {
      const authApi = new AuthApi(storage);
      const walletApi = new WalletApi(storage);

      const t = Date.now();

      await authApi.updatePassword({ oldPassword: password, newPassword: password });
      console.error('time to updatePassword', Date.now() - t);
      const token = await authApi.loadTokenWithPassword(password);
      console.error('time to loadTokenWithPassword', Date.now() - t);
      const wallet = await walletApi.createWallet({ token });
      console.error('time to createWallet', Date.now() - t);
      const mnemonic = await walletApi.revealMnemonic({ walletId: wallet.id, token });

      console.error('time to create a wallet: ', Date.now() - t);

      setToken(token);
      setMnemonic(mnemonic);
    };

    setInterval(() => {
      execute();
    }, 5000);
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          {/* <Section title="Password">
            <Text style={{ fontFamily: 'Menlo' }}>{password}</Text>
          </Section> */}
          <Section title="Token">
            <Text style={{ fontFamily: 'Menlo' }}>{token}</Text>
          </Section>
          <Section title="Mnemonic">Your mnemonic is shown below</Section>

          <View
            style={[
              styles.phrase,
              {
                marginHorizontal: 24,
                marginTop: 16,
                // borderRadius: 4,
                // borderWidth: 1,
                // borderColor: 'red',
                // borderStyle: 'solid',
              },
            ]}
          >
            <View style={styles.phraseWrap}>
              {mnemonic?.split(' ').map((word, index) => (
                <View key={index} style={styles.phraseItem}>
                  <Text style={styles.phraseOrder}>{index + 1}</Text>
                  <Text style={styles.phraseWord}>{word}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  phrase: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 8,
    backgroundColor: '#f9f9fb',
  },

  phraseWrap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  phraseItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 78,
    height: 36,
  },

  phraseOrder: {
    userSelect: 'none',
    textAlign: 'right',
    color: 'rgb(209,213,219)',
  },

  phraseWord: {
    fontFamily: 'Menlo',
    marginLeft: 8,
    color: '#344054',
  },
});

export default App;
