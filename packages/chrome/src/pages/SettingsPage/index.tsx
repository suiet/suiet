import styles from './index.module.scss';
import Wallet from './wallet';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Network from './network';
import Security from './security';
import { useDispatch, useSelector } from 'react-redux';
import { resetAppContext } from '../../store/app-context';
import { AppDispatch, RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import { coreApi } from '@suiet/core';
import { isDev } from '../../utils/env';
import Address from '../../components/Address';
import Avatar from '../../components/Avatar';
import classnames from 'classnames';
import manifest from '../../utils/manifest';

const SettingMain = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.appContext.token);
  const dispatch = useDispatch<AppDispatch>();
  const { context, wallet } = useSelector((state: RootState) => ({
    context: state.appContext,
    wallet: state.wallet,
  }));
  const { account } = useAccount(context.accountId);

  async function handleResetApp() {
    await coreApi.resetAppData(token);
    await dispatch(resetAppContext()).unwrap();
  }

  return (
    <div className={styles['container']}>
      <div className={'flex flex-col items-center'}>
        <Avatar size={'large'}></Avatar>
        <div className={classnames(styles['wallet-name'], 'mt-[8px]')}>
          {wallet.name}
        </div>
        <Address value={account.address} className={styles['address']} />
      </div>

      <section className={styles['settings-container']}>
        <div
          onClick={() => {
            navigate('wallet', {
              state: {
                hideApplayout: true,
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
                hideApplayout: true,
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
                hideApplayout: true,
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
          <div
            onClick={async () => await handleResetApp()}
            className={styles['settings-item']}
          >
            <span className={styles['icon-security']}></span>
            Reset App
          </div>
        )}
      </section>

      <div className={classnames(styles['app-version'], 'mt-[16px]')}>
        version v{manifest.version}
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
        <Route path="security" element={<Security />} />
      </Routes>
    </div>
  );
}

export default SettingPage;
