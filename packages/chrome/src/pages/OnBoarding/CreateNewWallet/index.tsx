import SetPassword from '../SetPassword';
import SavePhrase from '../SavePhrase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateToken,
  updateWalletId,
} from '../../../store/app-context';
import { isNonEmptyArray } from '../../../utils/check';
import message from '../../../components/message';
import { coreApi } from '@suiet/core';
import { AppDispatch, RootState } from '../../../store';
import { PageEntry, usePageEntry } from '../../../hooks/usePageEntry';
import Nav from '../../../components/Nav';

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const [phrases, setPhrases] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const appContext = useSelector((state: RootState) => state.appContext);
  const pageEntry = usePageEntry();

  async function createWalletAndAccount(token: string) {
    const wallet = await coreApi.wallet.createWallet({
      token,
    });

    const rawPhrases = await coreApi.wallet.revealMnemonic(wallet.id, token);
    setPhrases(rawPhrases.split(' '));

    const accounts = await coreApi.account.getAccounts(wallet.id);
    if (!isNonEmptyArray(accounts)) {
      message.success('Cannot find any account');
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];

    await dispatch(updateToken(token));
    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));
    await dispatch(updateNetworkId('devnet'));
    await dispatch(updateInitialized(true));
  }

  async function handleSetPassword(password: string) {
    await coreApi.auth.updatePassword(null, password);
    const token = await coreApi.auth.loadTokenWithPassword(password);

    await createWalletAndAccount(token);
    setStep((s) => s + 1);
  }

  async function handleSavePhrase() {
    if (pageEntry === PageEntry.SWITCHER) {
      navigate('/home', { state: { openSwitcher: true } });
      return;
    }
    navigate('/home');
  }

  async function handleCreateFromSwitcher(token: string) {
    if (!token) throw new Error('token should not be empty');

    await createWalletAndAccount(token);
    setStep((s) => s + 1);
  }

  // detect if coming from other entry
  useEffect(() => {
    if (pageEntry === PageEntry.SWITCHER) {
      handleCreateFromSwitcher(appContext.token);
    }
  }, [pageEntry]);

  function renderContent() {
    switch (step) {
      case 2:
        return <SavePhrase phrases={phrases} onNext={handleSavePhrase} />;
      default:
        return <SetPassword onNext={handleSetPassword} />;
    }
  }

  function handleNavBack() {
    if (pageEntry === PageEntry.SWITCHER) {
      navigate('/', {
        state: { openSwitcher: true }, // open the wallet switcher
      });
      return;
    }
    if (step > 1) {
      setStep((step) => step - 1);
      return;
    }
    navigate('/onboard/welcome');
  }

  return (
    <div>
      <Nav
        title={'New Wallet'}
        navDisabled={step === 2}
        onNavBack={handleNavBack}
      />
      {renderContent()}
    </div>
  );
};

export default CreateNewWallet;
