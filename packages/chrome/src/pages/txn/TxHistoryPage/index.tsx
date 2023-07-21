import {
  TxDateContainer,
  TxSummaryContainer,
  TxSummaryItem,
} from '../../../components/tx-history';
import AppLayout from '../../../layouts/AppLayout';
import useTxnHistoryList from './hooks/useTxnHistoryList';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAccount } from '../../../hooks/useAccount';
import { useMemo, useRef } from 'react';
import { aggregateTxByTime } from './utils/aggregateTxByTime';
import orderTimeList from './utils/orderTimeList';
import dayjs from 'dayjs';
import classnames from 'classnames';
import Skeleton from 'react-loading-skeleton';
import Typo from '../../../components/Typo';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Extendable } from '../../../types';
import { isNonEmptyArray } from '../../../utils/check';
import Empty from './Empty';
import { safe } from '@suiet/core';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as RefreshIcon } from './assets/refresh-cw-05.svg';

export type TxHistoryPageProps = {};

const TxSummaryItemSkeleton = (props: Extendable) => {
  return (
    <div className={classnames('flex items-center', props.className)}>
      <Skeleton className={'w-[36px] h-[36px] rounded-full overflow-hidden'} />
      <div className={'flex flex-col ml-[16px]'}>
        <Skeleton className={'w-[60px] h-[22px]'} />
        <Skeleton className={'w-[120px] h-[16px]'} />
      </div>
      <div className={'ml-auto flex flex-col items-end'}>
        <Skeleton className={'w-[70px] h-[22px]'} />
        <Skeleton className={'w-[40px] h-[16px]'} />
      </div>
    </div>
  );
};

export const TxSummaryContainerSkeleton = (props: Extendable) => {
  return (
    <div className={props.className}>
      <div className={'flex justify-between items-center'}>
        <Skeleton className={'w-[77px] h-[16px]'} />
        <Skeleton className={'w-[73px] h-[16px]'} />
      </div>
      {props.children}
    </div>
  );
};

export const TxHistoryPageSkeleton = () => {
  return (
    <div className={'p-[16px]'}>
      <div>
        <Skeleton className={'w-[88px] h-[24px]'} />
      </div>
      <TxSummaryContainerSkeleton className={'mt-[16px]'}>
        <TxSummaryItemSkeleton className={'my-[16px]'} />
      </TxSummaryContainerSkeleton>
      <TxSummaryContainerSkeleton className={'mt-[32px]'}>
        <TxSummaryItemSkeleton className={'my-[16px]'} />
        <TxSummaryItemSkeleton className={'my-[16px]'} />
        <TxSummaryItemSkeleton className={'my-[16px]'} />
      </TxSummaryContainerSkeleton>
    </div>
  );
};

const TxHistoryLoadingSkeleton = () => {
  return (
    <div className={'px-[16px]'}>
      <TxSummaryContainerSkeleton>
        <TxSummaryItemSkeleton className={'my-[16px]'} />
        <TxSummaryItemSkeleton className={'my-[16px]'} />
        <TxSummaryItemSkeleton className={'my-[16px]'} />
      </TxSummaryContainerSkeleton>
    </div>
  );
};

const TxHistoryPage = (props: TxHistoryPageProps) => {
  const { accountId } = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(accountId);

  const {
    data: txnHistoryList,
    hasMore,
    fetchMore,
    refetch,
    loading,
    isRefetching,
  } = useTxnHistoryList(address, {
    limit: 10,
  });
  const today = useRef(dayjs().valueOf());

  const txByDateMap = useMemo(
    () => aggregateTxByTime(txnHistoryList, today.current),
    [txnHistoryList]
  );
  const days = useMemo(
    () => orderTimeList(Array.from(txByDateMap.keys())),
    [txByDateMap]
  );
  const navigate = useNavigate();

  const handleClickSummaryContainer = (digest: string) => {
    console.log('click summary container', digest);
    navigate(`/transaction/detail/${encodeURIComponent(digest)}`);
  };

  console.log('txByDateMap', txByDateMap);

  if (loading) {
    return (
      <AppLayout>
        <TxHistoryPageSkeleton />
      </AppLayout>
    );
  }
  if (!isNonEmptyArray(days)) {
    return (
      <AppLayout>
        <Empty />
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div>
        <InfiniteScroll
          className={classnames('no-scrollbar pb-[24px]')}
          dataLength={safe(txnHistoryList?.length, 0)}
          next={fetchMore}
          hasMore={hasMore}
          height={457}
          loader={<TxHistoryLoadingSkeleton />}
          endMessage={
            <Typo.Hints className={'text-center'}>
              No more transactions
            </Typo.Hints>
          }
        >
          {/* <TxDateContainer title={'Test'}> */}
          {/*  <TxSummaryContainer */}
          {/*    category={safe(undefined, 'Category')} */}
          {/*    categoryIcon={safe(undefined, 'Txn')} */}
          {/*    categoryColor={safe(undefined, 'text-gray-400')} */}
          {/*    timestamp={safe(undefined, 0)} */}
          {/*  > */}
          {/*    <TxSummaryItem */}
          {/*      title={safe(undefined, 'Unknown')} */}
          {/*      desc={safe(undefined, '')} */}
          {/*      icon={safe(mapIconType('TxnError'), 'Txn')} */}
          {/*      changeTitle={safe(undefined, '')} */}
          {/*      changeTitleColor={safe(undefined, '')} */}
          {/*      changeDesc={safe(undefined, '')} */}
          {/*      changeDescType={safe(undefined, '') as any} */}
          {/*    /> */}
          {/*  </TxSummaryContainer> */}
          {/* </TxDateContainer> */}

          {days.map((day) => {
            const txList = txByDateMap.get(day) ?? [];
            return (
              <TxDateContainer key={day} title={day}>
                {txList.map((txn) => {
                  let { category, summary } = txn.display;
                  if (!summary) {
                    summary = [];
                  }
                  return (
                    <TxSummaryContainer
                      key={safe(txn?.digest)}
                      category={safe(category?.text, 'Category')}
                      categoryIcon={safe(category?.icon, '')}
                      categoryColor={safe(category?.color, '')}
                      timestamp={safe(txn?.timestamp, 0)}
                      onClick={() => handleClickSummaryContainer(txn?.digest)}
                    >
                      {summary.map((item, i) => {
                        const { assetChange, assetChangeDescription } = item;
                        return (
                          <TxSummaryItem
                            key={item?.title + i}
                            title={safe(item?.title, 'Unknown')}
                            desc={safe(item?.description, '')}
                            icon={safe(item?.icon, 'Txn')}
                            changeTitle={safe(assetChange?.text, '')}
                            changeTitleColor={safe(assetChange?.color, '')}
                            changeDesc={safe(assetChangeDescription?.text, '')}
                            changeDescColor={safe(
                              assetChangeDescription?.color,
                              ''
                            )}
                            changeDescType={
                              safe(assetChangeDescription?.icon, '') as any
                            }
                          />
                        );
                      })}
                    </TxSummaryContainer>
                  );
                })}
              </TxDateContainer>
            );
          })}
        </InfiniteScroll>
        <button
          onClick={refetch}
          style={{
            boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.10)',
          }}
          className="fixed p-2 bottom-24 right-4 bg-white rounded-full z-100"
        >
          <RefreshIcon
            className={classnames(isRefetching ? 'animate-spin' : '')}
          ></RefreshIcon>
        </button>
      </div>
    </AppLayout>
  );
};

export default TxHistoryPage;
