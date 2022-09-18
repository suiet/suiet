import WalletSwitcher from '../../../components/WalletSwitcher';
import Avatar from '../../../components/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import Address from '../../../components/Address';
import Icon from '../../../components/Icon';
import { ReactComponent as IconArrowRight } from '../../../assets/icons/arrow-right.svg';
import Typo from '../../../components/Typo';
import styles from './index.module.scss';
import { Extendable } from '../../../types';
import classnames from 'classnames';

export type WalletSelectorProps = Extendable & {};

const WalletSelector = (props: WalletSelectorProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  return (
    <div>
      <div className={classnames(styles['wallet-item'], props.className)}>
        <Avatar model={wallet?.avatar} size={'sm'} />
        <Typo.Normal className={styles['wallet-item__name']}>
          {wallet?.name}
        </Typo.Normal>
        <Address
          value={wallet?.defaultAccount?.address ?? ''}
          hideCopy={true}
          className={styles['wallet-item__address']}
        />
        {/*<Icon*/}
        {/*  icon={<IconArrowRight />}*/}
        {/*  className={styles['wallet-item__arrow']}*/}
        {/*></Icon>*/}
      </div>
      {/*<WalletSwitcher wallets={[]} onSelect={} onEdit={} />*/}
    </div>
  );
};

export default WalletSelector;
