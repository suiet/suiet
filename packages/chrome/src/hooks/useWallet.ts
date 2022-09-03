import { coreApi } from '@suiet/core';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useWallet(walletId: string) {
  const { data, error, mutate } = useSWR(['getWallet', walletId], fetchWallet);
  const token = useSelector((state: RootState) => state.appContext.token);

  async function fetchWallet(_: string, walletId: string) {
    const wallet = await coreApi.wallet.getWallet(walletId);
    if (wallet === null) {
      throw new Error('fetch wallet failed');
    }
    return wallet;
  }

  async function updateWallet(
    walletId: string,
    meta: { avatar: string; name: string }
  ) {
    await coreApi.wallet.updateWallet(
      walletId,
      {
        avatar: meta.avatar,
        name: meta.name,
      },
      token
    );
  }

  return {
    data,
    error,
    loading: !error && !data,
    mutate,
    updateWallet,
  };
}
