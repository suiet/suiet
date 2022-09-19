import Avatar, { withFavicon } from '../../../components/Avatar';
import HyperLink from '../../../components/HyperLink';
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
import WalletSelector from '../WalletSelector';
import Button from '../../../components/Button';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import { useApiClient } from '../../../hooks/useApiClient';
import { SuiMoveNormalizedFunction } from '@mysten/sui.js/src/types/objects';
import { MoveCallTransaction } from '@mysten/sui.js';
import { unwrapTypeReference } from '../../../utils/sui';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Address from '../../../components/Address';

interface MetadataGroup {
  name: string;
  children: { id: string; module: string }[];
}
const TX_CONTEXT_TYPE = '0x2::tx_context::TxContext';

function useTxReqMetadata(metadata: SuiMoveNormalizedFunction) {}

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
      console.log('reqData', reqData);
    })();
  }, [txReqId]);

  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        {withFavicon(<Avatar model={wallet?.avatar} />, {
          src: txReqData?.favicon ?? '',
          alt: txReqData?.origin ?? 'origin',
        })}
        <HyperLink url={txReqData?.origin ?? ''} className={'mt-[16px]'} />
        {/*<Typo.Title className={classnames(styles['header__title'], 'mt-[4px]')}>*/}
        {/*  Magic Eden*/}
        {/*</Typo.Title>*/}
        <Typo.Normal className={styles['header__desc']}>
          wants to make a transaction from
        </Typo.Normal>
      </header>
      <WalletSelector className={'mx-[32px] mt-[10px]'} />

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
              value={txReqData?.accountAddress ?? ''}
              className={styles['detail-item__value']}
              hideCopy={true}
            />
          </div>
          <div className={styles['detail-item']}>
            <Typo.Normal className={styles['detail-item__key']}>
              Transaction Type
            </Typo.Normal>
            <Typo.Normal className={styles['detail-item__value']}>
              {txReqData?.type === TxRequestType.MOVE_CALL
                ? 'MoveCall'
                : 'Unknown'}
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

      <footer className={styles['footer']}>
        <Button
          state={'danger'}
          disabled={loading}
          onClick={() => {
            emitApproval(false);
          }}
        >
          Reject
        </Button>
        <Button
          state={'primary'}
          className={'ml-[8px]'}
          loading={loading}
          onClick={() => {
            emitApproval(true);
          }}
        >
          Approve
        </Button>
      </footer>
    </div>
  );
};

export default TxApprovePage;
