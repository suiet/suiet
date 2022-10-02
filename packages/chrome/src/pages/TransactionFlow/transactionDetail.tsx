import { useLocation, useNavigate } from 'react-router-dom';
import './transactionDetail.scss';
import Button from '../../components/Button';
import dayjs from 'dayjs';
import classnames from 'classnames';
import {
  addressEllipsis,
  formatCurrency,
  fullyFormatCurrency,
} from '../../utils/format';
import Address from '../../components/Address';
import copy from 'copy-to-clipboard';
import message from '../../components/message';
import CopyIcon from '../../components/CopyIcon';
import { TxObject, CoinObject, NftObject } from '@suiet/core/src/storage/types';
import { ReactComponent as IconExternal } from '../../assets/icons/external.svg';
export interface TxnItem {
  txStatus: 'success' | 'failure';
  transactionDigest: string;
  gasFee: number;
  from: string;
  to: string;
  timestamp_ms: number | null;
  object: TxObject;
  type: 'sent' | 'received' | 'airdop';
}

function TransactionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TxnItem;
  const {
    txStatus,
    transactionDigest,
    gasFee,
    from,
    to,
    timestamp_ms: time,
    object,
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
          {object.type === 'move_call'
            ? 'MoveCall'
            : type // insert a space before all caps
                .replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) {
                  return str.toUpperCase();
                })}
        </div>
        {object.type === 'coin' ? (
          <div className={classnames('transaction-detail-amount', txStatus)}>
            {txStatus === 'failure'
              ? 'FAILED'
              : type === 'sent'
              ? `- ${fullyFormatCurrency(Number(object.balance))} ${
                  object.symbol
                }`
              : `+ ${fullyFormatCurrency(Number(object.balance))} ${
                  object.symbol
                }`}
          </div>
        ) : null}
      </div>
      <div className="transaction-detail-item-container">
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">Transaction ID</span>
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
        {object.type === 'coin' ? (
          <div className="transaction-detail-item">
            <span className="transaction-detail-item-key">Token</span>
            <span>
              {formatCurrency(Number(object.balance))} {object.symbol}
            </span>
          </div>
        ) : null}
        {object.type === 'coin' ? (
          <div className="transaction-detail-item">
            <span className="transaction-detail-item-key">Gas Fee</span>
            <span>
              {formatCurrency(gasFee)} {object.symbol}
            </span>
          </div>
        ) : null}
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">Time</span>
          <span>{dayjs(time).format('YYYY.MM.DD HH:mm:ss')}</span>
        </div>
        <div className="transaction-detail-item">
          <a
            target="_blank"
            href={
              'https://explorer.devnet.sui.io/transactions/' +
              encodeURIComponent(transactionDigest)
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
