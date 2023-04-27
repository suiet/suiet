import SetPassword from '../SetPassword';
import SavePhrase from '../SavePhrase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateWalletId,
} from '../../../store/app-context';
import { isNonEmptyArray } from '../../../utils/check';
import message from '../../../components/message';
import {
  Account,
  CreateWalletParams,
  RevealMnemonicParams,
  Wallet,
} from '@suiet/core';
import { AppDispatch } from '../../../store';
import { PageEntry, usePageEntry } from '../../../hooks/usePageEntry';
import Nav from '../../../components/Nav';
import { useApiClient } from '../../../hooks/useApiClient';
import { sleep } from '../../../utils/time';
import { OmitToken } from '../../../types';
import { useFeatureFlags } from '../../../hooks/useFeatureFlags';

const CreateNewWallet = () => {
  const [step, setStep] = useState(1);
  const [phrases, setPhrases] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const pageEntry = usePageEntry();
  const apiClient = useApiClient();
  const featureFlags = useFeatureFlags();

  async function createWalletAndAccount() {
    const wallet = await apiClient.callFunc<
      OmitToken<CreateWalletParams>,
      Wallet
    >('wallet.createWallet', {}, { withAuth: true });

    const rawPhrases = await apiClient.callFunc<
      OmitToken<RevealMnemonicParams>,
      string
    >(
      'wallet.revealMnemonic',
      {
        walletId: wallet.id,
      },
      { withAuth: true }
    );
    setPhrases(rawPhrases.split(' '));

    const accounts = await apiClient.callFunc<string, Account[]>(
      'account.getAccounts',
      wallet.id
    );
    if (!isNonEmptyArray(accounts)) {
      message.success('Cannot find any account');
      throw new Error('Cannot find any account');
    }
    const defaultAccount = accounts[0];

    await dispatch(updateWalletId(wallet.id));
    await dispatch(updateAccountId(defaultAccount.id));
    await dispatch(updateNetworkId(featureFlags?.default_network ?? 'devnet'));
    await dispatch(updateInitialized(true));
  }

  async function handleSetPassword(password: string) {
    await apiClient.callFunc<string, undefined>('auth.initPassword', password);
    await createWalletAndAccount();
    setStep((s) => s + 1);
  }

  async function handleSavePhrase() {
    message.success('Wallet Created!');
    if (pageEntry === PageEntry.SWITCHER) {
      await sleep(300); // wait for wallet created
      navigate('/home', { state: { openSwitcher: true } });
      return;
    }
    navigate('/home');
  }

  async function handleCreateFromSwitcher() {
    await createWalletAndAccount();
    setStep((s) => s + 1);
  }

  // detect if coming from other entry
  useEffect(() => {
    if (pageEntry === PageEntry.SWITCHER) {
      handleCreateFromSwitcher();
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
