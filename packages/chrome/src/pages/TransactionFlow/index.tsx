import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Empty from './empty';
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

function TransacationFlow() {
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
  return <Empty />
  return (
    <div className="bg-gray-100 h-full w-full p-4">
      <TransacationFlow />

    </div>
  )
}

export default TransactionPage;
