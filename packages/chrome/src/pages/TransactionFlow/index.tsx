import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Empty from './Empty';
import { coreApi } from '@suiet/core';
import { useAccount } from '../../hooks/useAccount';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { TxHistroyEntry } from '@suiet/core/dist/api/txn';
import { useEffect, useState } from 'react';
const list = [
  {
    id: 1,
    type: 'sent',
    to: '0xiasd...asdas',
    amount: 2000,
  },
  {
    id: 2,
    type: 'received',
    to: '0xiasd...asdas',
    amount: 2000,
  },
  {
    id: 3,
    type: 'airdroped',
    to: '0xiasd...asdas',
    amount: 2000,
  },
];

function nomalizeHistory(history: TxHistroyEntry[]) {}

function TransacationFlow({ history }: { history: TxHistroyEntry[] }) {
  const navigate = useNavigate();
  return (
    <div className={classnames('mb-4', 'px-4 py-6', 'rounded-2xl', 'bg-white')}>
      <div className="transaction-time">Last week</div>
      <div>
        {list.map(({ to, type, amount, id }, index) => {
          return (
            <TransactionItem
              key={id}
              to={to}
              amount={amount}
              type={type}
              onClick={() => {
                navigate(`/transaction/detail/${id}`);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function TransactionPage() {
  const context = useSelector((state: RootState) => state.appContext);
  const { account } = useAccount(context.accountId);
  const [history, setHistory] = useState<TxHistroyEntry[] | null>(null);
  useEffect(() => {
    async function getHistory() {
      const hs = await coreApi.txn.getTransactionHistory(
        'devnet',
        account.address
      );
      setHistory(hs);
    }
    getHistory();
  }, []);

  if (history === null) return null;

  return history.length > 0 ? (
    <Empty />
  ) : (
    <div className="bg-gray-100 h-full w-full p-4">
      <TransacationFlow history={history} />
    </div>
  );
}

export default TransactionPage;
