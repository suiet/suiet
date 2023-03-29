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
import { useEffect, useMemo, useRef } from 'react';
import { aggregateTxByTime } from './utils/aggregateTxByTime';
import { TxItem } from './transactionDetail';
import InfiniteScroll from 'react-infinite-scroll-component';
import Typo from '../../components/Typo';
import orderTimeList from './utils/orderTimeList';

function TransactionFlow({
  txHistoryList,
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
    () => orderTimeList(Array.from(txByDateMap.keys())),
    [txByDateMap]
  );

  return (
    <div className={''}>
      <InfiniteScroll
        className={'no-scrollbar'}
        dataLength={txHistoryList.length}
        next={fetchMore}
        hasMore={false}
        height={390}
        loader={<Skeleton className="p-3" />}
        endMessage={
          <Typo.Hints className={'text-center'}>
            No more transactions
          </Typo.Hints>
        }
        scrollThreshold={0.8}
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
                  (item, index) => {
                    const encodedTransactionDigest = encodeURIComponent(
                      item.digest
                    );
                    return (
                      <TransactionItem
                        key={item.type + item.digest + index}
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
    </div>
  );
}

function TransactionPage() {
  const context = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(context.accountId);
  const {
    data: transactions,
    loading,
    refetch,
    fetchMore,
    hasMore,
  } = useTransactionListForHistory(address);

  useEffect(() => {
    if (!address) return;
    const polling = setInterval(() => {
      refetch();
    }, 5 * 1000);
    return () => {
      clearInterval(polling);
    };
  }, [address]);

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
