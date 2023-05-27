import styles from './index.module.scss';
import IconArrowRight from '../../../assets/icons/arrow-right.svg';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { getAddress, useAccount } from '../../../hooks/useAccount';
import { useEffect, useMemo, useRef, useState } from 'react';
import WalletSwitcher, { WalletData } from '../../../components/WalletSwitcher';
import { fetchWallets, useWallets } from '../../../hooks/useWallets';
import { isNonEmptyArray } from '../../../utils/check';
import { useNavigate } from 'react-router-dom';
import {
  resetAppContext,
  updateAccountId,
  updateWalletId,
} from '../../../store/app-context';
import { PageEntry } from '../../../hooks/usePageEntry';
import { Extendable, OmitToken } from '../../../types';
import Address from '../../../components/Address';
import Avatar from '../../../components/Avatar';
import { useWallet } from '../../../hooks/useWallet';
import { AccountInWallet, DeleteWalletParams, Wallet } from '@suiet/core';
import { useApiClient } from '../../../hooks/useApiClient';
import Message from '../../../components/message';
import { ActionConfirmModal } from '../../../components/modals';
import Typo from '../../../components/Typo';

function useWalletAccountMap(wallets: Wallet[]) {
  const apiClient = useApiClient();
  const [walletAccountMap, setWalletAccountMap] = useState<
    Map<string, AccountInWallet>
  >(new Map());

  function searchDefaultAccount(wallet: Wallet) {
    const sortedAccounts = [...wallet.accounts];
    sortedAccounts.sort((a, b) => (a.id < b.id ? 0 : 1));
    return sortedAccounts[0];
  }

  // generate defaultAccount map
  useEffect(() => {
    if (!isNonEmptyArray(wallets)) return;

    (async function () {
      const map = new Map<string, AccountInWallet>();
      const accounts = wallets.map((wallet) => searchDefaultAccount(wallet));
      // NOTE: use calculated addresses for safety concern
      const addresses = await getAddress(apiClient, {
        batchAccountIds: accounts.map((ac) => ac.id),
      });
      wallets.forEach((wallet, index) => {
        map.set(wallet.id, {
          id: accounts[index].id,
          address: addresses[index],
        });
      });
      setWalletAccountMap(map);
    })();
  }, [apiClient, wallets]);

  return walletAccountMap;
}

export type HeaderProps = Extendable & {
  openSwitcher?: boolean;
};

const WalletSwitcherInstance = (props: {
  onSelect: (id: string, wallet: WalletData) => void;
  onEdit: (id: string, wallet: WalletData) => void;
  onDelete: (id: string, wallet: WalletData) => void;
  onClickLayer: () => void;
  onClickImport: () => void;
  onClickNew: () => void;
}) => {
  const { data: wallets = [] } = useWallets();
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
      accountId: account?.id ?? '',
      accountAddress: account?.address ?? '',
    };
  }

  return (
    <WalletSwitcher
      wallets={walletDataList}
      onSelect={props.onSelect}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
      onClickLayer={props.onClickLayer}
      onClickNew={props.onClickNew}
      onClickImport={props.onClickImport}
    />
  );
};

