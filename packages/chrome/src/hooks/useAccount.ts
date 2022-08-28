import {useEffect, useState} from "react";
import {Account} from "@suiet/core/dist/api/account";
import {coreApi} from "@suiet/core";

export function useAccount(walletId: string, accountId: string) {
  const [account, setAccount] = useState<Account>({
    id: "",
    name: "",
    address: "",
    hdPath: "",
    pubkey: ""
  });

  async function fetchAccount(walletId: string, accountId: string) {
    const account = await coreApi.getAccount(walletId, accountId);
    console.log('fetchAccount', account)
    if (!account) {
      throw new Error('fetch account failed');
    }
    setAccount(account);
  }

  useEffect(() => {
    fetchAccount(walletId, accountId);
  }, [walletId, accountId]);

  return {
    account,
    fetchAccount,
  }
}