import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, TouchableHighlight, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import Toast, { ToastProps } from 'react-native-toast-message';
import { WebView } from 'react-native-webview';

import { SvgArrowLeft } from '@/components/icons/svgs';
import Typography from '@/components/Typography';
import { useKeychain } from '@/hooks/useKeychain';
import { useNetwork } from '@/hooks/useNetwork';
import { useWallets } from '@/hooks/useWallets';
import { DappRequest, PENDINGS } from '@/screens/DappApproval';
import { RequestConnect } from '@/screens/DappBrowser/components/RequestConnect';
import { DAPP_API, DAPP_SITE_METADATA } from '@/screens/DappBrowser/constants';
import { getSiteMetadata, saveSiteMetadata } from '@/screens/DappBrowser/metadata';
import {
  ExecuteTransactionRequestType,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
  TransactionBlock,
} from '@mysten/sui.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { Gray_100, Gray_500, White } from '@styles/colors';
import { Permission } from '@suiet/chrome-ext/src/scripts/background/permission';
import { DappMessage } from '@suiet/chrome-ext/src/scripts/background/types';
import { WindowMsgTarget } from '@suiet/chrome-ext/src/scripts/shared';
import { derivationHdPath } from '@suiet/core/src/crypto';
import { TxProvider } from '@suiet/core/src/provider';
import { Vault } from '@suiet/core/src/vault/Vault';

import type { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import type { RootStackParamList } from '@/../App';
import type { WindowMsg, WindowMsgReqData } from '@suiet/chrome-ext/src/scripts/shared';
import type { AccountInfo } from '@suiet/chrome-ext/src/scripts/background/types';
import type { IdentifierString, WalletAccount } from '@mysten/wallet-standard';

class DismissError extends Error {}

export const DappBrowser: React.FC<StackScreenProps<RootStackParamList, 'DappBrowser'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();

  const { network, networkId } = useNetwork();
  const { wallet, selectedWallet } = useWallets();
  const { loadMnemonic } = useKeychain();

  const request = useCallback(
    async function <T>(
      getRequest: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => DappRequest
    ) {
      const id = Math.random().toString(36).slice(2);
      try {
        return await new Promise<T>((resolve, reject) => {
          PENDINGS.set(id, getRequest(resolve, reject));
          navigation.navigate('DappApproval', { id, title: '' });
          const interval = setInterval(() => {
            if (navigation.isFocused()) {
              clearInterval(interval);
              reject(new DismissError());
            }
          }, 100);
        });
      } finally {
        PENDINGS.delete(id);
      }
    },
    [navigation]
  );

  const bgApi = useMemo(
    () =>
      // new DappBgApi(network!, networkId!, selectedWallet!, async (a: string) => {
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      //   return await loadMnemonic(a);
      // }),
      new (class DappBgApi {
        private txProvider;

        constructor() {
          this.txProvider = TxProvider.create(network!.full_node_url, network!.version_cache_timout_in_seconds);
        }

        private _getPermKey(p: string, payload: DappMessage<unknown>) {
          return `dappPermission::${p}::${selectedWallet!}::${networkId!}::${payload.context.origin}`;
        }

        private async _checkPerm(p: string, payload: DappMessage<unknown>) {
          const value = await AsyncStorage.getItem(this._getPermKey(p, payload));
          return value === 'true';
        }

        public async connect(
          payload: DappMessage<{
            permissions: string[];
          }>
        ): Promise<boolean> {
          if (!payload.context.origin) {
            throw new Error('No origin');
          }

          let missPermission = false;
          for (const p of payload.params.permissions) {
            try {
              if (await this._checkPerm(p, payload)) {
                continue;
              }
            } catch {}

            missPermission = true;
            break;
          }
          if (!missPermission) {
            // Toast.show({
            //   type: 'info',
            //   text1: `Already approved`,
            //   visibilityTime: 3000,
            // });

            return true;
          }

          try {
            return await request((resolve, reject) => {
              return {
                content: (
                  <RequestConnect
                    wallet={wallet!}
                    permissions={payload.params.permissions}
                    context={payload.context!}
                    onCancel={() => resolve(false)}
                    onConnect={async () => {
                      resolve(true);

                      try {
                        for (const p of payload.params.permissions)
                          await AsyncStorage.setItem(this._getPermKey(p, payload), 'true');
                      } catch {}
                    }}
                  />
                ),
              };
            });
          } catch (e) {
            if (e instanceof DismissError) {
              Toast.show({
                type: 'error',
                text1: `Request dismissed`,
                visibilityTime: 3000,
                props: {
                  icon: require('@assets/red_exclamation_mark.png'),
                } as ToastProps,
              });

              return false;
            } else {
              throw e;
            }
          }
        }

        public async getAccountsInfo(payload: DappMessage<{}>): Promise<AccountInfo[]> {
          if (await this._checkPerm(Permission.VIEW_ACCOUNT, payload)) {
            return [
              {
                address: selectedWallet!,
                publicKey: '',
              },
            ];
          }

          throw new Error('Permission denied');
        }

        public async getActiveNetwork(payload: DappMessage<{}>): Promise<string> {
          if (await this._checkPerm(Permission.VIEW_ACCOUNT, payload)) {
            return networkId!;
          }

          throw new Error('Permission denied');
        }

        public async signAndExecuteTransactionBlock(
          payload: DappMessage<{
            transactionBlock: string;
            account: WalletAccount;
            chain: IdentifierString;
            requestType?: ExecuteTransactionRequestType;
            options?: SuiTransactionBlockResponseOptions;
          }>
        ): Promise<SuiTransactionBlockResponse> {
          return await this.txProvider.signAndExecuteTransactionBlock(
            TransactionBlock.from(payload.params.transactionBlock),
            await Vault.fromMnemonic(derivationHdPath(0), await loadMnemonic(selectedWallet!)),
            payload.params.requestType,
            payload.params.options
          );
        }
      })(),

    [navigation, network, networkId, selectedWallet]
  );

  const ref = useRef<WebView>(null);

  const onMessage: (event: WebViewMessageEvent) => void = useCallback(
    async (event) => {
      const { url } = event.nativeEvent;
      const { target, payload: trueData } = JSON.parse(event.nativeEvent.data) as WindowMsg<WindowMsgReqData>;
      if (target !== WindowMsgTarget.SUIET_CONTENT) {
        return;
      }

      // save site metadata to avoid fetching it
      {
        if (trueData.funcName === 'dapp.saveSiteMetadata') {
          saveSiteMetadata(url, trueData.payload.metadata);
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
            origin: siteMetadata.origin,
            name: siteMetadata.name,
            favicon: siteMetadata.icon ?? '',
          },
        },
      };

      const { funcName, id, payload } = message;
      const [_, func] = funcName.split('.') as [string, keyof typeof bgApi];

      try {
        const res = await bgApi[func](payload);
        ref.current?.injectJavaScript(`
          window.dispatchEvent(
            new MessageEvent('message', {
              source: window,
              origin: window.origin,
              data: {
                target: '${WindowMsgTarget.DAPP}',
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
              origin: window.origin,
              data: {
                target: '${WindowMsgTarget.DAPP}',
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
    [bgApi, navigation, ref.current]
  );

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
        ref={ref}
        onMessage={onMessage}
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
