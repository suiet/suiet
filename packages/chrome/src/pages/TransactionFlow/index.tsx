import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Empty from './Empty';
import { coreApi } from '@suiet/core';
import { useAccount } from '../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ITransactionApi } from '@suiet/core/dist/api/txn';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { TxnItem } from './transactionDetail';

type TxnHistroyEntry = Awaited<
  ReturnType<ITransactionApi['getTransactionHistory']>
>[0];

function nomalizeHistory(history: TxnHistroyEntry[], address: string) {
  const res: Record<string, TxnItem[]> = {};
  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const finalItem = {
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
      if (!dt) {
        res[dt] = [finalItem];
      } else {
        res[dt].push(finalItem);
      }
    }
  }
  return res;
}

function TransacationFlow({
  history,
  address,
}: {
  history: TxnHistroyEntry[];
  address: string;
}) {
  const navigate = useNavigate();
  const historyMap = nomalizeHistory(history, address);
  return (
    <>
      {Object.keys(historyMap).map((day) => {
        const list = historyMap[day];
        return (
          <div
            key={day}
            className={classnames(
              'mb-4',
              'px-4 py-6',
              'rounded-2xl',
              'bg-white'
            )}
          >
            <div className="transaction-time">{day}</div>
            <div>
              {list.map(
                (
                  {
                    to,
                    type,
                    object: { balance: amount, symbol },
                    from,
                    timestamp_ms: time,
                    txStatus,
                  },
                  index
                ) => {
                  return (
                    <TransactionItem
                      key={index}
                      from={from}
                      to={to}
                      amount={amount}
                      type={type}
                      status={txStatus}
                      onClick={() => {
                        navigate(`/transaction/detail/${day}-${index}`, {
                          state: {
                            to,
                            type,
                            object: { balance: amount, symbol },
                            from,
                            timestamp_ms: time,
                            txStatus,
                            hideAppLayout: true,
                          },
                        });
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
  const { account } = useAccount(context.accountId);
  const [history, setHistory] = useState<TxnHistroyEntry[] | null>(null);

  useEffect(() => {
    async function getHistory() {
      const network = await coreApi.network.getNetwork('devnet');
      if (!network) {
        setHistory([]);
        return;
      }
      try {
        const hs = await coreApi.txn.getTransactionHistory(
          network,
          account.address
        );
        setHistory(hs || []);
      } catch {
        setHistory([]);
      }
    }
    getHistory();
  }, []);

  if (history === null) return null;

  return history.length === 0 ? (
    <Empty />
  ) : (
    <div className="bg-gray-100 h-full w-full p-4">
      <TransacationFlow history={history} address={account.address} />
    </div>
  );
}

export default TransactionPage;
