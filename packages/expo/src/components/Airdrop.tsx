import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { Gray_100, Gray_500, Primary_400 } from '@/styles/colors';
import { SvgCoins03 } from './icons/svgs';
import Typography from '@/components/Typography';
import { ToastProps } from './Toast';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { FAB } from './FAB';
import { useNetwork } from '@/hooks/useNetwork';

export const Airdrop: React.FC<{ recipient: string }> = ({ recipient }) => {
  const featureFlags = useFeatureFlags();
  const { network, networkId } = useNetwork(featureFlags);
  const faucetApi = network?.faucet_api;

  const t = new Date();
  const [airdropTime, setAirdropTime] = useState(t.setTime(t.getTime() - 5000));
  const [airdropLoading, setAirdropLoading] = useState(false);

  const handlePress = async () => {
    if (!featureFlags) {
      Toast.show({
        type: 'info',
        text1: `Still loading...`,
        visibilityTime: 6000,
      });
      return;
    }

    if (!faucetApi) {
      Toast.show({
        type: 'error',
        text1: `Failed to get faucet: Unknown error`,
        visibilityTime: 6000,
        props: {
          icon: require('@assets/red_exclamation_mark.png'),
        } as ToastProps,
      });
      return;
    }

    const d = new Date();

    if (!airdropLoading) {
      if (d.getTime() - airdropTime <= 5000) {
        // message.error('Please wait 5 seconds');
        Toast.show({
          type: 'error',
          text1: `Please wait 5 seconds`,
          visibilityTime: 6000,
          props: {
            icon: require('@assets/red_exclamation_mark.png'),
          } as ToastProps,
        });
      } else {
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            FixedAmountRequest: {
              recipient,
            },
          }),
        };
        setAirdropLoading(true);
        fetch(faucetApi, options)
          .then(async (response) => {
            if (response.ok) {
              // message.success('Airdrop succeeded');
              Toast.show({
                type: 'success',
                text1: 'Faucet succeeded!',
                visibilityTime: 6000,
                props: {
                  beautifulBorder: true,
                  icon: require('@assets/grinning_face.png'),
                } as ToastProps,
              });
              return await response.json();
            } else {
              const text = await response.text();
              try {
                const json = JSON.parse(text);
                // message.error(json.error);
                Toast.show({
                  type: 'error',
                  text1: `Failed to get faucet: ${json.error}`,
                  visibilityTime: 6000,
                  props: {
                    icon: require('@assets/red_exclamation_mark.png'),
                  } as ToastProps,
                });
              } catch (e) {
                console.log(e);
                if (text.includes('rate limited')) {
                  // message.error('You have been rate limited, please try again 6 hours later');
                  Toast.show({
                    type: 'error',
                    text1: `Rate limited exceeded.`,
                    visibilityTime: 6000,
                    props: {
                      icon: require('@assets/red_exclamation_mark.png'),
                    } as ToastProps,
                  });
                } else {
                  // message.error('Sui network is not available, please try again in a few hours');
                  Toast.show({
                    type: 'error',
                    text1: `Failed to get faucet: Unknown error`,
                    visibilityTime: 6000,
                    props: {
                      icon: require('@assets/red_exclamation_mark.png'),
                    } as ToastProps,
                  });
                }
              }
            }
          })
          // .then((response) => {
          //   console.log('response:', response);
          //   if (response) {
          //     message.error(response.error);
          //   } else {
          //     message.success('Airdrop succeeded');
          //   }
          // })
          .catch((err) => {
            console.log('error:', err);
            // message.error(err.message);
            Toast.show({
              type: 'error',
              text1: `Failed to Faucet: Unknown error`,
              visibilityTime: 6000,
              props: {
                icon: require('@assets/red_exclamation_mark.png'),
              } as ToastProps,
            });
          })
          .finally(() => {
            // TODO: global refetch for coin
            // setTimeout(() => {
            //   mutate(swrKeyWithNetwork(swrKeyForUseCoins, network));
            // }, 1000);
            setAirdropTime(d.getTime());
            setAirdropLoading(false);
          });
      }
    }
  };

  const handlePressFake = () => {
    setAirdropLoading(true);
    setTimeout(() => {
      setAirdropLoading(false);
    }, 3000);
  };

  return (
    <View style={{ marginRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {airdropLoading ? (
        <View
          style={{
            width: 52,
            height: 52,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Gray_100,
            borderRadius: 9999,
          }}
        >
          <ActivityIndicator size={'small'} color={Primary_400} />
        </View>
      ) : (
        <FAB svg={SvgCoins03} onPress={handlePress} />
      )}
      <Typography.Comment children={'Faucet'} color={Gray_500} />
    </View>
  );
};
