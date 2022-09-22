import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { Wallet } from '@suiet/core';
import { isNonEmptyArray } from '../utils/check';
import {
  resetAppContext,
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateWalletId,
} from '../store/app-context';
import { useApiClient } from '../hooks/useApiClient';

function RequireInit({ children }: any) {
  const appContext = useSelector((state: RootState) => state.appContext);
  const dispatch = useDispatch<AppDispatch>();
  const apiClient = useApiClient();

  async function adjustInitializedStatus() {
    const wallets = await apiClient.callFunc<null, Wallet[]>(
      'wallet.getWallets',
      null
    );
    if (!isNonEmptyArray(wallets)) {
      if (appContext.initialized) {
        // no wallets, reset app
        await dispatch(resetAppContext());
      }
      return;
    }

    const [firstWallet] = wallets;
    if (!firstWallet?.id || !isNonEmptyArray(firstWallet?.accounts)) {
      // wallet account missing, data may be messed up, reset app
      await dispatch(resetAppContext());
      return;
    }

    const [firstAccount] = firstWallet.accounts;
    // if wallet data is correct, but context data is not, re-initialize app
    if (!appContext.initialized) {
      // if db has data but context is incorrect, then update
      await dispatch(updateInitialized(true));
      await dispatch(updateWalletId(firstWallet.id));
      await dispatch(updateAccountId(firstAccount.id));
      await dispatch(updateNetworkId('devnet'));
      return;
    }

    // if initialized, check essential context data
    if (!appContext.networkId) {
      await dispatch(updateNetworkId('devnet'));
    }
  }

  // adjust init status by checking the wallets data
  useEffect(() => {
    adjustInitializedStatus();
  }, []);

  return appContext.initialized ? (
    children
  ) : (
    <Navigate to={'/onboard'} replace />
  );
}

export default RequireInit;
