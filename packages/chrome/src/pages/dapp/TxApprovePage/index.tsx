import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import {
  formatCurrency,
  formatGasBudget,
  formatSUI,
  formatDryRunError,
  AssetChangeFormatter,
} from '@suiet/core';
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
import useSuiBalance from '../../../hooks/coin/useSuiBalance';
import { ObjectChangeItem } from '../../../components/AssetChange';
import classNames from 'classnames';
import './custom.css';
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
  const txReqStorage = useRef(new TxRequestStorage());

  const {
    data: suiBalance,
    error: suiBalanceError,
    loading: suiBalanceLoading,
  } = useSuiBalance(txReqData?.target.address ?? '');

  const {
    data: {
      coinChangeList,
      nftChangeList,
      objectChangeList,
      estimatedGasFee,
      gasBudget,
    },
    error: diffError,
    loading: diffLoading,
  } = useMyAssetChangesFromDryRun(account?.address, transactionBlock);

  const apiClient = useApiClient();
  const emitApproval = useCallback(
    async (approved: boolean, reason?: TxFailureReason) => {
      if (!txReqData) return;
      try {
        setSubmitLoading(true);
        // set gas budget to txReqData
        debugger;
        if (approved && !transactionBlock?.blockData?.gasConfig?.budget) {
          // auto set gas budget
          transactionBlock?.setGasBudget(BigInt(gasBudget));
          txReqData.data = transactionBlock?.serialize();
          await txReqStorage.current.set(txReqData);
        }
        await apiClient.callFunc(
          'dapp.callbackApproval',
          {
            approved,
            reason: reason ?? null,
            id: txReqData.id,
            type: ApprovalType.TRANSACTION,
            updatedAt: new Date().toISOString(),
          },
          {
            withAuth: true,
          }
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [txReqData, transactionBlock, gasBudget]
  );

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
      <div className={classNames(styles['overview'], 'mt-[16px]')}>
        <TxItem
          name={'Gas Budget'}
          value={`${formatGasBudget(gasBudget)} SUI`}
        />{' '}
        <TxItem name={'Network'} value={txReqData?.networkId} />
      </div>
    );
  }

  const renderAssetChanges = () => {
    return (
      <div>
        <div className="my-6 flex flex-col gap-2">
          {[...coinChangeList, ...nftChangeList, ...objectChangeList].map(
            (item) => {
              const f = AssetChangeFormatter.format(item);
              return (
                <ObjectChangeItem
                  key={item.objectId}
                  title={f.title}
                  desc={f.desc}
                  icon={f.icon}
                  iconShape={f.iconShape}
                  iconColor={f.iconColor}
                  changeTitle={f.changeTitle}
                  changeTitleColor={f.changeTitleColor as any}
                  changeDesc={f.changeDesc}
                />
              );
            }
          )}
        </div>
        {renderOverviewInfo()}
      </div>
    );
  };

  // validate txReqId
  useEffect(() => {
    (async function () {
      if (!txReqId) {
        Message.error('txReqId should not be empty!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      const reqData = await txReqStorage.current.get(txReqId);
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
    if (suiBalanceError) {
      Message.error(suiBalanceError.toString());
      console.error(suiBalanceError);
      return;
    }
    if (diffError || suiBalanceError) {
      setMode(Mode.ERROR);
      return;
    }
    if (suiBalanceLoading || diffLoading) {
      setMode(Mode.LOADING);
      return;
    }
    if (
      isUndefined(suiBalance) ||
      isUndefined(estimatedGasFee) ||
      estimatedGasFee === '0'
    ) {
      return;
    }
    if (BigInt(suiBalance.balance) < BigInt(estimatedGasFee)) {
      setMode(Mode.INSUFFICIENT_SUI);
      return;
    }
    setMode(Mode.NORMAL);
  }, [
    suiBalance,
    estimatedGasFee,
    suiBalanceLoading,
    suiBalanceError,
    diffLoading,
    diffError,
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
                  Assets
                </Typo.Normal>
              </Tab>
              {txbList.map((tx, i) => (
                <Tab key={tx.kind + i}>
                  <Typo.Normal className={styles['tab-title']}>
                    {`Txn ${i + 1}`}
                  </Typo.Normal>
                </Tab>
              ))}
            </TabList>

            <TabPanel>{renderAssetChanges()}</TabPanel>
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
            {formatDryRunError(diffError)}
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
          <div className={'h-full flex justify-center items-center'}>
            <LoadingSpin />
          </div>
        </DappPopupLayout>
      );
  }
};

export default TxApprovePage;
