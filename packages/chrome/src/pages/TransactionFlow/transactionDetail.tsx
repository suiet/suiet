import { useLocation, useNavigate } from 'react-router-dom';
import './transactionDetail.scss';
import Button from '../../components/Button';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { addressEllipsis } from '../../utils/format';

export interface TxnItem {
  txStatus: 'success' | 'failure';
  from: string;
  to: string;
  timestamp_ms: number | null;
  object: {
    type: 'coin';
    symbol: string;
    balance: number;
  };
  type: 'sent' | 'received' | 'airdop';
}

function TransactionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TxnItem;
  const {
    txStatus,
    from,
    to,
    timestamp_ms: time,
    object: { balance: amount, symbol: coinType },
    type,
  } = state;
  return (
    <div className="transaction-detail-container">
      <div
        className="transaction-detail-back"
        onClick={() => {
          navigate('/transaction/flow');
        }}
      ></div>
      <div className="transaction-detail-header">
        <div
          className={classNames('transaction-detail-icon', type, txStatus)}
        ></div>
        <div className="transaction-detail-title">{type.toUpperCase()}</div>
        <div className={classNames('transaction-detail-amount', txStatus)}>
          {txStatus === 'failure'
            ? 'FAILED'
            : type === 'sent'
            ? `- ${amount} ${coinType}`
            : `- ${amount} ${coinType}`}
        </div>
      </div>
      <div className="transaction-detail-item-container">
        <div className="transaction-detail-item">
          <span>From</span>
          <span>{addressEllipsis(from)}</span>
        </div>
        <div className="transaction-detail-item">
          <span>To</span>
          <span>{addressEllipsis(to)}</span>
        </div>
        <div className="transaction-detail-item">
          <span>Token</span>
          <span>
            {amount} {coinType}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span>Time</span>
          <span>{dayjs(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;
