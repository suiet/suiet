import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useMemo, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import {
  TxFailureReason,
  TxRequest,
  TxRequestStorage,
} from '../../../scripts/background/transaction';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import { useApiClient } from '../../../hooks/useApiClient';
import {
  MoveCallTransaction,
  PayAllSuiTransaction,
  UnserializedSignableTransaction,
} from '@mysten/sui.js';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Address from '../../../components/Address';
import DappPopupLayout from '../../../layouts/DappPopupLayout';
import { PaySuiTransaction } from '@mysten/sui.js/src/signers/txn-data-serializers/txn-data-serializer';
import { isNonEmptyArray } from '../../../utils/check';
import classnames from 'classnames';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import { formatCurrency } from '../../../utils/format';
import { useEstimatedGasBudget } from '../../../hooks/transaction/useEstimatedGasBudget';
import { isUndefined } from 'lodash-es';
import { LoadingSpin } from '../../../components/Loading';
import Message from '../../../components/message';

enum Mode {
  LOADING,
  INSUFFICIENT_SUI,
  NORMAL,
}

const TxApprovePage = () => {
  const [mode, setMode] = useState<Mode>(Mode.LOADING);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const txReqId = search.get('txReqId');
  const navigate = useNavigate();
  const [txReqData, setTxReqData] = useState<TxRequest>();
  const {
    balance,
    loading: isBalanceLoading,
    error: balanceError,
  } = useCoinBalance(CoinSymbol.SUI, txReqData?.target.address ?? '');

  const unserializedSignableTransaction = useMemo(() => {
    if (!txReqData) return undefined;
    return {
      kind: txReqData.type,
      data: txReqData.data,
    } as UnserializedSignableTransaction;
  }, [txReqData]);
  const { data: estimatedGasBudget, isSuccess: isBudgetLoaded } =
    useEstimatedGasBudget(unserializedSignableTransaction);

  const apiClient = useApiClient();

  async function emitApproval(approved: boolean, reason?: TxFailureReason) {
    if (!txReqData) return;

    try {
      setSubmitLoading(true);
      await apiClient.callFunc('dapp.callbackApproval', {
        approved,
        reason: reason ?? null,
        id: txReqData.id,
        type: ApprovalType.TRANSACTION,
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setSubmitLoading(false);
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
    // if (txReqData.type === 'paySui') {
    //   const { recipients, amounts, gasBudget } =
    //     txReqData.data as PaySuiTransaction;
    //   return renderMetadataForPaySui(recipients, amounts, gasBudget);
    // }
    // if (txReqData.type === 'payAllSui') {
    //   const { recipient, gasBudget } = txReqData.data as PayAllSuiTransaction;
    //   const payAllSuiAmount = txReqData.metadata?.payAllSuiAmount ?? 0;
    //   return renderMetadataForPaySui([recipient], [payAllSuiAmount], gasBudget);
    // }
    return null;
  }

  // validate txReqId
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

  // page mode
  useEffect(() => {
    if (isBalanceLoading || !isBudgetLoaded) {
      setMode(Mode.LOADING);
      return;
    }
    if (isUndefined(balance) || isUndefined(estimatedGasBudget)) {
      const err = 'Data Error: balance or budget can not be undefined';
      Message.error(err);
      console.error(err);
      return;
    }
    if (balanceError) {
      Message.error(balanceError);
      console.error(balanceError);
      return;
    }
    if (BigInt(balance) < BigInt(estimatedGasBudget)) {
      setMode(Mode.INSUFFICIENT_SUI);
      return;
    }
    setMode(Mode.NORMAL);
  }, [
    balance,
    isBalanceLoading,
    balanceError,
    estimatedGasBudget,
    isBudgetLoaded,
  ]);

  if (!txReqData) return null;
  switch (mode) {
    case Mode.NORMAL:
      return (
        <DappPopupLayout
          desc={'wants to make a transaction from'}
          originTitle={txReqData.source.name}
          originUrl={txReqData.source.origin}
          favicon={txReqData.source.favicon}
          avatarMode={wallet?.avatar}
          showOk={mode === Mode.NORMAL}
          okText={'Approve'}
          onOk={() => {
            emitApproval(true);
          }}
          cancelText={'Reject'}
          onCancel={() => {
            emitApproval(false, TxFailureReason.USER_REJECTION);
          }}
          loading={submitLoading}
        >
          <Tabs className={styles['tabs']}>
            <TabList>
              <Tab>
                <Typo.Normal className={styles['tab-title']}>
                  Details
                </Typo.Normal>
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
                  {estimatedGasBudget} MIST
                </Typo.Normal>
              </div>
              {renderMetadata()}
            </TabPanel>
          </Tabs>
        </DappPopupLayout>
      );
    case Mode.INSUFFICIENT_SUI:
      return (
        <DappPopupLayout
          desc={'wants to make a transaction from'}
          originTitle={txReqData.source.name}
          originUrl={txReqData.source.origin}
          favicon={txReqData.source.favicon}
          avatarMode={wallet?.avatar}
          showOk={false}
          cancelText={'Cancel'}
          cancelState={'normal'}
          onCancel={() => {
            emitApproval(false, TxFailureReason.INSUFFICIENT_GAS);
          }}
        >
          <Typo.Hints className={styles['insufficient-sui-hints']}>
            You DO NOT have enough SUI
          </Typo.Hints>
        </DappPopupLayout>
      );
    default:
      // Loading state
      return (
        <DappPopupLayout
          desc={'wants to make a transaction from'}
          originTitle={txReqData.source.name}
          originUrl={txReqData.source.origin}
          favicon={txReqData.source.favicon}
          avatarMode={wallet?.avatar}
          showOk={false}
          cancelText={'Cancel'}
          cancelState={'normal'}
          onCancel={() => {
            emitApproval(false, TxFailureReason.USER_REJECTION);
          }}
        >
          <div className={'h-36 flex justify-center items-center'}>
            <LoadingSpin />
          </div>
        </DappPopupLayout>
      );
  }
};

export default TxApprovePage;
