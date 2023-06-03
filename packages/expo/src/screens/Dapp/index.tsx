import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Gray_100, Gray_400, Gray_900, White } from '@styles/colors';

import type { RootStackParamList } from '@/../App';
import { StackScreenProps } from '@react-navigation/stack';
import Typography from '@/components/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontFamilys } from '@/hooks/useFonts';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { upperFirst } from 'lodash-es';
import { useDappList } from '@/hooks/useDapps';
import { Badge } from '@/components/Badge';
import { LoadingDots } from '@/components/Loading';
import { DappItem } from '@/utils/api';
import { isNonEmptyArray } from '@suiet/core/src/utils';
import { Label } from '@/components/Label';
import { SvgRefreshCcw04 } from '@components/icons/svgs';
import { SvgUri, SvgXml } from 'react-native-svg';

const DappIcon: React.FC<{ icon: string }> = ({ icon }) => {
  if (icon.endsWith('.svg')) {
    return <SvgUri uri={icon} width={48} height={48} style={{ borderRadius: 9999 }} />;
  } else {
    return (
      <Image source={{ uri: icon }} style={{ width: 48, height: 48, borderRadius: 9999, backgroundColor: Gray_100 }} />
    );
  }
};

export const Dapp: React.FC<StackScreenProps<RootStackParamList, 'Dapp'>> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const { category, categoryKeys, featured, popular, error, isLoading, refetch } = useDappList();
  const [selected, setSelected] = useState<string>();
  const slides = useMemo(() => {
    const slides: Record<string, DappItem[]> = {};
    if (isNonEmptyArray(featured)) {
      slides['featured'] = featured;
    }
    if (isNonEmptyArray(popular)) {
      slides['popular'] = popular;
    }
    return slides;
  }, [featured, popular]);

  useEffect(() => {
    if (Object.keys(slides).length > 0) {
      setSelected(Object.keys(slides)[0]);
    }
  }, [slides]);

  const renderContent = () => {
    if (error) {
      return (
        <View style={{ paddingHorizontal: 24 }}>
          <Badge title="Failed to load D-Apps list" variant="error" />
        </View>
      );
    }

    if (isLoading) {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <LoadingDots />
        </View>
      );
    }

    if (isNonEmptyArray(categoryKeys) && isNonEmptyArray(featured) && isNonEmptyArray(popular)) {
    } else {
      return (
        <View style={{ paddingHorizontal: 24 }}>
          <Badge
            title="Failed to load D-Apps list"
            variant="warning"
            leftLabel={<View />}
            rightLabel={
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  refetch();
                }}
              >
                <Label title="Reload" variant="warning" rightIconSvg={SvgRefreshCcw04} />
              </TouchableOpacity>
            }
          />
        </View>
      );
    }

    // console.log();

    Array.from(category.entries()).map(([subtitle, dapps]) => {
      console.log(subtitle, dapps);
    });

    return (
      <ScrollView style={{ backgroundColor: '#FFF', flexGrow: 1, paddingTop: 8 }} overScrollMode="never">
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 24 }}>
            {Object.keys(slides).map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.6}
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
              overScrollMode="never"
              horizontal
              style={{ width: '100%', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 24, overflow: 'visible' }}
            >
              {selected &&
                slides[selected].map((dapp) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={dapp.id}
                    onPress={() => {
                      // Linking.openURL(dapp.link);
                      navigation.navigate('InAppBrowser', { url: dapp.link });
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
                      <DappIcon icon={dapp.icon} />
                      <View style={{ maxWidth: 150 }}>
                        <Typography.Subtitle children={dapp.name} color={White} />
                        <Typography.Body
                          children={dapp.description}
                          color={White}
                          style={{ opacity: 0.7, flexShrink: 1 }}
                          numberOfLines={2}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>

          {Array.from(category.entries()).map(([subtitle, dapps]) => (
            <View style={{ marginBottom: 24 }} key={subtitle}>
              <Typography.Subtitle children={subtitle} style={{ paddingHorizontal: 24 }} />
              {dapps.map((dapp) => (
                <TouchableHighlight
                  key={dapp.id}
                  onPress={() => {
                    // Linking.openURL(dapp.link);
                    navigation.navigate('InAppBrowser', { url: dapp.link });
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
                    <DappIcon icon={dapp.icon} />
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
    );
  };

  return (
    <View style={{ backgroundColor: '#FFF', paddingTop: top, paddingBottom: 50, flexGrow: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 8 }}>
        <Typography.Title children="D-App" />
      </View>
      {renderContent()}
    </View>
  );
};
