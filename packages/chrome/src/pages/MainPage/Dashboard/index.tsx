import styles from './index.module.scss';
import { Link } from 'react-router-dom';
import Modal from '../../../components/Modal';
import WaterDropIcon from '../../../components/WaterDropIcon';
import Typo from '../../../components/Typo';
import QRCodeSVG from 'qrcode.react';
import classnames from 'classnames';
import Address from '../../../components/Address';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import Skeleton from 'react-loading-skeleton';
import { formatCurrency } from '../../../utils/format';
import message from '../../../components/message';
import { useState } from 'react';
import { swrKeyWithNetwork, useNetwork } from '../../../hooks/useNetwork';
import { LoadingSpokes } from '../../../components/Loading';
import Banner from '../Banner';
import { swrKey as swrKeyForUseCoins } from '../../../hooks/useCoins';
import { useFeatureFlags } from '../../../hooks/useFeatureFlags';
export type ReceiveButtonProps = {
  address: string;
};

const ReceiveButton = (props: ReceiveButtonProps) => {
  return (
    <Modal
      title={
        <div className={'flex items-center'}>
          <span>Receive</span>
          <WaterDropIcon size={'small'} className={'ml-[8px]'} />
        </div>
      }
      trigger={
        <div
          className={classnames(
            styles['operations-item'],
            styles['receive'],
            'ml-[6px]'
          )}
        >
          {/* <img src={IconQrCode} className={styles['icon']} /> */}
          <span>Receive</span>
        </div>
      }
      contentProps={{
        onOpenAutoFocus: (e) => {
          e.preventDefault(); // prevent autofocus on the close btn
        },
      }}
    >
      <div className={'flex flex-col items-center mt-[22px]'}>
        <div className={'flex flex-col items-center'}>
          <QRCodeSVG value={props.address} className={styles['qr-code']} />
          <Typo.Normal className={classnames('mt-[2px]', styles['text-scan'])}>
            scan to receive
          </Typo.Normal>
        </div>
        <Address value={props.address} className={'mt-[21px]'} />
      </div>
    </Modal>
  );
};

export type DashboardProps = {
  address: string;
  networkId: string;
};

function MainPage({ address, networkId }: DashboardProps) {
  const { balance, loading: balanceLoading } = useCoinBalance(
    CoinSymbol.SUI,
    address ?? '',
    networkId
  );
  const { data: network } = useNetwork(networkId);
  const t = new Date();
  const [airdropTime, setAirdropTime] = useState(t.setTime(t.getTime() - 5000));
  const [airdropLoading, setAirdropLoading] = useState(false);
  const featureFlags = useFeatureFlags();
  const faucetApi = featureFlags?.networks
    ? featureFlags.networks[networkId]?.faucet_api
    : `https://faucet.${networkId}.sui.io/gas`;
  return (
    <div className={styles['main-content']}>
      <Banner />
      <div className={styles['balance']}>
        {balanceLoading ? (
          <Skeleton width={'140px'} height={'36px'} />
        ) : (
          formatCurrency(balance)
        )}
        <span className={styles['balance-unit']}>SUI</span>
      </div>
      <Address value={address} className={styles['address']} />
      <div className={styles['operations']}>
        <div
          className={classnames(styles['operations-item'], styles['airdrop'], {
            [styles['operations-item-loading']]: airdropLoading,
          })}
          onClick={() => {
            const d = new Date();
            if (!airdropLoading) {
              if (d.getTime() - airdropTime <= 5000) {
                message.error('Please wait 5 seconds');
              } else {
                const options = {
                  method: 'POST',
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify({
                    FixedAmountRequest: {
                      recipient: address,
                    },
                  }),
                };
                setAirdropLoading(true);
                fetch(faucetApi, options)
                  .then(async (response) => {
                    if (response.ok) {
                      message.success('Airdrop succeeded');
                      return await response.json();
                    } else {
                      const text = await response.text();
                      try {
                        const json = JSON.parse(text);
                        message.error(json.error);
                      } catch (e) {
                        if (text.includes('rate limited')) {
                          message.error(
                            'You have been rate limited, please try again 6 hours later'
                          );
                        } else {
                          message.error(
                            'Sui network is not available, please try again in a few hours'
                          );
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
                    message.error(err.message);
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
          }}
        >
          {airdropLoading ? (
            <div>
              <LoadingSpokes width={'12px'} height={'12px'} />
            </div>
          ) : (
            'Airdrop'
          )}
        </div>
        <ReceiveButton address={address} />
        <Link to={'/send'}>
          <div
            className={classnames(
              styles['operations-item'],
              styles['send'],
              'ml-[6px]'
            )}
          >
            Send
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
