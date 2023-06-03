import Avatar from '../../../components/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import Address from '../../../components/Address';
import Typo from '../../../components/Typo';
import styles from './index.module.scss';
import { Extendable } from '../../../types';
import classnames from 'classnames';
import { useMemo } from 'react';
import { isNonEmptyArray } from '../../../utils/check';
import { Wallet } from '@suiet/core';

export type WalletSelectorProps = Extendable & {};

const WalletSelector = (props: WalletSelectorProps) => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const defaultAccount = useMemo(() => {
    if (!isNonEmptyArray(wallet?.accounts)) return null;
    return (wallet as Wallet).accounts[0];
  }, [wallet]);
  return (
    <div>
      <div className={classnames(styles['wallet-item'], props.className)}>
        <Avatar model={wallet?.avatar} size={'sm'} pfp={wallet?.avatarPfp} />
        <Typo.Normal className={styles['wallet-item__name']}>
          {wallet?.name}
        </Typo.Normal>
        <Address
          value={defaultAccount?.address ?? ''}
          hideCopy={true}
          className={styles['wallet-item__address']}
        />
      </div>
    </div>
  );
};

export default WalletSelector;
