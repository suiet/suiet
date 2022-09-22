import './wallet.scss';
import './common.scss';
import classnames from 'classnames';
import Button from '../../components/Button';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import message from '../../components/message';
import { useWallet } from '../../hooks/useWallet';
import Nav from './nav';

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
    <div className="wallet-setting-container">
      <Nav />
      <div className="setting-title">Edit Wallet</div>
      <div className="setting-desc">Manage your wallet informations here.</div>
      <div
        className="wallet-item-title"
        style={{
          marginTop: 36,
        }}
      >
        Icon
      </div>
      <div className="flex gap-4 mb-4">
        {[1, 2, 3, 4].map((num) => {
          return (
            <div
              key={num}
              onClick={() => setAvatar(num.toString())}
              className={classnames('wallet-avatar-container', {
                active: num.toString() === avatar,
              })}
            >
              <Avatar model={num} />
              <div className="wallet-check" />
            </div>
          );
        })}
      </div>
      <div className="wallet-item-title">Name</div>
      <input
        className="wallet-name-input"
        value={name}
        onChange={(v) => {
          setName(v.target.value);
        }}
      />
      <div className="flex flex-col gap-2 mt-2 absolute bottom-12 w-full px-8 left-0">
        <Button state="primary" onClick={updateWalletInfo}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default Wallet;
