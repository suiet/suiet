import classnames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import styles from './network.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateNetworkId } from '../../store/app-context';
import message from '../../components/message';
import SettingTwoLayout from '../../layouts/SettingTwoLayout';
import Nav from '../../components/Nav';
import Typo from '../../components/Typo';
import { Icon } from '../../components/icons';

import { ReactComponent as IconCheck } from '../../assets/icons/check.svg';
import { ReactComponent as IconNotCheck } from '../../assets/icons/not-check.svg';
import { ReactComponent as IconDevnetSelected } from '../../assets/icons/devnet-selected.svg';
import { ReactComponent as IconDevnetUnselected } from '../../assets/icons/devnet-unselected.svg';
import { ReactComponent as IconTestnetSelected } from '../../assets/icons/testnet-selected.svg';
import { ReactComponent as IconTestnetUnselected } from '../../assets/icons/testnet-unselected.svg';
import { ReactComponent as IconMainnetSelected } from '../../assets/icons/mainnet-selected.svg';
import { ReactComponent as IconMainnetUnselected } from '../../assets/icons/mainnet-unselected.svg';
// import { ReactComponent as IconMainnet } from '../../assets/icons/mainnet.svg';
import { RootState } from '../../store';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { isNonEmptyArray } from '../../utils/check';
import { useApiClient } from '../../hooks/useApiClient';

const networks: Record<
  string,
  {
    name: string;
    icon: {
      selected: JSX.Element;
      unselected: JSX.Element;
    };
  }
> = {
  mainnet: {
    name: 'Mainnet',
    icon: {
      selected: <IconTestnetSelected />,
      unselected: <IconTestnetUnselected />,
    },
  },
  testnet: {
    name: 'Testnet',
    icon: {
      selected: <IconTestnetSelected />,
      unselected: <IconTestnetUnselected />,
    },
  },

  devnet: {
    name: 'Devnet',
    icon: {
      selected: <IconDevnetSelected />,
      unselected: <IconDevnetUnselected />,
    },
  },
};

function Network() {
  const { networkId } = useSelector((state: RootState) => state.appContext);
  const [network, setNetwork] = useState<string>(networkId);
  const featureFlags = useFeatureFlags();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const networkType = useMemo(() => {
    if (
      !featureFlags ||
      !featureFlags.networks ||
      !isNonEmptyArray(featureFlags.available_networks)
    ) {
      return ['devnet'];
    }
    const orderMap: Record<string, number> = {
      mainnet: 1,
      testnet: 2,
      devnet: 3,
    };

    // reorder network options
    return featureFlags.available_networks
      .map((networkName) => {
        return {
          order: orderMap[networkName] ?? 999,
          network: networkName,
        };
      })
      .sort((a, b) => a.order - b.order)
      .map((item) => item.network);
  }, [featureFlags]);

  const handleSave = useCallback(async () => {
    if (networkId === network) {
      setTimeout(() => {
        message.info(`You are in ${network}`);
      }, 0);
      navigate(-1);
      return;
    }

    await dispatch(updateNetworkId(network));
    // avoid toast flashing after navigation
    setTimeout(() => {
      message.success(`Switched to ${network}`);
    }, 0);
    navigate(-1);
  }, [network, networkId]);

  return (
    <SettingTwoLayout
      title={'Network'}
      desc={'Switch between different network.'}
      className={'min-h-[100vh]'}
    >
      <Nav
        position={'absolute'}
        onNavBack={() => {
          navigate(-1);
        }}
      />

      <section className={'mt-[36px]'}>
        {networkType.map((type) => {
          const active = network === type;
          const config = networks[type];

          return (
            <div
              key={type}
              className={classnames(styles['network-selection-container'], {
                [styles['active']]: active,
              })}
              onClick={() => {
                setNetwork(type);
              }}
            >
              <Icon
                icon={active ? config.icon.selected : config.icon.unselected}
                className={styles['network-selection-icon']}
              />
              <Typo.Normal className={styles['network-item-name']}>
                {config.name}
              </Typo.Normal>
              <Icon
                icon={active ? <IconCheck /> : <IconNotCheck />}
                className={styles['network-selection-check']}
              />
            </div>
          );
        })}
      </section>
      {/* not supported yet */}
      {/* <Typo.Normal className={styles['add-custom']}>
        + Add custom network
      </Typo.Normal> */}
      <Button state="primary" onClick={handleSave} className={'mt-auto'}>
        Save
      </Button>
    </SettingTwoLayout>
  );
}

export default Network;
