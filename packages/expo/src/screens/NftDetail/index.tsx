import * as React from 'react';
import { Image, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import type { RootStackParamList } from '@/../App';
import { Gray_100, Gray_500 } from '@/styles/colors';
import { SvgSend02 } from '@/components/icons/svgs';
import Typography from '@/components/Typography';
import { nftImgUrl } from '@/hooks/useNftList';
import { Address } from '@/components/Address';
import { Wallet } from '@/utils/wallet';
import { NamedCopiableMono } from '@/components/NamedCopiableMono';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { ViewInExplorer } from '@/components/ViewInExplorer';
import { useNetwork } from '@/hooks/useNetwork';

export const NftDetail: React.FC<StackScreenProps<RootStackParamList, 'NftDetail'>> = ({ navigation, route }) => {
  const { top, bottom } = useSafeAreaInsets();
  const { networkId } = useNetwork();
  const { nft } = route.params;

  return (
    <ScrollView style={{ backgroundColor: '#fff', paddingHorizontal: 24, paddingTop: 8 }} overScrollMode="never">
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexGrow: 1, aspectRatio: 1, backgroundColor: Gray_100, borderRadius: 16 }}>
            <Image source={{ uri: nftImgUrl(nft.url) }} />
          </View>
        </View>

        <View style={{ gap: 16 }}>
          <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexGrow: 1 }}>
              <Typography.Title children={nft.name} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Address wallet={{ address: nft.object.objectID } as Wallet} />
              </View>
            </View>
            <ButtonWithIcon
              iconSvg={SvgSend02}
              title={'Send'}
              onPress={async () => {
                const { default: Toast } = await import('react-native-toast-message');
                Toast.show({
                  type: 'info',
                  text1: 'This feature is WIP',
                  visibilityTime: 3000,
                });
              }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Typography.Subtitle style={{}} children={'Description'} />
            <Typography.Body style={{}} children={nft.description} color={Gray_500} />
          </View>

          <View style={{ gap: 8 }}>
            <Typography.Subtitle style={{}} children={'Object Detail'} />
            <NamedCopiableMono name="Type" text={nft.object.type} />
            <NamedCopiableMono name="Previous TX ID" text={nft.object.previousTransaction} />
          </View>

          <View />
          <ViewInExplorer
            link={
              `https://explorer.sui.io/objects/` + encodeURIComponent(nft.object.objectID) + `?network=${networkId}`
            }
          />
        </View>
      </View>
      <View style={{ height: bottom }} />
    </ScrollView>
  );
};
