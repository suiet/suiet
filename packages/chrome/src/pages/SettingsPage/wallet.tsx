import './wallet.scss';
import './common.scss';
import classnames from 'classnames';
import Button from '../../components/Button';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { avatarMap } from '../../constants/avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coreApi } from '@suiet/core';
import { useWallet } from '../../hooks/useWallet';

function Wallet() {
  const context = useSelector((state: RootState) => state.appContext);
  const { wallet } = useWallet(context.walletId);
  const [name, setName] = useState('');

  const [avatar, setAvatar] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    setName(wallet.name);
    setAvatar(wallet.avatar || '1');
  }, [wallet.name, wallet.avatar]);

  return (
    <div className="wallet-setting-container">
      <div className="setting-title">wallet</div>
      <div className="setting-desc">Manage your wallet informations here.</div>
      <div
        className="wallet-item-title"
        style={{
          marginTop: 27,
        }}
      >
        icon
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
              <img src={avatarMap[num]} />
              <div className="wallet-check" />
            </div>
          );
        })}
      </div>
      <div className="wallet-item-title">Name</div>
      <input
        className="wallet-name-input"
        value={name}
        onChange={(v) => setName(v.target.value)}
      />
      <div className="flex flex-col gap-2 mt-2">
        <Button
          state="primary"
          onClick={async () => {
            try {
              await coreApi.updateWallet(
                context.walletId,
                {
                  name,
                  avatar,
                },
                context.token
              );
              navigate('..');
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Save
        </Button>
        <Button
          onClick={() => {
            navigate('..');
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default Wallet;
