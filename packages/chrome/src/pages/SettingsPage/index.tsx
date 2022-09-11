import styles from './index.module.scss';
import Wallet from './wallet';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Network from './network';
import Security from './security';
import { useDispatch, useSelector } from 'react-redux';
import { resetAppContext } from '../../store/app-context';
import { AppDispatch, RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { isDev } from '../../utils/env';
import Address from '../../components/Address';
import Avatar from '../../components/Avatar';
import classnames from 'classnames';
import { useWallet } from '../../hooks/useWallet';
import { version } from '../../package-json';
import { useApiClient } from '../../hooks/useApiClient';

const SettingMain = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.appContext.token);
  const dispatch = useDispatch<AppDispatch>();
  const { context } = useSelector((state: RootState) => ({
    context: state.appContext,
  }));
  const { data: wallet } = useWallet(context.walletId);
  const { data: account } = useAccount(context.accountId);
  const apiClient = useApiClient();

  // reset redux & db
  async function handleResetAppData() {
    await apiClient.callFunc<string, undefined>('root.resetAppData', token);
    await dispatch(resetAppContext()).unwrap();
  }

  // reset redux only
  async function handleResetAppContext() {
    await dispatch(resetAppContext()).unwrap();
  }

  return (
    <div className={styles['container']}>
      <div className={'flex flex-col items-center'}>
        <Avatar size={'lg'} model={wallet?.avatar}></Avatar>
        <div className={classnames(styles['wallet-name'], 'mt-[8px]')}>
          {wallet?.name}
        </div>
        <Address value={account?.address ?? ''} className={styles['address']} />
      </div>

      <section className={styles['settings-container']}>
        <div
          onClick={() => {
            navigate('wallet', {
              state: {
                hideAppLayout: true,
              },
            });
          }}
          className={styles['settings-item']}
        >
          <span className={styles['icon-wallet']}></span>Wallet
          <span className={styles['icon-right-arrow']} />
        </div>
        <div
          onClick={() => {
            navigate('network', {
              state: {
                hideAppLayout: true,
              },
            });
          }}
          className={styles['settings-item']}
        >
          <span className={styles['icon-network']}></span>Network
          <span className={styles['icon-right-arrow']} />
        </div>
        <div
          onClick={() => {
            navigate('security', {
              state: {
                hideAppLayout: true,
              },
            });
          }}
          className={styles['settings-item']}
        >
          <span className={styles['icon-security']}></span>Security
          <span className={styles['icon-right-arrow']} />
        </div>
        {/* dev use */}
        {isDev && (
          <>
            <div
              onClick={handleResetAppContext}
              className={styles['settings-item']}
            >
              <span className={styles['icon-security']}></span>
              Reset Context
            </div>
            <div
              onClick={handleResetAppData}
              className={styles['settings-item']}
            >
              <span className={styles['icon-security']}></span>
              Reset All
            </div>
          </>
        )}
      </section>

      <div className={classnames(styles['app-version'], 'mt-[16px]')}>
        version v{version}
      </div>
    </div>
  );
};

function SettingPage() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SettingMain />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="network" element={<Network />} />
        <Route path="security/*" element={<Security />} />
      </Routes>
    </div>
  );
}

export default SettingPage;
