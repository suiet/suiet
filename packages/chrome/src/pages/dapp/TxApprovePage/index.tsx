import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
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
import {
  formatCurrency,
  formatGasBudget,
  formatSUI,
} from '../../../utils/format';
import { isUndefined } from 'lodash-es';
import { LoadingSpin } from '../../../components/Loading';
import Message from '../../../components/message';
import {
  Coin as CoinAPI,
  TransactionBlock,
  TransactionType,
} from '@mysten/sui.js';
import isMoveCall from '../utils/isMoveCall';
import { getGasBudgetFromTxb } from '../../../utils/getters';
import useMyAssetChangesFromDryRun from './hooks/useMyAssetChangesFromDryRun';
import { useAccount } from '../../../hooks/useAccount';
import formatDryRunError from '../../../utils/format/formatDryRunError';

enum Mode {
  LOADING,
  INSUFFICIENT_SUI,
  NORMAL,
  ERROR,
}

const CodeBlock: FC<{ value: Record<string, any> }> = (props) => {
  return (
    <pre
      className={
        'w-[200px] h-[200px] whitespace-pre-wrap break-all overflow-y-auto no-scrollbar'
      }
    >
      <code>{JSON.stringify(props.value, null, 2)}</code>
    </pre>
  );
};

function TxItem(props: { name: ReactNode; value: ReactNode }) {
  return (
    <div className={styles['detail-item']}>
      <Typo.Normal className={styles['detail-item__key']}>
        {props.name}
      </Typo.Normal>
      {typeof props.value === 'string' ? (
        <Typo.Normal className={styles['detail-item__value']}>
          {props.value}
        </Typo.Normal>
      ) : (
        <div className={styles['detail-item__value']}>{props.value}</div>
      )}
    </div>
  );
}

const TxApprovePage = () => {
  const [mode, setMode] = useState<Mode>(Mode.LOADING);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: account } = useAccount(appContext.accountId);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const txReqId = search.get('txReqId');
  const navigate = useNavigate();
  const [txReqData, setTxReqData] = useState<TxRequest>();
  const transactionBlock = useMemo(() => {
    if (!txReqData) return undefined;
    return TransactionBlock.from(txReqData.data);
  }, [txReqData]);
  const txbList = useMemo(() => {
    return isNonEmptyArray(transactionBlock?.blockData?.transactions)
      ? (transactionBlock as TransactionBlock).blockData.transactions
      : [];
  }, [transactionBlock]);

  const {
    balance,
    error: balanceError,
    isSuccess: isBalanceLoaded,
  } = useCoinBalance(
    CoinSymbol.SUI,
    txReqData?.target.address ?? '',
    appContext.networkId
  );

  const {
    data: { estimatedGasFee, coinBalanceChanges },
    error: dryRunError,
    isSuccess: isDryRunSuccess,
  } = useMyAssetChangesFromDryRun(account?.address, transactionBlock);

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
        <TxItem name={'Kind'} value={'MoveCall'}></TxItem>
        <TxItem name={'ObjectId'} value={<Address value={objectId} />} />
        <TxItem name={'Module'} value={module} />
        <TxItem name={'Function'} value={func} />
        <TxItem
          name={'Arguments'}
          value={<CodeBlock value={reqData.arguments} />}
        />
      </>
    );
  }

  function renderMetadataForFallback(tx: TransactionType) {
    return (
      <>
        <TxItem name={'Kind'} value={tx.kind}></TxItem>
        <TxItem name={'Params'} value={<CodeBlock value={tx} />} />
      </>
    );
  }

  function renderTransaction(tx: any) {
    if (isMoveCall(tx)) {
      return renderMetadataForMoveCall(tx);
    }
    return renderMetadataForFallback(tx);
  }

  function renderOverviewInfo() {
    return (
      <div>
        <TxItem name={'Total Txns'} value={txbList.length} />
        <TxItem name={'Network'} value={txReqData?.networkId} />
        <TxItem name={'Balance changes'} value={''} />
        {isNonEmptyArray(coinBalanceChanges) &&
          coinBalanceChanges?.map((item, i) => {
            return (
              <TxItem
                key={item.coinType}
                name={`- ${CoinAPI.getCoinSymbol(item.coinType)}`}
                value={formatCurrency(item.amount, {
                  decimals:
                    CoinAPI.getCoinSymbol(item.coinType) === 'SUI' ? 9 : 0,
                })}
              />
            );
          })}
        <TxItem
          name={'Estimated Gas Fee'}
          value={
            <>
              {formatSUI(estimatedGasFee ?? 0, {
                withAbbr: false,
              })}{' '}
              SUI
            </>
          }
        />
        <TxItem
          name={'Gas Budget'}
          value={<>{formatGasBudget(getGasBudgetFromTxb(transactionBlock))}</>}
        />{' '}
      </div>
    );
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
    if (balanceError) {
      Message.error(balanceError.toString());
      console.error(balanceError);
      return;
    }
    if (dryRunError || balanceError) {
      setMode(Mode.ERROR);
      return;
    }
    if (!isBalanceLoaded || !isDryRunSuccess) {
      setMode(Mode.LOADING);
      return;
    }
    if (isUndefined(balance) || isUndefined(estimatedGasFee)) {
      const err =
        'Data Error: balance or estimated gas fee can not be undefined';
      Message.error(err);
      console.error(err);
      return;
    }
    if (BigInt(balance) < BigInt(estimatedGasFee)) {
      setMode(Mode.INSUFFICIENT_SUI);
      return;
    }
    setMode(Mode.NORMAL);
  }, [
    balance,
    estimatedGasFee,
    isBalanceLoaded,
    balanceError,
    isDryRunSuccess,
    dryRunError,
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
                  Overview
                </Typo.Normal>
              </Tab>
              {txbList.map((tx, i) => (
                <Tab key={tx.kind + i}>
                  <Typo.Normal className={styles['tab-title']}>
                    {`Transaction ${i + 1}`}
                  </Typo.Normal>
                </Tab>
              ))}
            </TabList>

            <TabPanel className={'mt-[8px]'}>{renderOverviewInfo()}</TabPanel>
            {txbList.map((tx, i) => (
              <TabPanel key={tx.kind + i} className={'mt-[8px]'}>
                {renderTransaction(tx)}
              </TabPanel>
            ))}
          </Tabs>
        </DappPopupLayout>
      );
    case Mode.ERROR:
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
          <Typo.Hints className={styles['dryrun-error']}>
            {formatDryRunError(dryRunError)}
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
