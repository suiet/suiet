import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useMemo, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import {
  TxRequest,
  TxRequestStorage,
  TxRequestType,
} from '../../../scripts/background/transaction';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import { useApiClient } from '../../../hooks/useApiClient';
import { MoveCallTransaction } from '@mysten/sui.js';
import { unwrapTypeReference } from '../../../utils/sui';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Address from '../../../components/Address';
import DappPopupLayout from '../../../layouts/DappPopupLayout';

interface MetadataGroup {
  name: string;
  children: Array<{ id: string; module: string }>;
}
const TX_CONTEXT_TYPE = '0x2::tx_context::TxContext';

// function useTxReqMetadata(metadata: SuiMoveNormalizedFunction) {}

const TxApprovePage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const txReqId = search.get('txReqId');
  const navigate = useNavigate();
  const [txReqData, setTxReqData] = useState<TxRequest>();
  const apiClient = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);

  const metadata = useMemo(() => {
    if (
      !txReqData ||
      txReqData.type !== TxRequestType.MOVE_CALL ||
      !txReqData.metadata
    ) {
      return null;
    }

    const transfer: MetadataGroup = { name: 'Transfer', children: [] };
    const modify: MetadataGroup = { name: 'Modify', children: [] };
    const read: MetadataGroup = { name: 'Read', children: [] };
    txReqData.metadata.parameters.forEach((param, index) => {
      if (typeof param !== 'object') return;
      const id = (txReqData.data as MoveCallTransaction).arguments[
        index
      ] as string;

      const unwrappedType = unwrapTypeReference(param);
      if (!unwrappedType) return;

      const groupedParam = {
        id,
        module: `${unwrappedType.address}::${unwrappedType.module}::${unwrappedType.name}`,
      };

      if ('Struct' in param) {
        transfer.children.push(groupedParam);
      } else if ('MutableReference' in param) {
        // Skip TxContext:
        if (groupedParam.module === TX_CONTEXT_TYPE) return;
        modify.children.push(groupedParam);
      } else if ('Reference' in param) {
        read.children.push(groupedParam);
      }
    });

    if (
      !transfer.children.length &&
      !modify.children.length &&
      !read.children.length
    ) {
      return null;
    }

    return {
      transfer,
      modify,
      read,
    };
  }, [txReqData]);

  useEffect(() => {
    console.log('metadata', metadata);
  }, [metadata]);

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

  return (
    <DappPopupLayout
      originTitle={txReqData?.name ?? ''}
      desc={'wants to make a transaction from'}
      originUrl={txReqData?.origin ?? ''}
      avatarMode={wallet?.avatar}
      favicon={txReqData?.favicon ?? ''}
      okText={'Approve'}
      onOk={() => {
        emitApproval(true);
      }}
      cancelText={'Reject'}
      onCancel={() => {
        emitApproval(false);
      }}
    >
      <Tabs className={styles['tabs']}>
        <TabList>
          <Tab>
            <Typo.Normal className={styles['tab-title']}>Details</Typo.Normal>
          </Tab>
        </TabList>

        <TabPanel className={'mt-[24px]'}>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Wallet
            </Typo.Normal>
            <Address
              value={txReqData?.address ?? ''}
              className={styles['detail-item__value']}
              hideCopy={true}
            />
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Transaction Type
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {txReqData?.type}
            </Typo.Normal>
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Function
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {(txReqData?.data as MoveCallTransaction)?.function}
            </Typo.Normal>
          </div>
        </TabPanel>
      </Tabs>
    </DappPopupLayout>
  );
};

export default TxApprovePage;
