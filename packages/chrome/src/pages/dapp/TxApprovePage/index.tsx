import Avatar, { withFavicon } from '../../../components/Avatar';
import HyperLink from '../../../components/HyperLink';
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
import classnames from 'classnames';
import WalletSelector from '../WalletSelector';
import Button from '../../../components/Button';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import { useApiClient } from '../../../hooks/useApiClient';

const TxApprovePage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const txReqId = search.get('txReqId');
  const navigate = useNavigate();
  const [txReqData, setTxReqData] = useState<TxRequest>();
  const apiClient = useApiClient();
  const [loading, setLoading] = useState<boolean>(false);

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
