import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { coreApi, Wallet } from '@suiet/core';
import { isNonEmptyArray } from '../utils/check';
import {
  resetAppContext,
  updateAccountId,
  updateInitialized,
  updateNetworkId,
  updateWalletId,
} from '../store/app-context';
import { apiClient } from '../App';

function RequireInit({ children }: any) {
  const initialized = useSelector(
    (state: RootState) => state.appContext.initialized
  );
  const dispatch = useDispatch<AppDispatch>();

  async function adjustInitializedStatus() {
    const wallets = await apiClient.callFunc<null, Wallet[]>(
      'wallet.getWallets',
      null
    );
    if (!isNonEmptyArray(wallets)) {
      if (initialized) {
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
    const [firstAccountId] = firstWallet.accounts;
    // if wallet data is correct, but context data is not, re-initialize app
    if (!initialized) {
      // if db has data but context is incorrect, then update
      await dispatch(updateInitialized(true));
      await dispatch(updateWalletId(firstWallet.id));
      await dispatch(updateAccountId(firstAccountId));
      await dispatch(updateNetworkId('devnet'));
    }
  }

  // adjust init status by checking the wallets data
  useEffect(() => {
    adjustInitializedStatus();
  }, []);

  return initialized ? children : <Navigate to={'/onboard'} replace />;
}

export default RequireInit;
