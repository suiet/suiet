import { useLocation, useNavigate } from 'react-router-dom';
import './transactionDetail.scss';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { formatSUI } from '../../utils/format';
import copy from 'copy-to-clipboard';
import message from '../../components/message';
import CopyIcon from '../../components/CopyIcon';
import { ReactComponent as IconExternal } from '../../assets/icons/external.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CoinBalanceChangeItem } from '../../types/gql/transactions';
import { TxItemDisplayType } from './TransactionItem';
import { upperFirst } from 'lodash-es';
import formatTotalCoinChange from './utils/formatTotalCoinChange';
import renderAddress from './utils/renderAddress';
import { isNonEmptyArray } from '../../utils/check';

export interface TxItem {
  type: TxItemDisplayType;
  category: string;
  coinBalanceChanges: CoinBalanceChangeItem[];
  status: string;
  from: string[];
  to: string[];
  timestamp: number;
  gasFee: number;
  digest: string;
}

function TransactionDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TxItem;

  const { accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );

  function renderAddressesByType(type: 'From' | 'To', addresses: string[]) {
    return (
      isNonEmptyArray(addresses) && (
        <div className="transaction-detail-item">
          <span className="transaction-detail-item-key">{type}</span>
          {renderAddress(addresses)}
        </div>
      )
    );
  }

  function renderDigest(digest: string) {
    return (
      <div className="transaction-detail-item">
        <span className="transaction-detail-item-key">Transaction ID</span>
        <div
          className="transaction-detail-item-tx flex items-center"
          onClick={() => {
            copy(digest);
            message.success('Copied TX ID');
          }}
        >
          <span className="text-ellipsis overflow-hidden max-w-[160px] whitespace-nowrap cursor-pointer">
            {digest}
          </span>
          <CopyIcon
            className={classnames('ml-[5px]', 'inline', 'whitespace-nowrap')}
          />
        </div>
      </div>
    );
  }

  function renderGasFee(gasFee: number) {
    return (
      <div className="transaction-detail-item">
        <span className="transaction-detail-item-key">Gas Fee</span>
        <span>{formatSUI(gasFee)} SUI</span>
      </div>
    );
  }

  function renderTime(timestamp: number) {
    return (
      <div className="transaction-detail-item">
        <span className="transaction-detail-item-key">Time</span>
        <span>{dayjs(timestamp).format('YYYY.MM.DD HH:mm:ss')}</span>
      </div>
    );
  }

  function renderViewInExplorer(digest: string, networkId: string) {
    return (
      <div className="transaction-detail-item">
        <a
          target="_blank"
          href={
            `https://explorer.sui.io/transactions/` +
            encodeURIComponent(digest) +
            `?network=${networkId}`
          }
          className="m-auto"
          rel="noreferrer"
        >
          View in explorer
          <IconExternal className="inline w-[12px] h-[12px] stroke-gray-400"></IconExternal>
        </a>
      </div>
    );
  }

  function renderTokenChanges(coinBalanceChanges: CoinBalanceChangeItem[]) {
    return null;
    // TODO: render token changes
    // return state.category === 'tranfer_coin' ? (
    //   <div className="transaction-detail-item">
    //     <span className="transaction-detail-item-key">Token</span>
    //     <span>
    //       {formatCurrency(state.balance, {
    //         decimals: 9,
    //         withAbbr: false,
    //       })}{' '}
    //       {object.symbol}
    //     </span>
    //   </div>
    // ) : null;
  }

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
          className={classnames(
            'transaction-detail-icon',
            state.type,
            state.status
          )}
        ></div>
        <div className="transaction-detail-title">{upperFirst(state.type)}</div>
        {state.category === 'transfer_coin' ? (
          <div
            className={classnames('transaction-detail-amount', state.status)}
          >
            {state.status === 'failure'
              ? 'FAILED'
              : formatTotalCoinChange(state.type, state.coinBalanceChanges)}
          </div>
        ) : null}
      </div>
      <div className="transaction-detail-item-container">
        {renderDigest(state.digest)}
        {renderAddressesByType('From', state.from)}
        {renderAddressesByType('To', state.to)}
        {renderTokenChanges(state.coinBalanceChanges)}
        {renderGasFee(state.gasFee)}
        {renderTime(state.timestamp)}
        {renderViewInExplorer(state.digest, networkId)}
      </div>
    </div>
  );
}

export default TransactionDetail;
