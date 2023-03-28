import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Empty from './Empty';
import { useAccount } from '../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import AppLayout from '../../layouts/AppLayout';
import useTransactionListForHistory, {
  TransactionForHistory,
} from './hooks/useTransactionListForHistory';
import { isNonEmptyArray } from '../../utils/check';
import formatTxType from './utils/formatTxType';
import { useMemo, useRef } from 'react';
import { aggregateTxByTime } from './utils/aggregateTxByTime';
import { TxItem } from './transactionDetail';
import InfiniteScroll from 'react-infinite-scroll-component';

function TransactionFlow({
  txHistoryList,
  address,
  fetchMore,
  hasMore,
}: {
  txHistoryList: TransactionForHistory[];
  address: string;
  fetchMore: () => void;
  hasMore: boolean;
}) {
  const navigate = useNavigate();
  const today = useRef(dayjs().valueOf());
  const txByDateMap = useMemo(
    () => aggregateTxByTime(txHistoryList, today.current),
    [txHistoryList]
  );
  const days = useMemo(
    () =>
      Array.from(txByDateMap.keys()).sort((a, b) => {
        if (a === 'Today') return -1;
        if (a === 'Last Week') return -1;
        return dayjs(b).valueOf() - dayjs(a).valueOf();
      }),
    [txByDateMap]
  );
  const loadMoreData = () => {
    fetchMore();
  };

  return (
    <>
      <InfiniteScroll
        dataLength={txHistoryList.length}
        // refreshFunction={() => {
        //   client.refetchQueries({
        //     include: [QUERY_EVENTS],
        //   });
        //   message.config({
        //     top: 100,
        //   });

        //   messageApi.open({
        //     type: 'success',
        //     content: 'refreshed',
        //     top: 100,
        //     style: {
        //       // marginTop: '3.5rem',
        //       // transform: 'translate(0,3.5rem)'
        //     },
        //   });
        // }}
        // pullDownToRefresh
        // pullDownToRefreshThreshold={50}
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }
        next={loadMoreData}
        hasMore={hasMore}
        loader={<Skeleton className="p-3" />}
        // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
      >
        {days.map((day) => {
          return (
            <div
              key={day}
              className={classnames(
                'mb-4',
                'px-4',
                'pt-6',
                'pb-2',
                'rounded-3xl',
                'bg-white'
              )}
            >
              <div className="transaction-time">{day}</div>
              <div>
                {(txByDateMap.get(day) as TransactionForHistory[]).map(
                  (item) => {
                    const encodedTransactionDigest = encodeURIComponent(
                      item.digest
                    );
                    return (
                      <TransactionItem
                        key={item.type + item.digest}
                        type={formatTxType(item.type, item.kind, item.category)}
                        status={item.status}
                        category={item.category}
                        from={item.fromAddresses ?? []}
                        to={item.toAddresses ?? []}
                        coinBalanceChanges={item.coinBalanceChanges}
                        onClick={() => {
                          const state: TxItem = {
                            category: item.category,
                            coinBalanceChanges: item.coinBalanceChanges,
                            digest: item.digest,
                            gasFee: item.gasFee,
                            status: item.status,
                            timestamp: item.timestamp,
                            from: item.fromAddresses ?? [],
                            to: item.toAddresses ?? [],
                            type: formatTxType(
                              item.type,
                              item.kind,
                              item.category
                            ),
                          };
                          navigate(
                            `/transaction/detail/${encodedTransactionDigest}`,
                            {
                              state,
                            }
                          );
                        }}
                      />
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
    </>
  );
}

function TransactionPage() {
  const context = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(context.accountId);
  const {
    data: transactions,
    loading,
    fetchMore,
    hasMore,
  } = useTransactionListForHistory(address);
  function renderContent() {
    if (loading)
      return (
        <div className="m-4">
          <Skeleton className="w-full" height="200px" />
        </div>
      );
    return isNonEmptyArray(transactions) ? (
      <div className="bg-gray-50 w-full p-4 min-h-full">
        <TransactionFlow
          txHistoryList={transactions}
          address={address ?? ''}
          fetchMore={fetchMore}
          hasMore={hasMore}
        />
      </div>
    ) : (
      <Empty />
    );
  }
  return <AppLayout>{renderContent()}</AppLayout>;
}

export default TransactionPage;
