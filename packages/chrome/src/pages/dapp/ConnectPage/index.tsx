import Avatar from '../../../components/Avatar';
import Typo from '../../../components/Typo';
import Icon from '../../../components/Icon';
import { ReactComponent as IconLink } from '../../../assets/icons/link.svg';
import { ReactComponent as IconPermYes } from '../../../assets/icons/perm-yes.svg';
import { ReactComponent as IconPermNo } from '../../../assets/icons/perm-no.svg';
import Button from '../../../components/Button';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLocationSearch } from '../../../hooks/useLocationSearch';
import { useEffect, useState } from 'react';
import message from '../../../components/message';
import { sleep } from '../../../utils/time';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useWallet } from '../../../hooks/useWallet';
import Address from '../../../components/Address';
import { isNonEmptyArray } from '../../../utils/check';
import { useApiClient } from '../../../hooks/useApiClient';
import {
  PermReqStorage,
  PermRequest,
} from '../../../scripts/background/permission';

const ConnectPage = () => {
  const appContext = useSelector((state: RootState) => state.appContext);
  const { data: wallet } = useWallet(appContext.walletId);
  const search = useLocationSearch();
  const permReqId = search.get('permReqId');
  const navigate = useNavigate();
  const [permReqData, setPermReqData] = useState<PermRequest>();
  const apiClient = useApiClient();

  async function handleConnect() {
    if (!permReqData) return;

    // sent result via event emitter to background
    await apiClient.callFunc('dapp.callbackPermRequestResult', {
      id: permReqData.id,
      status: 'passed',
      updatedAt: new Date().toISOString(),
    });
  }

  async function handleCancel() {
    if (!permReqData) return;

    // sent result via event emitter to background
    await apiClient.callFunc('dapp.callbackPermRequestResult', {
      id: permReqData.id,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
    });
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
      console.log('reqData', reqData);
    })();
  }, [permReqId]);

  return (
    <div className={styles['container']}>
      <header className={styles['header']}>
        <div className={styles['header-icons']}>
          <div className={styles['header-favicon']}>
            <img
              src={permReqData?.favicon}
              alt={permReqData?.origin ?? 'origin'}
            />
          </div>
          <Avatar className={styles['header-avatar']} />
        </div>
        <Typo.Title className={styles['header-title']}>Connect</Typo.Title>
        <div className={classnames(styles['connect-item'], 'mt-[16px]')}>
          <Icon icon={<IconLink />} className={styles['connect-item-icon']} />
          <Typo.Normal className={styles['connect-item-name']}>
            {permReqData?.origin}
          </Typo.Normal>
        </div>
        <div className={classnames(styles['connect-item'], 'mt-[4px]')}>
          <Avatar className={styles['connect-item-icon']} />
          <Typo.Normal className={styles['connect-item-name']}>
            {wallet?.name}
          </Typo.Normal>
          <Address
            className={styles['connect-item-desc']}
            value={wallet.defaultAccount?.address ?? ''}
            hideCopy={true}
          ></Address>
        </div>
      </header>
      <div className={'px-[32px]'}>
        <hr />
      </div>
      <div className={styles['sections']}>
        <section>
          <Typo.Normal className={styles['perm-title']}>
            This app will be available to:
          </Typo.Normal>
          {isNonEmptyArray(permReqData?.permissions)
            ? (permReqData as PermRequest).permissions.map((item) => (
                <div key={item} className={styles['perm-item']}>
                  <Icon
                    className={styles['perm-item-icon']}
                    icon={<IconPermYes />}
                  />
                  <Typo.Small className={styles['perm-item-desc']}>
                    {item}
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

      <footer className={styles['footer']}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          state={'primary'}
          className={'ml-[8px]'}
          onClick={handleConnect}
        >
          Connect
        </Button>
      </footer>
    </div>
  );
};

export default ConnectPage;
