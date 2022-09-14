import styles from './index.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../../../components/Modal';
import WaterDropIcon from '../../../components/WaterDropIcon';
import Typo from '../../../components/Typo';
import QRCodeSVG from 'qrcode.react';
import classnames from 'classnames';
import { useAccount } from '../../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Address from '../../../components/Address';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import Skeleton from 'react-loading-skeleton';
import { useChromeStorage } from '../../../hooks/useChromeStorage';
import { StorageKeys } from '../../../store/enum';
import { formatCurrency } from '../../../utils/format';

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
    address ?? '',
    CoinSymbol.SUI,
    {
      networkId: networkId,
    }
  );
  const { data: showDevnetWarning, setItem: setShowDevnetWarning } =
    useChromeStorage<boolean>(StorageKeys.TIPS_DEVNET_WARNING);
  const navigate = useNavigate();

  return (
    <div className={styles['main-content']}>
      {showDevnetWarning === true ? (
        <div
          className={classnames(
            'py-3',
            'w-full',
            'bg-orange-400',
            'text-white',
            'text-center'
          )}
        >
          On devnet, your assets will be wiped periodically
          <br />
          <div className="flex m-auto items-center align-middle justify-center gap-2 mt-1">
            <button
              className="px-3 py-1 rounded-3xl bg-white text-orange-400"
              onClick={() => {
                setShowDevnetWarning(false);
              }}
            >
              Got it
            </button>{' '}
            <a
              href="https://suiet.app/docs/why-my-tokens-wiped-out-on-devnet"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Why?
            </a>
          </div>
        </div>
      ) : null}
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
        {/* <div
          className={classnames(styles['operations-item'], styles['airdrop'])}
          onClick={() => {
            navigate('/login');
          }}
        >
          Airdrop
        </div> */}
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
