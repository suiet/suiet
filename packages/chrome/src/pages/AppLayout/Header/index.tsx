import styles from './index.module.scss';
import IconArrowDown from '../../../assets/icons/arrow-down.svg';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { addressEllipsis } from '../../../utils/format';
import React, { useEffect, useMemo, useState } from 'react';
import { avatarMap } from '../../../constants/avatar';
import WalletSwitcher, { WalletData } from '../../../components/WalletSwitcher';
import { useWallets } from '../../../hooks/useWallets';
import { Wallet } from '@suiet/core/dist/api/wallet';
import { coreApi } from '@suiet/core';
import { isNonEmptyArray } from '../../../utils/check';
import { Account } from '@suiet/core/dist/api/account';
import { useNavigate } from 'react-router-dom';
import {
  updateAccountId,
  updateWalletId,
} from '../../../store/app-context';
import {PageEntry} from "../../../hooks/usePageEntry";

const Avatar = ({ avatar }: { avatar: string }) => {
  return (
    <div className={styles['avatar']}>
      {avatar && <img src={avatarMap[avatar]} alt="avatar" />}
    </div>
  );
};

function useWalletAccountMap(wallets: Wallet[]) {
  const [walletAccountMap, setWalletAccountMap] = useState<
    Map<string, Account>
  >(new Map());

  async function searchDefaultAccount(walletId: string) {
    const accounts = await coreApi.account.getAccounts(walletId);
    if (!isNonEmptyArray(accounts)) {
      throw new Error('The account of the wallet is empty');
    }
    accounts.sort((a, b) => (a.address < b.address ? 0 : 1));
    return accounts[0];
  }

  // generate -defaultAccount Map
  useEffect(() => {
    (async function () {
      const map = new Map<string, Account>();
      const accounts = await Promise.all(
        wallets.map(async (wallet) => {
          return searchDefaultAccount(wallet.id);
        })
      );
      wallets.forEach((wallet, index) => {
        map.set(wallet.id, accounts[index]);
      });
      setWalletAccountMap(map);
    })();
  }, [wallets]);

  return walletAccountMap;
}

export type HeaderProps = {
  openSwitcher?: boolean;
}

const WalletSwitcherInstance = (props: {
  onSelect: (id: string, wallet: WalletData) => void;
  onClickLayer: () => void;
  onClickImport: () => void;
  onClickNew: () => void;
}) => {
  const { wallets } = useWallets();
  const walletAccountMap = useWalletAccountMap(wallets);
  const walletDataList = useMemo(() => {
    if (!isNonEmptyArray(wallets) || walletAccountMap.size === 0) return [];
    return wallets.map(walletDataAdapter);
  }, [wallets, walletAccountMap]);

  function walletDataAdapter(wallet: Wallet): WalletData {
    const account = walletAccountMap.get(wallet.id);
    return {
      id: wallet.id,
      name: wallet.name,
      avatar: wallet.avatar,
      accountId: account?.id || '',
      accountAddress: account?.address || '',
    };
  }

  return (
    <WalletSwitcher
      wallets={walletDataList}
      onSelect={props.onSelect}
      onClickLayer={props.onClickLayer}
      onClickNew={props.onClickNew}
      onClickImport={props.onClickImport}
    ></WalletSwitcher>
  );
};

function Header(props: HeaderProps) {
  const { openSwitcher = false } = props;
  const { context, wallet } = useSelector((state: RootState) => ({
    context: state.appContext,
    wallet: state.wallet,
  }));
  const [doSwitch, setDoSwitch] = useState<boolean>(openSwitcher);
  const navigate = useNavigate();
  const { account } = useAccount(context.accountId);
  const dispatch = useDispatch<AppDispatch>();

  async function switchWallet(id: string, data: WalletData) {
    await Promise.all([
      dispatch(updateWalletId(id)),
      dispatch(updateAccountId(data.accountId)),
    ]);
    setDoSwitch(false);
  }

  return (
    <div className={styles['header-container']}>
      <Avatar avatar={wallet.avatar || '1'} />
      <div
        className={styles['account']}
        onClick={() => {
          setDoSwitch(true);
        }}
      >
        <span className={styles['account-name']}>{account.name}</span>
        <img className="ml-[6px]" src={IconArrowDown} alt="arrow down" />
      </div>
      <div className={classnames(styles['address'], 'ml-[18px]')}>
        {addressEllipsis(account.address)}
      </div>
      <div className={styles['net']}>devnet</div>

      {doSwitch && <WalletSwitcherInstance
        onSelect={switchWallet}
        onClickLayer={() => {setDoSwitch(false)}}
        onClickNew={() => {navigate('/onboard/create-new-wallet', {
          state: { pageEntry: PageEntry.SWITCHER }
        })}}
        onClickImport={() => {navigate('/onboard/import-wallet', {
          state: { pageEntry: PageEntry.SWITCHER }
        })}}
      />}
    </div>
  );
}
export default Header;
