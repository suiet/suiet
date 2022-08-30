import styles from './index.module.scss';
import AvatarDefault from '../../../assets/avatars/avatar_1.svg';
import IconArrowDown from '../../../assets/icons/arrow-down.svg';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { addressEllipsis } from '../../../utils/format';
import React, { useEffect, useState } from 'react';
import { avatarMap } from '../../../constants/avatar';
import { useWallet } from '../../../hooks/useWallet';
import WalletSwitcher from "../../../components/WalletSwitcher";
import {createPortal} from "react-dom";

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
  const [doSwitch, setDoSwitch] = useState<boolean>(false);

  return (
    <div className={styles['header-container']}>
      <Avatar avatar={wallet.avatar || '1'} />
      <div className={styles['account']} onClick={() => {setDoSwitch(true)}}>
        <span className={styles['account-name']}>{account.name}</span>
        <img className="ml-[6px]" src={IconArrowDown} alt="arrow down" />
      </div>
      <div className={classnames(styles['address'], 'ml-[18px]')}>
        {addressEllipsis(account.address)}
      </div>
      <div className={styles['net']}>devnet</div>

      {doSwitch && <WalletSwitcher
        onClickLayer={() => {setDoSwitch(false)}}
      ></WalletSwitcher>}
    </div>
  );
}
export default Header;
