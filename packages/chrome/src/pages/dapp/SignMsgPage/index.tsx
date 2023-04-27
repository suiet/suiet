import Typo from '../../../components/Typo';
import styles from './index.module.scss';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { useApiClient } from '../../../hooks/useApiClient';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import DappPopupLayout from '../../../layouts/DappPopupLayout';
import {
  SignRequest,
  SignRequestStorage,
} from '../../../scripts/background/sign-msg';
import { arrayToUint8array } from '../../../scripts/shared/msg-passing/uint8array-passing';

const SignMsgPage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const reqId = search.get('reqId');
  const navigate = useNavigate();
  const [reqData, setReqData] = useState<SignRequest>();
  const apiClient = useApiClient();

  async function emitApproval(approved: boolean) {
    if (!reqData) return;

    await apiClient.callFunc(
      'dapp.callbackApproval',
      {
        approved,
        id: reqData.id,
        type: ApprovalType.SIGN_MSG,
        updatedAt: new Date().toISOString(),
      },
      {
        withAuth: true,
      }
    );
  }

  useEffect(() => {
    (async function () {
      if (!reqId) {
        message.error('request id should not be empty!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      const storage = new SignRequestStorage();
      const reqData = await storage.get(reqId);
      if (!reqData) {
        message.error('cannot find request data!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      setReqData(reqData);
    })();
  }, [reqId]);

  function tryParseUint8Array(value: Uint8Array) {
    if (!(value instanceof Uint8Array)) {
      return 'Unsupported message type';
    }
    try {
      return new TextDecoder().decode(value);
    } catch (e) {
      console.error(e);
      return 'Unsupported message type';
    }
  }

  if (!reqData) return null;
  return (
    <DappPopupLayout
      originTitle={reqData.source.name}
      originUrl={reqData.source.origin}
      favicon={reqData.source.favicon}
      desc={'asks to sign a message'}
      avatarMode={wallet?.avatar}
      okText={'Sign'}
      onOk={() => {
        emitApproval(true);
      }}
      cancelText={'Reject'}
      onCancel={() => {
        emitApproval(false);
      }}
    >
      <div className={'mt-[24px] px-[32px]'}>
        <Typo.Title className={styles['title']}>
          Message to be signed
        </Typo.Title>
        <Typo.Normal className={styles['desc']}>
          {tryParseUint8Array(arrayToUint8array(reqData.data as any))}
        </Typo.Normal>
      </div>
    </DappPopupLayout>
  );
};

export default SignMsgPage;
