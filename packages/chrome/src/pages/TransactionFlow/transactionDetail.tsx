import { useLocation, useNavigate } from 'react-router-dom';
import './transactionDetail.scss';
import Button from '../../components/Button';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { addressEllipsis } from '../../utils/format';
import Address from '../../components/Address';
import copy from 'copy-to-clipboard';
import message from '../../components/message';
import CopyIcon from '../../components/CopyIcon';

import { ReactComponent as IconExternal } from '../../assets/icons/external.svg';

export interface TxnItem {
  txStatus: 'success' | 'failure';
  transactionDigest: string;
  gasUsed: number;
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
    transactionDigest,
    from,
    to,
    timestamp_ms: time,
    object: { balance: amount, symbol: coinType },
    type,
  } = state;

  return (
    <div className="transaction-detail-container">
      <div className="transaction-detail-header">
        <div
          className="transaction-detail-back"
          onClick={() => {
            navigate('/transaction/flow');
          }}
        ></div>
        <div className="transaction-detail-header-title">Detail</div>
      </div>
      <div className="transaction-detail-general-info">
        <div
          className={classnames('transaction-detail-icon', type, txStatus)}
        ></div>
        <div className="transaction-detail-title">
          {type
            .replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function (str) {
              return str.toUpperCase();
            })}
        </div>
        <div className={classnames('transaction-detail-amount', txStatus)}>
          {txStatus === 'failure'
            ? 'FAILED'
            : type === 'sent'
            ? `- ${Intl.NumberFormat('en-US').format(
                Number(amount)
              )} ${coinType}`
            : `+ ${Intl.NumberFormat('en-US').format(
                Number(amount)
              )} ${coinType}`}
        </div>
      </div>
      <div className="transaction-detail-item-container">
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">TRANSACTION ID</span>
          <div
            className="transaction-detail-item-tx flex items-center"
            onClick={() => {
              copy(transactionDigest);
              message.success('Copied TX ID');
            }}
          >
            <span className="text-ellipsis overflow-hidden max-w-[160px] whitespace-nowrap cursor-pointer">
              {transactionDigest}{' '}
            </span>
            <CopyIcon
              className={classnames('ml-[5px]', 'inline', 'whitespace-nowrap')}
            />
          </div>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">From</span>
          <Address value={from}></Address>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">To</span>
          <Address value={to}></Address>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">Token</span>
          <span>
            {Intl.NumberFormat('en-US').format(Number(amount))} {coinType}
          </span>
        </div>
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">Time</span>
          <span>{dayjs(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        </div>
        <div className="transaction-detail-item">
          <a
            target="_blank"
            href={
              'https://explorer.devnet.sui.io/transactions/' +
              encodeURI(transactionDigest)
            }
            className="m-auto"
            rel="noreferrer"
          >
            View in explorer <IconExternal className="inline"></IconExternal>
          </a>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetail;
