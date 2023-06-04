import { useEffect, useRef, useState } from 'react';
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
import styles from './index.module.scss';
import SavePhraseView from './views/SavePhraseView';
import { useAsyncEffect } from 'ahooks';

// enum Step {
//   DISPLAY_PHRASE = 1,
// }

const CreateNewWallet = () => {
  // const [step, setStep] = useState(Step.DISPLAY_PHRASE);
  const [phrases, setPhrases] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const pageEntry = usePageEntry();
  const apiClient = useApiClient();
  const featureFlags = useFeatureFlags();
  const isCreating = useRef(false);

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
    await dispatch(updateNetworkId(featureFlags?.default_network ?? 'mainnet'));
    await dispatch(updateInitialized(true));
  }

  async function handleSavePhrase() {
    message.success('Wallet Created!');
    if (pageEntry === PageEntry.SWITCHER) {
      navigate('/home', { state: { openSwitcher: true } });
      return;
    }
    navigate('/home');
  }

  useAsyncEffect(async () => {
    if (isCreating.current) return;

    isCreating.current = true;
    await createWalletAndAccount();
  }, []);

  return (
    <div className={styles['page']}>
      <Nav title={'Create New'} navDisabled={true} />
      <SavePhraseView phrases={phrases} onNext={handleSavePhrase} />
    </div>
  );
};

export default CreateNewWallet;
