import classnames from 'classnames';
import './transactionItem.scss';
import Address from '../../components/Address';
import { CoinObject, TxObject } from '@suiet/core/src/storage/types';
import { nftImgUrl } from '../../utils/nft';

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
  const nFormatter = function nFormatter(
    num: number,
    digits: number | undefined
  ) {
    const lookup = [
      { value: BigInt(1), symbol: '' },
      { value: BigInt(1e3), symbol: 'k' },
      { value: BigInt(1e6), symbol: 'M' },
      { value: BigInt(1e9), symbol: 'G' },
      { value: BigInt(1e12), symbol: 'T' },
      { value: BigInt(1e15), symbol: 'P' },
      { value: BigInt(1e18), symbol: 'E' },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? Number(BigInt(num) / BigInt(item.value))
          .toFixed(digits)
          .replace(rx, '$1') + item.symbol
      : '0';
  };

  return (
    <div className="transaction-item-container" onClick={onClick}>
      <div className={classnames('transaction-item-icon', type, status)} />
      <div className="transaction-item-detail">
        <div className="transaction-item-type">
          {object.type === 'move_call'
            ? 'MoveCall'
            : type // insert a space before all caps
                .replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) {
                  return str.toUpperCase();
                })}
          {date && <span>{date}</span>}
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
      {object.type === 'coin' ? (
        <div className={classnames('transaction-item-amount', type, status)}>
          {status === 'failure'
            ? 'Failed'
            : `${type === 'sent' ? '- ' : '+ '} ${nFormatter(
                Number(object.balance),
                2
              )} ${coin.toUpperCase()}`}
        </div>
      ) : null}
      {object.type === 'nft' ? (
        <div className={classnames('transaction-item-amount', type, status)}>
          <img
            src={nftImgUrl(object.url)}
            className={classnames('h-[40px]', 'w-fit', 'ml-auto')}
            alt=""
          />
        </div>
      ) : null}
      {object.type === 'move_call' ? (
        <div
          className={classnames('transaction-item-amount', type, status)}
        ></div>
      ) : null}
    </div>
  );
}

export default TransactionItem;
