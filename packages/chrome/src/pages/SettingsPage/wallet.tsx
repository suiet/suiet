import styles from './wallet.module.scss';
import classnames from 'classnames';
import Button from '../../components/Button';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import message from '../../components/message';
import { useWallet } from '../../hooks/useWallet';
import SettingTwoLayout from '../../layouts/SettingTwoLayout';
import Nav from '../../components/Nav';
import Input from '../../components/Input';
import Icon from '../../components/Icon';
import { ReactComponent as IconCheck } from '../../assets/icons/check.svg';
import { ReactComponent as IconNotCheck } from '../../assets/icons/not-check.svg';

function Wallet() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('1');
  const navigate = useNavigate();
  const { data: wallet, updateWallet } = useWallet(appContext.walletId);

  async function updateWalletInfo() {
    await updateWallet(appContext.walletId, { name, avatar });
    message.success(`Updated Wallet: ${name}`);
    navigate('..');
  }

  useEffect(() => {
    if (!wallet) return;
    setName(wallet.name ?? '');
    setAvatar(wallet.avatar ?? '1');
  }, [wallet]);

  return (
    <SettingTwoLayout
      title={'Edit Wallet'}
      desc={'Manage your wallet informations here.'}
    >
      <Nav
        position={'absolute'}
        onNavBack={() => {
          navigate('..');
        }}
      />
      <div className={classnames(styles['wallet-item-title'], 'mt-[36px]')}>
        Icon
      </div>
      <div className="flex gap-4 mb-4">
        {[1, 2, 3, 4].map((num) => {
          const active = num.toString() === avatar;
          return (
            <div
              key={num}
              onClick={() => setAvatar(num.toString())}
              className={classnames(styles['wallet-avatar-container'], {
                [styles['active']]: active,
              })}
            >
              <Avatar model={num} />
              <Icon
                icon={active ? <IconCheck /> : <IconNotCheck />}
                className={styles['wallet-check']}
              />
            </div>
          );
        })}
      </div>
      <div className={styles['wallet-item-title']}>Name</div>
      <Input
        value={name}
        onChange={(v) => {
          setName(v.target.value);
        }}
      />
      <Button
        state="primary"
        onClick={updateWalletInfo}
        className={'mt-[88px]'}
      >
        Save
      </Button>
    </SettingTwoLayout>
  );
}

export default Wallet;
