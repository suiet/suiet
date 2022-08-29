import styles from './index.module.scss';
import AvatarDefault from '../../../assets/avatars/avatar_1.svg';
import IconArrowDown from '../../../assets/icons/arrow-down.svg';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { addressEllipsis } from '../../../utils/format';
import { useEffect, useState } from 'react';
import { avatarMap } from '../../../constants/avatar';
import { useWallet } from '../../../hooks/useWallet';

const Avatar = ({ avatar }: { avatar: string }) => {
  return (
    <div className={styles['avatar']}>
      {avatar && <img src={avatarMap[avatar]} alt="avatar" />}
    </div>
  );
};

function Header() {
  const context = useSelector((state: RootState) => state.appContext);
  const { account } = useAccount(context.wallId, context.accountId);
  const { wallet } = useWallet(context.walletId);

  return (
    <div className={styles['header-container']}>
      <Avatar avatar={wallet.avatar || '1'} />
      <div className={styles['account']}>
        <span className={styles['account-name']}>{account.name}</span>
        <img className="ml-[6px]" src={IconArrowDown} alt="arrow down" />
      </div>
      <div className={classnames(styles['address'], 'ml-[18px]')}>
        {addressEllipsis(account.address)}
      </div>
      <div className={styles['net']}>devnet</div>
    </div>
  );
}
export default Header;
