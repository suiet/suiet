import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { ReactNode, useEffect, useMemo, useState } from 'react';
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
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Address from '../../../components/Address';
import DappPopupLayout from '../../../layouts/DappPopupLayout';
import { isNonEmptyArray } from '../../../utils/check';
import classnames from 'classnames';
import { CoinSymbol, useCoinBalance } from '../../../hooks/useCoinBalance';
import { formatSUI } from '../../../utils/format';
import { useEstimatedGasBudget } from '../../../hooks/transaction/useEstimatedGasBudget';
import { isUndefined } from 'lodash-es';
import { LoadingSpin } from '../../../components/Loading';
import Message from '../../../components/message';
import { TransactionBlock } from '@mysten/sui.js';
import isMoveCall from '../utils/isMoveCall';

enum Mode {
  LOADING,
  INSUFFICIENT_SUI,
  NORMAL,
}

function TxItem(props: { name: ReactNode; value: ReactNode }) {
  return (
    <div className={styles['detail-item']}>
      <Typo.Normal className={styles['detail-item__key']}>
        {props.name}
      </Typo.Normal>
      <Typo.Normal className={styles['detail-item__value']}>
        {props.value}
      </Typo.Normal>
    </div>
  );
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
  const transactionBlock = useMemo(() => {
    if (!txReqData) return undefined;
    return TransactionBlock.from(txReqData.data);
  }, [txReqData]);
  const [activeTab, setActiveTab] = useState(0);

  const {
    balance,
    loading: isBalanceLoading,
    error: balanceError,
  } = useCoinBalance(CoinSymbol.SUI, txReqData?.target.address ?? '');

  // const unserializedSignableTransaction = useMemo(() => {
  //   if (!txReqData) return undefined;
  //   return {
  //     kind: txReqData.type,
  //     data: txReqData.data,
  //   } as UnserializedSignableTransaction;
  // }, [txReqData]);
  const { data: estimatedGasBudget, isSuccess: isBudgetLoaded } =
    useEstimatedGasBudget(transactionBlock);

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

  function renderMetadataForMoveCall(reqData: any) {
    const [objectId, module, func] = reqData.target.split('::');
    return (
      <>
        <TxItem name={'Type'} value={'MoveCall'}></TxItem>
        <TxItem name={'ObjectId'} value={<Address value={objectId} />} />
        <TxItem name={'Module'} value={module} />
        <TxItem name={'Function'} value={func} />
        <TxItem
          name={'Arguments'}
          value={
            <pre
              className={
                'w-[180px] h-[200px] whitespace-pre-wrap break-all overflow-y-auto no-scrollbar'
              }
            >
              <code>{JSON.stringify(reqData.arguments)}</code>
            </pre>
          }
        ></TxItem>
      </>
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
            Total Payment: {formatSUI(totalAmount)} SUI
          </Typo.Normal>
          <Typo.Normal className={classnames(styles['detail-item__value'])}>
            Gas Budget: {formatSUI(gasBudget)} SUI
          </Typo.Normal>
          <Typo.Normal
            className={classnames(
              styles['detail-item__value'],
              'flex item-center'
            )}
          >
            Balance: {formatSUI(balance)} -{'> '}
            {formatSUI(Number(balance) - totalAmount - gasBudget)} SUI
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
              {formatSUI(amounts[i])}
              <div className={'mx-2'}>SUI -{'> '}</div>
              <Address value={recipients[i]} hideCopy={true} />
            </Typo.Normal>
          );
        })}
      </div>
    );
  }

  function renderMetadata(activeIndex: number) {
    if (!transactionBlock) return null;
    const { transactions } = transactionBlock.blockData;
    return <>{renderSingleTransaction(transactions[activeIndex])}</>;
  }

  function renderSingleTransaction(tx: any) {
    if (isMoveCall(tx)) {
      return renderMetadataForMoveCall(tx);
    }
    // if (txReqData.type === 'paySui') {
    //   const { recipients, amounts, gasBudget } =
    //     txReqData.data as PaySuiTransaction;
    //   return renderMetadataForPaySui(recipients, amounts, gasBudget);
    // }
    // if (txReqData.type === 'payAllSui') {
    //   const { recipient, gasBudget } = txReqData.data as PayAllSuiTransaction;
    //   const payAllSuiAmount = txReqData.metadata?.payAllSuiAmount ?? 0;
    //   return renderMetadataForPaySui(
    //     [recipient],
    //     [payAllSuiAmount],
    //     gasBudget
    //   );
    // }
  }

  // validate txReqId
  useEffect(() => {
    (async function () {
      if (!txReqId) {
        Message.error('txReqId should not be empty!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      const txReqStorage = new TxRequestStorage();
      const reqData = await txReqStorage.get(txReqId);
      if (!reqData) {
        Message.error('cannot find txReq data!');
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
          <Tabs
            className={styles['tabs']}
            onSelect={(activeIndex) => {
              setActiveTab(activeIndex);
            }}
          >
            <TabList>
              {isNonEmptyArray(transactionBlock?.blockData?.transactions) &&
                transactionBlock?.blockData.transactions.map((tx, i) => (
                  <Tab key={i}>
                    <Typo.Normal className={styles['tab-title']}>
                      {`Transaction ${i + 1}`}
                    </Typo.Normal>
                  </Tab>
                ))}
            </TabList>

            <TabPanel className={'mt-[8px]'}>
              <TxItem name={'Network'} value={txReqData.networkId} />
              <TxItem
                name={'Gas Budget'}
                value={<>{estimatedGasBudget} MIST</>}
              />
              {renderMetadata(activeTab)}
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
