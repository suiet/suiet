import TransactionItem from './TransactionItem';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames'
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
    <div className={classnames('mx-6','rounded-lg','bg-slate-50')}>
      <div className="transaction-time">last week</div>
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

export default TransacationFlow;
