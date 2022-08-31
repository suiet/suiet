import { useEffect, useState } from 'react';
import { Wallet } from '@suiet/core/dist/api/wallet';
import { coreApi } from '@suiet/core';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  async function fetchWallets() {
    const wallets = await coreApi.wallet.getWallets();
    if (!wallets) {
      throw new Error('fetch wallets failed');
    }
    setWallets(wallets);
  }

  useEffect(() => {
    fetchWallets();
  }, []);

  return {
    wallets,
    fetchWallets,
  };
}
