import styles from './index.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAccount } from '../../hooks/useAccount';
import Address from '../../components/Address';
import Avatar from '../../components/Avatar';
import classnames from 'classnames';
import { useWallet } from '../../hooks/useWallet';
import { version } from '../../package-json';
import { useAuth } from '../../hooks/useAuth';
import AppLayout from '../../layouts/AppLayout';
import { Extendable } from '../../types';
import Icon from '../../components/Icon';
import { ReactComponent as IconReset } from '../../assets/icons/reset.svg';
import { ReactComponent as IconSecurity } from '../../assets/icons/security.svg';
import { ReactComponent as IconRightArrow } from '../../assets/icons/right-arrow.svg';
import { ReactComponent as IconWallet } from '../../assets/icons/wallet.svg';
import { ReactComponent as IconNetwork } from '../../assets/icons/net.svg';
import { ReactComponent as IconLock } from '../../assets/icons/lock.svg';
type SettingItemProps = Extendable & {
  icon: JSX.Element;
  hideArrow?: boolean;
  onClick?: () => void;
};

const SettingItem = (props: SettingItemProps) => {
  return (
    <div onClick={props.onClick} className={styles['settings-item']}>
      <Icon icon={props.icon} className={'mr-[16px]'} />
      {props.children}
      {!props.hideArrow && (
        <Icon
          icon={<IconRightArrow />}
          className={styles['icon-right-arrow']}
        />
      )}
    </div>
  );
};

const SettingPage = () => {
  const navigate = useNavigate();
  const { context } = useSelector((state: RootState) => ({
    context: state.appContext,
  }));
  const { data: wallet } = useWallet(context.walletId);
  const { data: account } = useAccount(context.accountId);
  const { logout } = useAuth();

  return (
    <AppLayout>
      <div className={styles['container']}>
        <div className={'flex flex-col items-center'}>
          <Avatar size={'lg'} model={wallet?.avatar}></Avatar>
          <div className={classnames(styles['wallet-name'], 'mt-[8px]')}>
            {wallet?.name}
          </div>
          <Address
            value={account?.address ?? ''}
            className={styles['address']}
          />
        </div>

        <section className={styles['settings-container']}>
          <SettingItem
            icon={<IconWallet />}
            onClick={() => {
              navigate('/settings/wallet');
            }}
          >
            Wallet
          </SettingItem>
          <SettingItem
            icon={<IconNetwork />}
            onClick={() => {
              navigate('/settings/network');
            }}
          >
            Network
          </SettingItem>
          <SettingItem
            icon={<IconSecurity />}
            onClick={() => {
              navigate('security');
            }}
          >
            Security
          </SettingItem>
          <SettingItem
            icon={<IconLock />}
            onClick={() => {
              logout();
            }}
            hideArrow={true}
          >
            Lock
          </SettingItem>
          <SettingItem
            icon={<IconReset />}
            onClick={() => {
              navigate('security/reset');
            }}
            hideArrow={true}
          >
            Reset All
          </SettingItem>
        </section>

        <div className={classnames(styles['app-version'], 'mt-[16px]')}>
          version v{version}
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingPage;
