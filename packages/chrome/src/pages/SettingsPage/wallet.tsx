import './wallet.scss';
import './common.scss';
import classnames from 'classnames';
import Button from '../../components/Button';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coreApi } from '@suiet/core';
import { updateWallet } from '../../store/wallet';
import Avatar from '../../components/Avatar';

function Wallet() {
  const { context, wallet } = useSelector((state: RootState) => ({
    context: state.appContext,
    wallet: state.wallet,
  }));
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [avatar, setAvatar] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    setName(wallet.name);
    setAvatar(wallet.avatar || '1');
  }, [wallet.name, wallet.avatar]);

  return (
    <div className="wallet-setting-container">
      <div className="flex justify-end items-center h-14">
        <div className="setting-cancel" onClick={() => navigate('..')}></div>
      </div>
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
        onChange={(v) => setName(v.target.value)}
      />
      <div className="flex flex-col gap-2 mt-2 absolute bottom-12 w-full px-8 left-0">
        <Button
          state="primary"
          onClick={async () => {
            try {
              dispatch(
                updateWallet({
                  avatar,
                  name,
                })
              );
              await coreApi.wallet.updateWallet(
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
      </div>
    </div>
  );
}

export default Wallet;
