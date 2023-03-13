import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import {
  TxRequest,
  TxRequestStorage,
} from '../../../scripts/background/transaction';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import { useApiClient } from '../../../hooks/useApiClient';
import { MoveCallTransaction, PayAllSuiTransaction } from '@mysten/sui.js';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Address from '../../../components/Address';
import DappPopupLayout from '../../../layouts/DappPopupLayout';
import { PaySuiTransaction } from '@mysten/sui.js/src/signers/txn-data-serializers/txn-data-serializer';
import { isNonEmptyArray } from '../../../utils/check';
import classnames from 'classnames';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import { formatCurrency } from '../../../utils/format';

const TxApprovePage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const txReqId = search.get('txReqId');
  const navigate = useNavigate();
  const [txReqData, setTxReqData] = useState<TxRequest>();
  const apiClient = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);
  const { balance } = useCoinBalance(
    CoinSymbol.SUI,
    txReqData?.target.address ?? ''
  );

  async function emitApproval(approved: boolean) {
    if (!txReqData) return;

    try {
      setLoading(true);
      await apiClient.callFunc('dapp.callbackApproval', {
        approved,
        id: txReqData.id,
        type: ApprovalType.TRANSACTION,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }

  function renderMetadataForMoveCall(reqData: TxRequest) {
    return (
      <div className={styles['detail-item']}>
        <Typo.Normal className={styles['detail-item__key']}>
          Function
        </Typo.Normal>
        <Typo.Normal className={styles['detail-item__value']}>
          {(reqData.data as MoveCallTransaction)?.function}
        </Typo.Normal>
      </div>
    );
  }

  function renderMetadataForPaySui(
    recipients: string[],
    amounts: number[],
    gasBudget: number = 0
  ) {
    const totalAmount = amounts.reduce((pre, cur) => pre + cur, 0);

    if (!isNonEmptyArray(recipients)) return null;
    return (
      <div
        className={classnames(
          styles['detail-item'],
          styles['detail-item--col']
        )}
      >
        <Typo.Normal className={styles['detail-item__key']}>
          Transaction Preview
        </Typo.Normal>
        <div className={'mt-1'}>
          <Typo.Normal className={classnames(styles['detail-item__value'])}>
            Total Payment: {formatCurrency(totalAmount)} SUI
          </Typo.Normal>
          <Typo.Normal className={classnames(styles['detail-item__value'])}>
            Gas Budget: {formatCurrency(gasBudget)} SUI
          </Typo.Normal>
          <Typo.Normal
            className={classnames(
              styles['detail-item__value'],
              'flex item-center'
            )}
          >
            Balance: {formatCurrency(balance)} -{'> '}
            {formatCurrency(Number(balance) - totalAmount - gasBudget)} SUI
          </Typo.Normal>
          <div className={classnames(styles['detail-item__value'])}>
            -----------------------------------
          </div>
        </div>
        {recipients.map((_, i) => {
          return (
            <Typo.Normal
              key={_}
              className={classnames(
                styles['detail-item__value'],
                'flex item-center'
              )}
            >
              <div className={'mr-2'}>To: </div>
              {formatCurrency(amounts[i])}
              <div className={'mx-2'}>SUI -{'> '}</div>
              <Address value={recipients[i]} hideCopy={true} />
            </Typo.Normal>
          );
        })}
      </div>
    );
  }

  function renderMetadata() {
    if (!txReqData) return null;
    if (txReqData.type === 'moveCall') {
      return renderMetadataForMoveCall(txReqData);
    }
    if (txReqData.type === 'paySui') {
      const { recipients, amounts, gasBudget } =
        txReqData.data as PaySuiTransaction;
      return renderMetadataForPaySui(recipients, amounts, gasBudget);
    }
    if (txReqData.type === 'payAllSui') {
      const { recipient, gasBudget } = txReqData.data as PayAllSuiTransaction;
      const payAllSuiAmount = txReqData.metadata?.payAllSuiAmount ?? 0;
      return renderMetadataForPaySui([recipient], [payAllSuiAmount], gasBudget);
    }
    return null;
  }

  useEffect(() => {
    (async function () {
      if (!txReqId) {
        message.error('txReqId should not be empty!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      const txReqStorage = new TxRequestStorage();
      const reqData = await txReqStorage.get(txReqId);
      if (!reqData) {
        message.error('cannot find txReq data!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      setTxReqData(reqData);
    })();
  }, [txReqId]);

  if (!txReqData) return null;
  return (
    <DappPopupLayout
      desc={'wants to make a transaction from'}
      originTitle={txReqData.source.name}
      originUrl={txReqData.source.origin}
      favicon={txReqData.source.favicon}
      avatarMode={wallet?.avatar}
      okText={'Approve'}
      onOk={() => {
        emitApproval(true);
      }}
      cancelText={'Reject'}
      onCancel={() => {
        emitApproval(false);
      }}
      loading={loading}
    >
      <Tabs className={styles['tabs']}>
        <TabList>
          <Tab>
            <Typo.Normal className={styles['tab-title']}>Details</Typo.Normal>
          </Tab>
        </TabList>

        <TabPanel className={'mt-[8px]'}>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Account
            </Typo.Normal>
            <Address
              value={txReqData.target.address}
              className={styles['detail-item__value']}
              hideCopy={true}
            />
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Network
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {txReqData.networkId}
            </Typo.Normal>
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Transaction Type
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {txReqData.type}
            </Typo.Normal>
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Gas Budget
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {txReqData.data.gasBudget} MIST
            </Typo.Normal>
          </div>
          {renderMetadata()}
        </TabPanel>
      </Tabs>
    </DappPopupLayout>
  );
};

export default TxApprovePage;
