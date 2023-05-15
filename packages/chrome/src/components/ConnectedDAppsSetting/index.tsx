import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAccount } from '../../hooks/useAccount';
import {
  PermissionManager,
  PermRequest,
} from '../../scripts/background/permission';
import { RootState } from '../../store';
import Typo from '../Typo';
import styles from './index.module.scss';

const permissionManager = new PermissionManager();

function DAppItem({
  perms,
  reload,
}: {
  perms: PermRequest;
  reload: () => void;
}) {
  return (
    <div className={styles['dapp']}>
      <div className={styles['circle']}></div>
      <Typo.Normal className={styles['text']}>
        {perms.source.origin}
      </Typo.Normal>
      <div
        className={styles['revoke']}
        onClick={async () => {
          await permissionManager.setPermission({
            ...perms,
            approved: false,
            updatedAt: new Date().toISOString(),
          });
          reload();
        }}
      >
        Revoke
      </div>
    </div>
  );
}

export function ConnectedDAppsSetting() {
  const { accountId, networkId } = useSelector(
    (state: RootState) => state.appContext
  );
  const { address } = useAccount(accountId);
  const [permsList, setPermsList] = useState<PermRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, triggerReload] = useState(false);

  useEffect(() => {
    async function loadPerms() {
      const permsMap = await permissionManager.getAllPermissions({
        address,
        networkId,
      });
      setPermsList(permsMap);
      setLoading(false);
    }
    if (networkId && address) {
      loadPerms();
    }
  }, [networkId, address, reload]);

  if (loading) return null;

  return (
    <div className={styles['container']}>
      {permsList.length > 0 ? (
        permsList.map((perms) => {
          return (
            <DAppItem key={perms.id} perms={perms} reload={triggerReload} />
          );
        })
      ) : (
        <div className="flex items-center">
          <div className={styles['circle-disable']}></div>
          <Typo.Normal className={styles['text']}>
            You have no connected dApps
          </Typo.Normal>
        </div>
      )}
    </div>
  );
}
