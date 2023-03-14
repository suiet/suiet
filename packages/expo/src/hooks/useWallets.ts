import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet /* WalletManager */ } from '@/utils/wallet';
import { AppDispatch, RootState } from '../store';
import { updateWallets, updateSelectedWallet } from '../store/reducers/appContext';

export function useWallets() {
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector((state: RootState) => typeof state.appContext.wallets === 'undefined');
  const isEmpty = useSelector((state: RootState) => state.appContext.wallets?.[0] === undefined);

  const { wallets, selectedWallet } = useSelector((state: RootState) => state.appContext);

  return {
    isLoading,
    isEmpty,

    wallets,
    selectedWallet,

    // loadWallets,
    // putWallet,
    // removeWallet,

    updateWallets: (wallets: Wallet[]) => {
      // const walletsByAddress = {} as Record<string, Wallet>;
      // wallets.forEach((wallet) => {
      //   walletsByAddress[wallet.address] = wallet;
      // });
      // dispatch(updateWallets(Object.values(walletsByAddress)));

      dispatch(updateWallets(wallets));
    },

    updateSelectedWallet: (address: string) => {
      dispatch(updateSelectedWallet(address));
    },
  };
}
