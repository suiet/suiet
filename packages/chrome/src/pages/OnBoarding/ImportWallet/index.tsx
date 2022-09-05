import { useNavigate } from 'react-router-dom';
import { coreApi } from '@suiet/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useState } from 'react';
import SetPassword from '../SetPassword';
import ImportPhrase from '../ImportPhrase';
import { isNonEmptyArray } from '../../../utils/check';
import message from '../../../components/message';
import {
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateToken,
  updateWalletId,
} from '../../../store/app-context';
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
      token,
      mnemonic,
    });
    const accounts = await coreApi.account.getAccounts(wallet.id);
    if (!isNonEmptyArray(accounts)) {
      message.error('Cannot find any account');
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));

    message.success('Wallet Created!');
  }

  async function handleImport(_secret: string) {
    // TODO: check duplicated wallet
    if (pageEntry === PageEntry.SWITCHER && appContext.token) {
      // already has token
      await createWalletAndAccount(appContext.token, _secret);
      await dispatch(updateNetworkId('devnet'));
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
        return <ImportPhrase phrases={secret} onImported={handleImport} />;
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
