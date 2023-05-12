import Typo from '../../../components/Typo';
import { Icon } from '../../../components/icons';
import { ReactComponent as IconPermYes } from '../../../assets/icons/perm-yes.svg';
import { ReactComponent as IconPermNo } from '../../../assets/icons/perm-no.svg';
import styles from './index.module.scss';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import { isNonEmptyArray } from '../../../utils/check';
import { useApiClient } from '../../../hooks/useApiClient';
import {
  Permission,
  PermReqStorage,
  PermRequest,
} from '../../../scripts/background/permission';
import { ApprovalType } from '../../../scripts/background/bg-api/dapp';
import DappPopupLayout from '../../../layouts/DappPopupLayout';

const tips: Record<string, any> = {
  [Permission.SUGGEST_TX]: 'Share wallet address',
  [Permission.VIEW_ACCOUNT]: 'Suggest transactions to approve',
};

const ConnectPage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const permReqId = search.get('permReqId');
  const navigate = useNavigate();
  const [permReqData, setPermReqData] = useState<PermRequest>();
  const apiClient = useApiClient();

  async function emitApproval(approved: boolean) {
    if (!permReqData) return;

    await apiClient.callFunc(
      'dapp.callbackApproval',
      {
        approved,
        id: permReqData.id,
        type: ApprovalType.PERMISSION,
        updatedAt: new Date().toISOString(),
      },
      {
        withAuth: true,
      }
    );
  }

  useEffect(() => {
    (async function () {
      if (!permReqId) {
        message.error('permReqId should not be empty!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      const storage = new PermReqStorage();
      const reqData = await storage.getItem(permReqId);
      if (!reqData) {
        message.error('cannot find permReq data!');
        sleep(3000).then(() => navigate('/'));
        return;
      }
      setPermReqData(reqData);
    })();
  }, [permReqId]);

  if (!permReqData) return null;
  return (
    <DappPopupLayout
      originTitle={permReqData.source.name}
      desc={'wants to connect to'}
      originUrl={permReqData.source.origin}
      avatarMode={wallet?.avatar}
      favicon={permReqData.source.favicon}
      okText={'Connect'}
      onOk={() => {
        emitApproval(true);
      }}
      cancelText={'Cancel'}
      onCancel={() => {
        emitApproval(false);
      }}
    >
      <div className={styles['sections']}>
        <section>
          <Typo.Normal className={styles['perm-title']}>
            This app will be available to:
          </Typo.Normal>
          {isNonEmptyArray(permReqData?.permissions)
            ? permReqData.permissions.map((item) => (
                <div key={item} className={styles['perm-item']}>
                  <Icon
                    className={styles['perm-item-icon']}
                    icon={<IconPermYes />}
                  />
                  <Typo.Small className={styles['perm-item-desc']}>
                    {tips[item] ?? ''}
                  </Typo.Small>
                </div>
              ))
            : null}
        </section>
        <section className={'mt-[16px]'}>
          <Typo.Normal className={styles['perm-title']}>
            This app will NOT be available to:
          </Typo.Normal>
          <div className={styles['perm-item']}>
            <Icon className={styles['perm-item-icon']} icon={<IconPermNo />} />{' '}
            <Typo.Small className={styles['perm-item-desc']}>
              Move tokens & NFTs without your approval
            </Typo.Small>
          </div>
        </section>
      </div>
    </DappPopupLayout>
  );
};

export default ConnectPage;
