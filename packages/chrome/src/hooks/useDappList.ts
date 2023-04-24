import { useCallback, useMemo } from 'react';
import { DappItem, getDappList } from '../api/dapps';
import { isNonEmptyArray } from '../utils/check';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

export function useDappList() {
  const { networkId } = useSelector((state: any) => state.appContext);
  const fetchDappList = useCallback(async () => {
    return await getDappList({
      networkId,
    });
  }, [networkId]);

  const {
    data: resData,
    error,
    ...rest
  } = useQuery(['fetchDappList', networkId], fetchDappList, {
    staleTime: 60 * 1000,
  });

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

  return {
    category,
    categoryKeys,
    featured,
    popular,
    error,
    ...rest,
  };
}
