import { Account } from '@suiet/core';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';

export function useAccount(accountId: string) {
  const apiClient = useApiClient();
  const { data, error, mutate } = useSWR(
    ['account.getAccount', accountId],
    fetchAccount
  );

  async function fetchAccount(_: string, accountId: string) {
    if (!accountId) return;
    return await apiClient.callFunc<string, Account>(
      'account.getAccount',
      accountId
    );
  }

  return {
    data,
    error,
    loading: swrLoading(data, error),
    fetchAccount: mutate,
  };
}
