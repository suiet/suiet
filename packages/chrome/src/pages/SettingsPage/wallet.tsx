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
import { Icon, IconContainer } from '../../components/icons';
import { ReactComponent as IconCheck } from '../../assets/icons/check.svg';
import { ReactComponent as IconNotCheck } from '../../assets/icons/not-check.svg';
import Typo from '../../components/Typo';
import Address from '../../components/Address';

function Wallet() {
  const appContext = useSelector((state: RootState) => state.appContext);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('1');
  const navigate = useNavigate();
  const { data: wallet, updateWallet } = useWallet(appContext.walletId);

  async function updateWalletInfo() {
    try {
      await updateWallet(appContext.walletId, {
        name: name.trim(),
        avatar,
      });
    } catch (err: any) {
      if (err?.message.includes('duplicate')) {
        message.error('Wallet name already exists, please try another one');
        return;
      }
      message.error('Failed to update wallet');
      console.error(err);
      return;
    }
    message.success(`Updated Wallet: ${name}`);
    navigate('..');
  }

  useEffect(() => {
    if (!wallet) return;
    setName(wallet.name ?? '');
    setAvatar(wallet.avatar ?? '1');
  }, [wallet]);

  const renderNftAvatarManagement = () => {
    if (wallet?.avatarPfp && wallet?.avatarPfp.objectId) {
      return (
        <div className={'flex items-center'}>
          <IconContainer
            shape={'circle'}
            className={'w-[56px] h-[56px]'}
            color={'transparent'}
          >
            <Icon
              icon={wallet.avatarPfp.uri}
              elClassName={'!w-[56px] !h-[56px]'}
            />
          </IconContainer>

          <div className={'flex-1 mx-[16px]'}>
            {wallet.avatarPfp.name ? (
              <Typo.Normal className={'text-gray-700 text-[14px]'}>
                {wallet.avatarPfp.name}
              </Typo.Normal>
            ) : (
              <Address value={wallet.avatarPfp.objectId} />
            )}
            <Typo.Small
              className={'text-gray-400 text-small'}
            >{`Using now`}</Typo.Small>
          </div>

          <Button
            state={'solid'}
            className={'w-[80px] h-[32px] text-small'}
            onClick={() => {
              navigate('/nft');
            }}
          >
            Change
          </Button>
        </div>
      );
    }
    return (
      <Button
        state={'solid'}
        onClick={() => {
          navigate('/nft');
        }}
      >
        Explore your NFTs to set PFP
      </Button>
    );
  };

  return (
    <SettingTwoLayout
      title={'Edit Wallet'}
      desc={'Manage your wallet information.'}
    >
      <Nav
        position={'absolute'}
        onNavBack={() => {
          navigate('..');
        }}
      />
      <main className={'mb-[64px]'}>
        <section>
          <h1 className={classnames(styles['title-1'], 'mt-[36px]')}>
            Profile Picture
          </h1>
          <div>
            <h2 className={classnames(styles['title-2'], 'mt-[16px]')}>
              from your NFTs
            </h2>
          </div>
          <div className={'mt-[8px]'}>{renderNftAvatarManagement()}</div>
          <h2 className={classnames(styles['title-2'], 'mt-[16px]')}>
            from default icon
          </h2>
          <div className="flex justify-between items-center mt-[6px]">
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
        </section>

        <section>
          <h1 className={classnames(styles['title-1'], 'mt-[32px]')}>
            Wallet Name
          </h1>
          <Input
            value={name}
            onChange={(v) => {
              setName(v.target.value);
            }}
            className={'mt-[6px]'}
          />
        </section>
      </main>
      <footer
        className={
          'fixed bottom-0 left-0 right-0 p-[16px] border-t-[1px] bg-white'
        }
      >
        <Button state="primary" onClick={updateWalletInfo}>
          Save
        </Button>
      </footer>
    </SettingTwoLayout>
  );
}

export default Wallet;
