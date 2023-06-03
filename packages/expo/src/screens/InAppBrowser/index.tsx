import { Platform, TouchableHighlight, View } from 'react-native';
import React, { useState } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { SvgXml } from 'react-native-svg';
import { Gray_100, Gray_500, Gray_600, White } from '@styles/colors';
import { SvgArrowLeft } from '@components/icons/svgs';

import type { RootStackParamList } from '@/../App';

import { DAPP_API, DAPP_SITE_METADATA } from './constants';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '@/components/Typography';
import { useBgApi } from '@/hooks/useBgApi';

export const InAppBrowser: React.FC<StackScreenProps<RootStackParamList, 'InAppBrowser'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();

  const { webviewProps } = useBgApi();

  const [navState, setNavState] = useState<WebViewNavigation>();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, width: '100%', height: '100%', backgroundColor: White }}>
      <View style={{ height: top }} />
      <View>
        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: Gray_100,
          }}
        >
          <TouchableHighlight
            onPress={() => {
              navigation.goBack();
            }}
            style={{ borderRadius: 9999 }}
          >
            <View style={{ padding: 6, backgroundColor: Gray_100, borderRadius: 9999 }}>
              <SvgXml xml={SvgArrowLeft} width={20} height={20} color={Gray_500} />
            </View>
          </TouchableHighlight>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: White,

              borderWidth: 1,
              borderColor: Gray_100,
              flexGrow: 1,
              flexShrink: 1,
            }}
          >
            <Typography.Body
              children={navState?.url ?? route.params.url}
              color={Gray_500}
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            />
          </View>
        </View>
        {/* url */}
        <View></View>
        {/* close */}
      </View>
      <WebView
        key={route.params.url}
        injectedJavaScript={[DAPP_SITE_METADATA, DAPP_API].join(';')}
        originWhitelist={['*']}
        source={{ uri: route.params.url }}
        onNavigationStateChange={(navState) => {
          console.log('onNavigationStateChange', navState);
          setNavState(navState);
        }}
        {...webviewProps}
      />
      <View>
        <View></View>
        {/* goback */}
        <View></View>
        {/* goforward */}
        <View></View>
        {/* home */}
        <View></View>
        {/* all */}
        <View></View>
        {/* menu */}
      </View>
      {Platform.select({
        android: <View style={{ height: bottom, backgroundColor: Gray_100 }} />,
        ios: null,
      })}
    </View>
  );
};

// const a = {
//   target: 'SUIET_CONTENT',
//   payload: {
//     id: '97954e64-6868-40ad-a797-20a924756469',
//     funcName: 'dapp.signAndExecuteTransactionBlock',
//     payload: {
//       transactionBlock:
//         '{"version":1,"gasConfig":{},"inputs":[{"kind":"Input","value":4500000000,"index":0,"type":"pure"},{"kind":"Input","value":"0x4acf21aab452a13bfdaa40375cfe21bf523fbbc98eddc374d45a58acb68da5e8","index":1,"type":"pure"}],"transactions":[{"kind":"SplitCoins","coin":{"kind":"GasCoin"},"amounts":[{"kind":"Input","value":4500000000,"index":0,"type":"pure"}]},{"kind":"MoveCall","target":"0xfcb0c2f067d41f0d1da637fe929cfbb5435bf629a059a259c75e60c1ee550f0a::nft::mint","arguments":[{"kind":"Input","value":"0x4acf21aab452a13bfdaa40375cfe21bf523fbbc98eddc374d45a58acb68da5e8","index":1,"type":"pure"},{"kind":"NestedResult","index":0,"resultIndex":0}],"typeArguments":[]}]}',
//     },
//   },
// };