function Header(props: HeaderProps) {
  const { openSwitcher = false } = props;
  const { context } = useSelector((state: RootState) => ({
    context: state.appContext,
  }));
  const [doSwitch, setDoSwitch] = useState<boolean>(openSwitcher);
  const navigate = useNavigate();
  const { address } = useAccount(context.accountId);
  const dispatch = useDispatch<AppDispatch>();
  const { data: wallet } = useWallet(context.walletId);
  const apiClient = useApiClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const walletToDelete = useRef<WalletData | null>(null);

  async function switchWallet(id: string, data: WalletData) {
    await Promise.all([
      dispatch(updateWalletId(id)),
      dispatch(updateAccountId(data.accountId)),
    ]);
    setDoSwitch(false);
    navigate('/');
  }

  async function editWallet(id: string, data: WalletData) {
    await Promise.all([
      dispatch(updateWalletId(id)),
      dispatch(updateAccountId(data.accountId)),
    ]);
    navigate('/settings/wallet', {
      state: {
        hideAppLayout: true,
      },
    });
  }

  async function removeWallet(id: string) {
    const wallets = await fetchWallets(apiClient);
    // delete current wallet
    const index = wallets.findIndex((w) => w.id === id);
    if (wallets.length === 1) {
      // call reset
      await apiClient.callFunc<null, undefined>('root.resetAppData', null);
      await dispatch(resetAppContext()).unwrap();
      Message.success('remove wallet successfully');
      return;
    }

    // active wallet becomes:
    //  if there is wallet next, then move to the next one
    //  else move to the previous wallet
    const nextWallet =
      index + 1 === wallets.length ? wallets[index - 1] : wallets[index + 1];

    await Promise.all([
      dispatch(updateWalletId(nextWallet.id)),
      dispatch(updateAccountId(nextWallet.accounts[0].id)),
    ]);

    // delete wallet
    try {
      await apiClient.callFunc<OmitToken<DeleteWalletParams>, undefined>(
        'wallet.deleteWallet',
        {
          walletId: id,
        },
        {
          withAuth: true,
        }
      );
      Message.success('remove wallet successfully');
    } catch {
      Message.error('remove wallet failed');
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  const handleDelete = (id: string, data: WalletData) => {
    console.log('delete wallet', id, data);
    walletToDelete.current = data;
    setShowDeleteConfirm(true);
  };

  return (
    <div className={classnames(styles['header-container'], props.className)}>
      <Avatar size={'sm'} model={wallet?.avatar} />
      <div
        className={styles['account']}
        onClick={() => {
          setDoSwitch(true);
        }}
      >
        <span className={styles['account-name']}>{wallet?.name}</span>
        <img className="ml-[6px]" src={IconArrowRight} alt="arrow right" />
      </div>
      <Address
        suins={true}
        value={address}
        hideCopy={true}
        className={classnames(styles['address'], 'ml-[18px]')}
      />
      <div
        className={classnames(
          styles['net'],
          styles['net-' + context.networkId]
        )}
        onClick={() => {
          navigate('/settings/network');
        }}
      >
        {context.networkId}
      </div>

      {doSwitch && (
        <WalletSwitcherInstance
          onSelect={switchWallet}
          onEdit={editWallet}
          onDelete={handleDelete}
          onClickLayer={() => {
            setDoSwitch(false);
          }}
          onClickNew={() => {
            navigate('/wallet/create', {
              state: { pageEntry: PageEntry.SWITCHER },
            });
          }}
          onClickImport={() => {
            navigate('/wallet/import', {
              state: { pageEntry: PageEntry.SWITCHER },
            });
          }}
        />
      )}

      {showDeleteConfirm && (
        <ActionConfirmModal
          open={showDeleteConfirm}
          title={'Remove Wallet'}
          desc={
            <>
              <Typo.Normal className="font-normal text-zinc-400">
                Ensure you&apos;ve backed up your mnemonic phrase for wallet
                restoration.
              </Typo.Normal>
              <Typo.Normal className={'my-2 font-normal text-zinc-400'}>
                Type wallet&apos;s name{' '}
                <p className="inline font-bold text-zinc-400">
                  {walletToDelete.current?.name ?? ''}
                </p>{' '}
                to confirm.
              </Typo.Normal>
            </>
          }
          confirmString={''}
          confirmText={'Remove'}
          onConfirm={async () => {
            if (!walletToDelete.current) return;
            await removeWallet(walletToDelete.current.id);
            navigate('/');
          }}
          onCancel={() => {
            setShowDeleteConfirm(false);
          }}
          className={'z-20'}
        />
      )}
    </div>
  );
}
export default Header;
