import * as React from 'react';
import { Image, Animated, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, ScrollView } from 'react-native';

import type { RootStackParamList } from '@/../App';
import {
  Error_100,
  Error_500,
  Gray_100,
  Gray_300,
  Gray_400,
  Gray_500,
  Gray_900,
  Primary_100,
  Primary_400,
  Primary_500,
  White,
} from '@/styles/colors';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import {
  SvgActivity,
  SvgCheck,
  SvgCode01,
  SvgContainer,
  SvgDownload01,
  SvgMinus,
  SvgPlus,
} from '@/components/icons/svgs';
import { Swipeable } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useWallets } from '@/hooks/useWallets';
import { Wallet } from '@/utils/wallet';
import { addressEllipsis } from '@/utils/format';
import { AVATARS } from '@/utils/constants';
import Typography from '@/components/Typography';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { FeatureFlagNetwork, FeatureFlagRes } from '@/utils/api';
import { upperFirst } from 'lodash-es';
import { LoadingDots } from '@/components/Loading';
import { useNetwork } from '@/hooks/useNetwork';

const NetworkSelector: React.FC<{ featureFlags: FeatureFlagRes }> = ({ featureFlags }) => {
  const { available_networks, networks, default_network } = featureFlags;

  const { network: selectedNetwork, networkId: selectedNetworkId, updateNetworkId } = useNetwork();

  const renderNetworkIcon = (networkId: string, chosen: boolean) => {
    const colorFg = chosen ? Primary_500 : Gray_300;
    const colorBg = chosen ? Primary_100 : Gray_100;

    let xml: string | undefined = undefined;
    if (networkId === 'mainnet') {
      xml = SvgActivity;
    } else if (networkId === 'testnet') {
      xml = SvgContainer;
    } else if (networkId === 'devnet') {
      xml = SvgCode01;
    } else {
      xml = SvgCode01;
    }

    return (
      <View style={{ padding: 8, backgroundColor: colorBg, borderRadius: 9999 }}>
        <SvgXml style={{ width: 32, height: 32 }} color={colorFg} xml={xml} />
      </View>
    );
  };

  const renderItem = (networkId: string) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: Gray_100,
        borderRadius: 16,
        padding: 16,
        height: 72,
        backgroundColor: 'white',
      }}
    >
      <TouchableOpacity
        activeOpacity={networkId === selectedNetworkId ? 1 : 0.5}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          updateNetworkId(networkId);
        }}
      >
        {renderNetworkIcon(networkId, networkId === selectedNetworkId)}

        <View style={{ paddingLeft: 16 }}>
          <Typography.Subtitle color={Gray_900} children={upperFirst(networkId)} />
        </View>

        <View style={{ flex: 1 }} />
        {networkId === selectedNetworkId ? (
          <View style={{ padding: 2, backgroundColor: Primary_500, borderRadius: 9999 }}>
            <SvgXml width={14} height={14} color={White} xml={SvgCheck} />
          </View>
        ) : (
          <View
            style={{ padding: 8, backgroundColor: Gray_100, borderRadius: 9999, borderWidth: 1, borderColor: Gray_300 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {available_networks.map((networkId) => (
        <React.Fragment key={networkId}>
          {renderItem(networkId)}
          <View style={{ height: 16 }} />
        </React.Fragment>
      ))}
    </>
  );
};

export const SelectNetwork: React.FC<StackScreenProps<RootStackParamList, 'SelectNetwork'>> = ({}) => {
  const { top, bottom } = useSafeAreaInsets();

  const featureFlags = useFeatureFlags();

  return (
    <View style={{ flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
      <View style={{ paddingHorizontal: 24 }}>
        <View style={{ marginVertical: 24 }}>
          <Typography.Headline color="black" children="Network" />
          <View style={{ height: 8 }} />
          <Typography.Body color={Gray_400} children="Switch between different networks." />
        </View>

        {featureFlags ? (
          <NetworkSelector featureFlags={featureFlags} />
        ) : (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 24,
            }}
          >
            <LoadingDots />
          </View>
        )}
      </View>

      <View style={{ height: bottom }} />
    </View>
  );
};
