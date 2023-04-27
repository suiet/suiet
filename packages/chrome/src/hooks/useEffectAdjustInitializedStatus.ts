import { Wallet } from '@suiet/core';
import { isNonEmptyArray } from '../utils/check';
import {
  AppContextState,
  resetAppContext,
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateWalletId,
} from '../store/app-context';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useApiClient } from './useApiClient';
import { useFeatureFlags } from './useFeatureFlags';

/**
 * Detect indexeddb and redux state, make adjustment if there exists any mismatch
 * @param appContext
 */
export function useEffectAdjustInitializedStatus(appContext: AppContextState) {
  const dispatch = useDispatch<AppDispatch>();
  const apiClient = useApiClient();
  const featureFlags = useFeatureFlags();

  async function adjustInitializedStatus() {
    const wallets = await apiClient.callFunc<null, Wallet[]>(
      'wallet.getWallets',
      null
    );
    if (!isNonEmptyArray(wallets)) {
      // if no wallet
      if (appContext.initialized) {
        console.warn(
          'no wallets detected under initialized context, reset app'
        );
        await dispatch(resetAppContext());
      }
      return;
    }

    const [firstWallet] = wallets;
    if (!firstWallet?.id || !isNonEmptyArray(firstWallet?.accounts)) {
      console.warn('wallet account missing, data may be messed up, reset app');
      await dispatch(resetAppContext());
      return;
    }

    const [firstAccount] = firstWallet.accounts;
    // if wallet data is correct, but context data is not, re-initialize app
    if (!appContext.initialized) {
      // console.log('wallets detected, re-initialize app');
      // if db has data but context is incorrect, then update
      await dispatch(updateInitialized(true));
      await dispatch(updateWalletId(firstWallet.id));
      await dispatch(updateAccountId(firstAccount.id));
      await dispatch(
        updateNetworkId(featureFlags?.default_network ?? 'devnet')
      );
    }
  }

  // adjust init status by checking the wallets data
  useEffect(() => {
    adjustInitializedStatus();
  }, []);
}
