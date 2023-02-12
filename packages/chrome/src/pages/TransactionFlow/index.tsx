import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Empty from './Empty';
import { useAccount } from '../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ITransactionApi } from '@suiet/core/dist/api/txn';
import dayjs from 'dayjs';
import { TxnItem } from './transactionDetail';
import useTransactionList from '../../hooks/useTransactionList';
import Skeleton from 'react-loading-skeleton';
import AppLayout from '../../layouts/AppLayout';

type TxnHistroyEntry = Awaited<
  ReturnType<ITransactionApi['getTransactionHistory']>
>[0];

function normalizeHistory(history: TxnHistroyEntry[], address: string) {
  const res: Record<string, TxnItem[]> = {};
  const days = [];
  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const finalItem: TxnItem = {
      ...item,
      type: address === item.from ? 'sent' : 'received',
    };
    // today
    if (dayjs(item.timestamp_ms).startOf('d').isSame(dayjs().startOf('d'))) {
      if (!res['Today']) {
        res['Today'] = [finalItem];
      } else {
        res['Today'].push({
          ...item,
          type: address === item.from ? 'sent' : 'received',
        });
      }
    } else if (
      dayjs(item.timestamp_ms).startOf('w').isSame(dayjs().startOf('w'))
    ) {
      if (!res['Last Week']) {
        res['Last Week'] = [finalItem];
      } else {
        res['Last Week'].push(finalItem);
      }
    } else {
      const dt = dayjs(item.timestamp_ms).format('MM/YYYY');
      if (!res[dt]) {
        res[dt] = [finalItem];
        days.push(dt);
      } else {
        res[dt].push(finalItem);
      }
    }
  }
  days.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? -1 : 1));
  if (res['Last Week']) days.unshift('Last Week');
  if (res['Today']) days.unshift('Today');
  return {
    historyMap: res,
    days,
  };
}

function TransactionFlow({
  history,
  address,
}: {
  history: TxnHistroyEntry[];
  address: string;
}) {
  const navigate = useNavigate();
  const { historyMap, days } = normalizeHistory(history, address);
  return (
    <>
      {days.map((day) => {
        const list = historyMap[day];
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
              // 'border-2',
              // 'border-slate-100'
            )}
          >
            <div className="transaction-time">{day}</div>
            <div>
              {list.map(
                (
                  {
                    to,
                    type,
                    object,
                    from,
                    timestamp_ms: time,
                    gasFee,
                    txStatus,
                    transactionDigest,
                  },
                  index
                ) => {
                  const encodedTransactionDigest =
                    encodeURIComponent(transactionDigest);
                  return (
                    <TransactionItem
                      key={index}
                      from={from}
                      to={to}
                      object={object}
                      type={type}
                      status={txStatus}
                      onClick={() => {
                        navigate(
                          `/transaction/detail/${encodedTransactionDigest}`,
                          {
                            state: {
                              to,
                              type,
                              object,
                              from,
                              timestamp_ms: time,
                              txStatus,
                              transactionDigest,
                              gasFee,
                              hideAppLayout: true,
                            },
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
    </>
  );
}

function TransactionPage() {
  const context = useSelector((state: RootState) => state.appContext);
  const { address } = useAccount(context.accountId);
  // const [history, setHistory] = useState<TxnHistroyEntry[] | null>(null);
  const { history, loading } = useTransactionList(address, context.networkId);

  function renderContent() {
    if (history === null || loading)
      return (
        <div className="m-4">
          <Skeleton className="w-full" height="200px" />
        </div>
      );
    return !history?.length ? (
      <Empty />
    ) : (
      <div className="bg-gray-50 w-full p-4 min-h-full">
        <TransactionFlow history={history} address={address ?? ''} />
      </div>
    );
  }
  return <AppLayout>{renderContent()}</AppLayout>;
}

export default TransactionPage;
