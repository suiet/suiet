import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { SvgXml } from 'react-native-svg';
import { Gray_100, Gray_400, Gray_500, Gray_900, Primary_400, White_100 } from '@styles/colors';
import { SvgClockRewind, SvgCoins03, SvgGrid01 } from '@components/icons/svgs';

import { Coin } from '@/screens/Coin';
import type { RootStackParamList } from '@/../App';
import { StackScreenProps } from '@react-navigation/stack';
import Typography from '@/components/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamilys } from '@/hooks/useFonts';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { upperFirst } from 'lodash-es';
import { useDappList } from '@/hooks/useDapps';

export const Dapp: React.FC<StackScreenProps<RootStackParamList, 'Dapp'>> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();

  const [selected, setSelected] = useState('featured');

  const { category, categoryKeys, featured, popular } = useDappList();

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top, paddingBottom: 50, flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 8 }}>
        <Typography.Title children="D-App" />
      </View>
      <ScrollView style={{ backgroundColor: '#FFF', flexGrow: 1, paddingTop: 8 }}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 24 }}>
            {['featured', 'popular'].map((item, index) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setSelected(item);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  {selected === item && (
                    <View style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: '#0096FF' }} />
                  )}
                  <Typography.Label
                    children={upperFirst(item)}
                    style={[
                      selected === item
                        ? {
                            fontFamily: FontFamilys.WorkSans_700Bold,
                          }
                        : {
                            fontFamily: FontFamilys.WorkSans_500Medium,
                          },
                    ]}
                    color={selected === item ? Gray_900 : Gray_400}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <ScrollView
              horizontal
              style={{ width: '100%', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 24, overflow: 'visible' }}
            >
              {[...(selected === 'featured' ? featured : []), ...(selected === 'popular' ? popular : [])].map(
                (dapp) => (
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(dapp.link);
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 16,
                        backgroundColor: dapp.background_color,
                        padding: 24,
                        gap: 24,
                        flexDirection: 'column',

                        marginRight: 8,
                      }}
                    >
                      <Image style={{ width: 48, height: 48 }} source={{ uri: dapp.icon }} />
                      <View style={{ maxWidth: 150 }}>
                        <Typography.Subtitle children={dapp.name} color={White_100} />
                        <Typography.Body
                          children={dapp.description}
                          color={White_100}
                          style={{ opacity: 0.7, flexShrink: 1 }}
                          numberOfLines={2}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>

          {Array.from(category.entries()).map(([subtitle, dapps]) => (
            <View style={{ marginBottom: 24 }}>
              <Typography.Subtitle children={subtitle} style={{ paddingHorizontal: 24 }} />
              {dapps.map((dapp) => (
                <TouchableHighlight
                  key={dapp.id}
                  onPress={() => {
                    Linking.openURL(dapp.link);
                  }}
                  activeOpacity={0.9}
                  underlayColor={Gray_900}
                >
                  <View
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,

                      backgroundColor: 'white',
                    }}
                  >
                    <Image
                      style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: Gray_100 }}
                      source={{ uri: dapp.icon }}
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Typography.Label children={dapp.name} />
                      <Typography.Body children={dapp.description} color={Gray_400} />
                    </View>
                  </View>
                </TouchableHighlight>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
