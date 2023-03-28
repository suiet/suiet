import classnames from 'classnames';
import './transactionItem.scss';
import Address from '../../components/Address';
import { nftImgUrl } from '../../utils/nft';
import { formatCurrency } from '../../utils/format';
import { upperFirst } from 'lodash-es';
import { CoinBalanceChangeItem } from '../../types/gql/transactions';
import formatTotalCoinChange from './utils/formatTotalCoinChange';
import { isNonEmptyArray } from '../../utils/check';
import renderAddress from './utils/renderAddress';

export type TxItemDisplayType = 'received' | 'sent' | 'unknown' | 'moveCall';

interface TransactionItemProps {
  type: TxItemDisplayType;
  category: string;
  coinBalanceChanges: CoinBalanceChangeItem[];
  onClick: () => void;
  status: string;
  from: string[];
  to: string[];
}

function TransactionItem(props: TransactionItemProps) {
  const { type, status } = props;

  function renderContent() {
    if (props.category === 'transfer_coin') {
      return (
        <div className={classnames('transaction-item-amount', type, status)}>
          {status === 'failure'
            ? 'Failed'
            : formatTotalCoinChange(type, props.coinBalanceChanges)}
        </div>
      );
    }
    //   if (object.type === 'nft') {
    //     return (
    //       <div className={classnames('transaction-item-amount', type, status)}>
    //         <img
    //           src={nftImgUrl(object.url)}
    //           className={classnames('h-[40px]', 'w-fit', 'ml-auto')}
    //           alt=""
    //         />
    //       </div>
    //     );
    //   }
    //   if (object.type === 'move_call') {
    //     return (
    //       <div
    //         className={classnames('transaction-item-amount', type, status)}
    //       ></div>
    //     );
    //   }
    //   return null;
  }

  return (
    <div className="transaction-item-container" onClick={props.onClick}>
      <div className={classnames('transaction-item-icon', type, status)} />
      <div className={'transaction-item-wrap'}>
        <div className="transaction-item-detail">
          <div className="transaction-item-type">{upperFirst(type)}</div>
          {renderContent()}
        </div>
        {type === 'received'
          ? isNonEmptyArray(props.from) && (
              <div className="transaction-item-desc">
                From
                {renderAddress(props.from)}
              </div>
            )
          : isNonEmptyArray(props.to) && (
              <div className="transaction-item-desc">
                To
                {renderAddress(props.to)}
              </div>
            )}
      </div>
    </div>
  );
}

export default TransactionItem;
