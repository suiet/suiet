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
    const wallet = await coreApi.wallet.getWallet(walletId);
    if (wallet === null) {
      throw new Error('fetch wallet failed');
    }
    setWallet(wallet);
  }

  useEffect(() => {
    fetchWallet(walletId);
  }, [walletId]);

  return {
    wallet,
    fetchWallet,
  };
}
