import classnames from 'classnames';
import './transactionItem.scss';

interface TransactionItemProps {
  type: string;
  to: string;
  amount: number;
  coin?: string;
  date?: string;
  onClick: () => void;
  status: 'success' | 'failure';
  from: string;
}

function TransactionItem({
  type,
  to,
  amount,
  coin = 'sui',
  date,
  onClick,
  status,
}: TransactionItemProps) {
  return (
    <div className="transaction-item-container" onClick={onClick}>
      <div className={classnames('transaction-item-icon', type, status)} />
      <div className="transaction-item-detail">
        <div className="transaction-item-type">
          {type}
          {date && <span>{date}</span>}
        </div>
        <div className="transaction-item-to">To {to}</div>
      </div>
      <div className={classnames('transaction-item-amount', type, status)}>
        {status === 'failure'
          ? 'Failed'
          : `${type === 'sent' ? '- ' : '+ '} ${amount} ${coin.toUpperCase()}`}
      </div>
    </div>
  );
}

export default TransactionItem;
