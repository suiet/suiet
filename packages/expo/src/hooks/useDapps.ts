import React, { useContext, useMemo } from 'react';
import { DappItem, getDappList } from '@/utils/api';
import { useQuery } from 'react-query';
import { isNonEmptyArray } from '@suiet/core/src/utils';

export function useDappList() {
  const {
    data: resData,
    error,
    ...rest
  } = useQuery(['fetchDappList'], fetchDappList, { refetchInterval: 5 * 60 * 1000 });

  const category: Map<string, DappItem[]> = useMemo(() => {
    if (!resData) return new Map();
    return new Map(Array.from(Object.entries(resData.category)));
  }, [resData]);

  const categoryKeys = useMemo(() => {
    if (!resData || !resData.category || !isNonEmptyArray(Object.keys(resData.category))) {
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
    ...rest,
  };
}
