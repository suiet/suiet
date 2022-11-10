import { Account, GetAddressParams } from '@suiet/core';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { useApiClient } from './useApiClient';
import { useEffect, useState } from 'react';
import { OmitToken } from '../types';
import { BackgroundApiClient } from '../scripts/shared/ui-api-client';
import { isNonEmptyArray } from '../utils/check';

// memory cache variable, mapping accountId -> address
const _addressMemoryCache_ = new Map<string, string>();

export async function getAddress(
  apiClient: BackgroundApiClient,
  params: OmitToken<GetAddressParams>
): Promise<string | string[]> {
  // console.log('getAddress params', params);
  if (isNonEmptyArray(params.batchAccountIds)) {
    // batch mode
    const cachedResult: any[] = [];
    const needFetchIdMap: Map<string, { index: number; id: string }> =
      new Map();
    for (let i = 0; i < params.batchAccountIds.length; i++) {
      const accountId = params.batchAccountIds[i];
      const result = _addressMemoryCache_.get(accountId);
      cachedResult.push(result); // could be string or undefined
      // check how many uncached address for accountId
      if (!result) {
        needFetchIdMap.set(accountId, {
          index: i,
          id: accountId,
        });
      }
    }
    const needFetchIds = Array.from(needFetchIdMap.values()).map(
      (item) => item.id
    );
    // console.log('getAddress cachedResult', cachedResult);
    // console.log('getAddress needFetchIds', needFetchIds);
    if (!isNonEmptyArray(needFetchIds)) {
      // empty list, return all addresses from cache
      // console.log('getAddress all from cache', cachedResult);
      return cachedResult;
    }
    // otherwise, fetch uncached data, cached and return merged data
    const addresses = await apiClient.callFunc<
      OmitToken<GetAddressParams>,
      string[]
    >(
      'account.getAddress',
      {
        batchAccountIds: needFetchIds,
      },
      {
        withAuth: true,
      }
    );
    addresses.forEach((addr, i) => {
      const accountId = needFetchIds[i];
      // cache data
      _addressMemoryCache_.set(accountId, addr);
      // merge in cachedResult
      const index = (needFetchIdMap.get(accountId) as any).index;
      cachedResult.splice(index, 1, addr);
    });
    // console.log('getAddress cachedResult from merge', cachedResult);
    return cachedResult;
  }

  // single mode
  if (_addressMemoryCache_.has(params.accountId)) {
    // console.log(
    //   'getAddress all from cache',
    //   _addressMemoryCache_.get(params.accountId)
    // );
    return _addressMemoryCache_.get(params.accountId) as string;
  }
  const address = await apiClient.callFunc<OmitToken<GetAddressParams>, string>(
    'account.getAddress',
    {
      accountId: params.accountId,
    },
    {
      withAuth: true,
    }
  );
  // console.log('getAddress from api', address);
  // add in cache
  _addressMemoryCache_.set(params.accountId, address);
  return address;
}

export function useAccount(accountId: string) {
  const apiClient = useApiClient();
  const { data, error, mutate } = useSWR(
    ['account.getAccount', accountId],
    fetchAccount
  );
  const [address, setAddress] = useState<string>('');

  async function fetchAddressByAccountId(accountId: string) {
    try {
      const result = await getAddress(apiClient, { accountId });
      setAddress(result as string);
    } catch (e) {
      console.error(e);
      setAddress('');
    }
  }

  useEffect(() => {
    if (!data) return;
    fetchAddressByAccountId(data.id);
  }, [data]);

  async function fetchAccount(_: string, accountId: string) {
    if (!accountId) return;
    return await apiClient.callFunc<string, Account>(
      'account.getAccount',
      accountId
    );
  }

  return {
    data,
    address,
    error,
    loading: swrLoading(data, error),
    fetchAccount: mutate,
  };
}
