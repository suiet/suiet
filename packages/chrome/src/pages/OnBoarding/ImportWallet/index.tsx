import { useNavigate } from 'react-router-dom';
import { coreApi } from '@suiet/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useState } from 'react';
import SetPassword from '../SetPassword';
import ImportPhrase from '../ImportPhrase';
import { isNonEmptyArray } from '../../../utils/check';
import toast from '../../../components/toast';
import {
  updateAccountId,
  updateInitialized,
  updateToken,
  updateWalletId,
} from '../../../store/app-context';
import { updateWallet } from '../../../store/wallet';
import { PageEntry, usePageEntry } from '../../../hooks/usePageEntry';
import Nav from '../../../components/Nav';

const ImportWallet = () => {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const appContext = useSelector((state: RootState) => state.appContext);
  const pageEntry = usePageEntry();

  async function createWalletAndAccount(token: string, mnemonic: string) {
    const wallet = await coreApi.wallet.createWallet({
      token: token,
      mnemonic: mnemonic,
    });
    const accounts = await coreApi.account.getAccounts(wallet.id);
    if (!isNonEmptyArray(accounts)) {
      toast.success('Cannot find any account');
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];
    dispatch(
      updateWallet({
        avatar: wallet.avatar || '1',
        name: wallet.name,
      })
    );
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));

    toast.success('Wallet Created!');
  }

  async function handleImport(_secret: string) {
    // TODO: check duplicated wallet
    if (pageEntry === PageEntry.SWITCHER && appContext.token) {
      // already has token
      await createWalletAndAccount(appContext.token, _secret);
      navigate('/', {
        state: { openSwitcher: true }, // open the wallet switcher
      });
      return;
    }

    // first time to import
    setSecret(_secret);
    setStep(2);
  }

  async function handleSetPassword(password: string) {
    await coreApi.auth.updatePassword(null, password);
    const token = await coreApi.auth.loadTokenWithPassword(password);
    await createWalletAndAccount(token, secret);
    await dispatch(updateToken(token));
    await dispatch(updateInitialized(true));
    navigate('/');
  }

  function renderContent() {
    switch (step) {
      case 2:
        return <SetPassword onNext={handleSetPassword} />;
      default:
        return <ImportPhrase onImported={handleImport} />;
    }
  }
  return (
    <div>
      <Nav
        title={'Import Wallet'}
        onNavBack={() => {
          if (step > 1) {
            setStep((step) => step - 1);
            return;
          }
          if (pageEntry === PageEntry.SWITCHER) {
            navigate('/', {
              state: { openSwitcher: true }, // open the wallet switcher
            });
            return;
          }
          navigate('/onboard/welcome');
        }}
      />
      {renderContent()}
    </div>
  );
};

export default ImportWallet;
