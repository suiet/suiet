import styles from './index.module.scss';
import { Link } from 'react-router-dom';
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
        <div className={styles['receive']}>
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

function MainPage() {
  const context = useSelector((state: RootState) => state.appContext);
  const { account } = useAccount(context.accountId);
  const { balance, loading: balanceLoading } = useCoinBalance(
    account.address,
    CoinSymbol.SUI,
    {
      networkId: context.networkId,
    }
  );

  return (
    <div className={styles['main-content']}>
      <div className={styles['balance']}>
        {balanceLoading ? (
          <Skeleton width={'200px'} height={'36px'} />
        ) : (
          `${Intl.NumberFormat('en-US').format(Number(balance))} SUI`
        )}
      </div>
      <Address value={account.address} className={styles['address']} />
      <div className={styles['operations']}>
        <div className={styles['airdrop']} onClick={() => {}}>
          {/* <img src={IconDownDouble} className={styles['icon']} /> */}
          Airdrop
        </div>
        <ReceiveButton address={account.address} />
        <Link to={'/send'}>
          <div className={styles['send']}>
            {/* <img src={IconTrendUp} className={styles['icon']} /> */}
            Send
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MainPage;
