import { View, ColorValue, ViewProps, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as React from 'react';
import Toast, { ToastProps } from 'react-native-toast-message';
import { getExecutionStatusType, getExecutionStatusError } from '@mysten/sui.js';

import { Gray_200, Gray_300, Gray_50, Gray_700, Gray_900, Primary_400, Secondary_50 } from '@styles/colors';
import { CoinIcon } from '@components/CoinIcon';
import { formatCurrency } from '@/utils/format';
import { useQuery } from '@apollo/client';
import { Coin, GET_COINS } from '@/utils/gql';
import { LoadingDots } from '@/components/Loading';
import Typography from '@/components/Typography';
import { Badge } from '@/components/Badge';
import { useCallback, useEffect, useMemo } from 'react';
import { NftGqlDto, nftImgUrl, useNftList } from '@/hooks/useNftList';
import { AVATARS } from '@/utils/constants';
import { Label } from '@/components/Label';
import { SvgGift01, SvgGift02, SvgLinkExternal01 } from '@/components/icons/svgs';

import getMintExampleNftTxBlock from '@suiet/core/src/libs/tx-block/getMintExampleNftTxBlock';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useNetwork } from '@/hooks/useNetwork';
import { useWallets } from '@/hooks/useWallets';
import { Provider, TxProvider } from '@suiet/core/src/provider';
import { useKeychain } from '@/hooks/useKeychain';
import { Vault } from '@suiet/core/src/vault/Vault';
import { derivationHdPath } from '@suiet/core/src/crypto';

const ListItem: React.FC<{ nft: NftGqlDto }> = ({ nft }) => {
  return (
    <View style={{ borderRadius: 12, borderWidth: 1, borderColor: Gray_200, padding: 8, gap: 8 }}>
      <View
        style={{
          flexGrow: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {/* <Image style={{  marginRight: 4 }} source={{ uri: nftImgUrl(nft.url) }} /> */}

        <View style={{ flexGrow: 1, aspectRatio: 1, borderRadius: 8, backgroundColor: Gray_50 }}>
          <Image
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            // source={{ uri: 'https://framerusercontent.com/images/eDZRos3xvCrlWxmLFr72sFtiyQ.png?scale-down-to=512' }}
            // source={{ uri: 'https://framerusercontent.com/images/fk4ubHOF3iSqtcJQOd0CuU1v8.jpg' }}
            source={{ uri: nftImgUrl(nft.url) }}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 4 }}>
        <Typography.LabelS children={nft.name} color={Gray_700} numberOfLines={1} />
        <Typography.Comment children={nft.description} color={Gray_300} numberOfLines={1} />
      </View>
    </View>
  );
};

export const MintNft: React.FC = () => {
  const { network, networkId } = useNetwork();
  const { selectedWallet } = useWallets();
  const { loadMnemonic } = useKeychain();

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const txProvider = useMemo(() => {
    if (!network) {
      return;
    }
    return TxProvider.create(network?.full_node_url, network?.version_cache_timout_in_seconds);
  }, []);

  const handleMint = async () => {
    if (!network) {
      return;
    }

    if (!txProvider) {
      return;
    }

    if (!selectedWallet) {
      return;
    }

    setButtonDisabled(true);
    // FIXME(hzy): wait for animation
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const mnemonic = await loadMnemonic(selectedWallet);

      setButtonLoading(true);
      // FIXME(hzy): wait for animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // if (balanceLoading || Number(balance) < 6 * 10 ** 8) {
      //   Message.error('Please ensure you have more than 0.6 SUI to mint');
      //   return;
      // }

      const res = await txProvider?.signAndExecuteTransactionBlock(
        getMintExampleNftTxBlock(network.sample_nft_object_id),
        await Vault.fromMnemonic(derivationHdPath(0), mnemonic)
      );

      const statusType = getExecutionStatusType(res);
      const statusError = getExecutionStatusError(res);

      if (statusType === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Mint successfully!',
          visibilityTime: 6000,
          props: {
            beautifulBorder: true,
            icon: require('@assets/grinning_face.png'),
          } as ToastProps,
        });
        return;
      }

      if (statusType === 'failure') {
        if (typeof statusError === 'string') {
          Toast.show({
            type: 'error',
            text1: `Failed to mint: ${statusError}`,
            visibilityTime: 6000,
            props: {
              icon: require('@assets/red_exclamation_mark.png'),
            } as ToastProps,
          });
          return;
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setButtonDisabled(false);
      setButtonLoading(false);
    }

    Toast.show({
      type: 'error',
      text1: 'Unknown error',
      visibilityTime: 6000,
      props: {
        icon: require('@assets/red_exclamation_mark.png'),
      } as ToastProps,
    });
  };

  return (
    <Badge
      variant="info"
      title={`You have no NFTs`}
      leftLabel={<View style={{ width: 0 }} />}
      rightLabel={
        buttonLoading ? (
          <ActivityIndicator size={'small'} color={Primary_400} />
        ) : (
          <TouchableOpacity onPress={handleMint} disabled={buttonDisabled}>
            <Label variant="info" title="Mint a NFT" rightIconSvg={SvgGift02} />
          </TouchableOpacity>
        )
      }
    />
  );
};

export const Nfts: React.FC<{ address: string; onChoose?: (coin: NftGqlDto) => void }> = ({ address, onChoose }) => {
  const { loading, error, data } = useNftList(address, { pollInterval: 5000 });

  if (loading) {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 24,
        }}
      >
        <LoadingDots />
      </View>
    );
  }

  if (error) {
    return <Badge title="Failed to load NFTs" variant="error" />;
  }

  if (!data || data.length === 0) {
    return <MintNft />;
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginRight: -8, rowGap: 8 }}>
      {data.map((item, i) => {
        const listItem = <ListItem nft={item} />;
        if (typeof onChoose === 'function') {
          return (
            <TouchableOpacity
              style={[
                {
                  width: '50%',
                  paddingRight: 8,
                },
              ]}
              key={i}
              onPress={() => onChoose(item)}
            >
              {listItem}
            </TouchableOpacity>
          );
        } else {
          return (
            <View
              style={[
                {
                  width: '50%',
                  paddingRight: 8,
                },
              ]}
              key={i}
            >
              {listItem}
            </View>
          );
        }
      })}
    </View>
  );
};
