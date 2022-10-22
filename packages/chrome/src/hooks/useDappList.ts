import { useMemo } from 'react';
import { DappItem, getDappList } from '../api/dapps';
import useSWR from 'swr';
import { swrLoading } from '../utils/others';
import { isNonEmptyArray } from '../utils/check';

export function useDappList() {
  const { data: resData, error } = useSWR(['fetchDappList'], fetchDappList);

  const category: Map<string, DappItem[]> = useMemo(() => {
    if (!resData) return new Map();
    return new Map(Array.from(Object.entries(resData.category)));
  }, [resData]);

  const categoryKeys = useMemo(() => {
    if (
      !resData ||
      !resData.category ||
      !isNonEmptyArray(Object.keys(resData.category))
    ) {
      return [];
    }
    return Object.keys(resData.category);
  }, [resData]);
  const featured = useMemo(() => {
    if (!resData) return [];
    return resData.featured;
  }, [resData]);
  const popular = useMemo(() => {
    if (!resData) return [];
    return resData.popular;
  }, [resData]);

  async function fetchDappList() {
    return await getDappList();
  }

  return {
    category,
    categoryKeys,
    featured,
    popular,
    error,
    loading: swrLoading(resData, error),
  };
}
