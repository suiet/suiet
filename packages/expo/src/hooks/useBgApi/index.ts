import { useNavigation } from '@react-navigation/native';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { DappBgApi, DappMessage } from './bgApi';
import { getSiteMetadata, saveSiteMetadata } from './metadata';
import { useNetwork } from '../useNetwork';
import { useWallets } from '../useWallets';
import { useKeychain } from '../useKeychain';

// export const ContextBgApi = createContext<DappBgApi>();

export function useBgApi() {
  const navigation = useNavigation();
  const { network, networkId } = useNetwork();
  const { selectedWallet } = useWallets();
  const { loadMnemonic } = useKeychain();
  const bgApi = useMemo(
    () =>
      new DappBgApi(navigation, network!, networkId!, selectedWallet!, async (a: string) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return await loadMnemonic(a);
      }),
    [navigation, networkId, selectedWallet]
  );
  const ref = useRef<WebView>(null);

  const onMessage: (event: WebViewMessageEvent) => void = useCallback(
    async (event) => {
      const { url } = event.nativeEvent;
      const { target, payload: trueData } = JSON.parse(event.nativeEvent.data);
      if (target !== 'SUIET_CONTENT') {
        return;
      }

      // save site metadata to avoid fetching it
      {
        if (trueData.funcName === 'dapp.saveSiteMetadata') {
          saveSiteMetadata(url, trueData.payload);
          return;
        }
      }

      const siteMetadata = await getSiteMetadata(url);
      const message = {
        id: trueData.id,
        funcName: trueData.funcName,
        payload: {
          params: trueData.payload,
          context: {
            origin: url,
            name: siteMetadata.name,
            favicon: siteMetadata.icon ?? '',
          },
        },
      };

      const { funcName, id, payload } = message;
      const [_, func] = funcName.split('.') as [string, keyof DappBgApi];

      try {
        const res = await bgApi[func](payload);
        ref.current?.injectJavaScript(`
          window.dispatchEvent(
            new MessageEvent('message', {
              source: window,
              data: {
                target: 'DAPP',
                payload: {
                  id: "${id}",
                  error: null,
                  data: ${JSON.stringify(res)},
                },
              },
            })
          );
        `);
      } catch (e) {
        ref.current?.injectJavaScript(`
          window.dispatchEvent(
            new MessageEvent('message', {
              source: window,
              data: {
                target: 'DAPP',
                payload: {
                  id: "${id}",
                  error: ${JSON.stringify(e)},
                  data: null,
                },
              },
            })
          );
        `);
      }
    },
    [bgApi, navigation, ref]
  );

  return {
    bgApi,

    webviewProps: {
      ref,
      onMessage,
    },
  };
}
