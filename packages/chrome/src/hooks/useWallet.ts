import { useEffect, useState } from 'react';
import { Wallet } from '@suiet/core/dist/api/wallet';
import { coreApi } from '@suiet/core';

export function useWallet(walletId: string) {
  const [wallet, setWallet] = useState<Wallet>({
    id: '',
    name: '',
    avatar: '',
    accounts: [],
    nextAccountId: 0,
  });

  async function fetchWallet(walletId: string) {
    const account = await coreApi.getWallet(walletId);
    console.log('fetchAccount', account);
    if (!account) {
      throw new Error('fetch account failed');
    }
    setWallet(account);
  }

  useEffect(() => {
    fetchWallet(walletId);
  }, [walletId]);

  return {
    wallet,
    fetchWallet,
  };
}
