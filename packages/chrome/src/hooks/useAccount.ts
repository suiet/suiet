import { useEffect, useState } from 'react';
import { Account } from '@suiet/core/dist/api/account';
import { coreApi } from '@suiet/core';

export function useAccount(accountId: string) {
  const [account, setAccount] = useState<Account>({
    id: '',
    name: '',
    address: '',
    hdPath: '',
    pubkey: '',
  });

  async function fetchAccount(accountId: string) {
    if (!accountId) return;
    console.log('accountId', accountId);

    const account = await coreApi.account.getAccount(accountId);
    if (!account) {
      throw new Error('fetch account failed');
    }
    setAccount(account);
  }

  useEffect(() => {
    fetchAccount(accountId);
  }, [accountId]);

  return {
    account,
    fetchAccount,
  };
}
