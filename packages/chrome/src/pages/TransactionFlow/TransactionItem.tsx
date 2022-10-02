import classnames from 'classnames';
import './transactionItem.scss';
import Address from '../../components/Address';
import { TxObject } from '@suiet/core/src/storage/types';
import { nftImgUrl } from '../../utils/nft';
import { fullyFormatCurrency } from '../../utils/format';
import { capitalize } from 'lodash-es';

interface TransactionItemProps {
  type: string;
  to: string;
  object: TxObject;
  coin?: string;
  date?: string;
  onClick: () => void;
  status: 'success' | 'failure';
  from: string;
}

function TransactionItem({
  type,
  to,
  from,
  object,
  coin = 'sui',
  date,
  onClick,
  status,
}: TransactionItemProps) {
  function render(object: any) {
    if (object.type === 'coin') {
      return (
        <div className={classnames('transaction-item-amount', type, status)}>
          {status === 'failure'
            ? 'Failed'
            : `${type === 'sent' ? '- ' : '+ '} ${fullyFormatCurrency(
                object.balance
              )} ${coin.toUpperCase()}`}
        </div>
      );
    }
    if (object.type === 'nft') {
      return (
        <div className={classnames('transaction-item-amount', type, status)}>
          <img
            src={nftImgUrl(object.url)}
            className={classnames('h-[40px]', 'w-fit', 'ml-auto')}
            alt=""
          />
        </div>
      );
    }
    if (object.type === 'move_call') {
      return (
        <div
          className={classnames('transaction-item-amount', type, status)}
        ></div>
      );
    }
    return null;
  }

  return (
    <div className="transaction-item-container" onClick={onClick}>
      <div className={classnames('transaction-item-icon', type, status)} />
      <div className={'transaction-item-wrap'}>
        <div className="transaction-item-detail">
          <div className="transaction-item-type">
            {object.type === 'move_call' ? 'MoveCall' : capitalize(type)}
            {date && <span>{date}</span>}
          </div>
          {render(object)}
        </div>
        {type === 'received' ? (
          <div className="transaction-item-desc">
            From
            <Address
              hideCopy={true}
              className={classnames('ml-1')}
              value={from}
              disableCopy={true}
            ></Address>
          </div>
        ) : (
          <div className="transaction-item-desc">
            To
            <Address
              hideCopy={true}
              className={classnames('ml-1')}
              value={to}
              disableCopy={true}
            ></Address>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionItem;
