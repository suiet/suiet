import { Wallet } from '@/utils/wallet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppContext {
  wallets: Wallet[];
  selectedWallet: string | undefined; // undefined for undetermined
  networkId: string | undefined; // undefined for undetermined
}

const initialState: AppContext = {
  wallets: [],
  selectedWallet: undefined,
  networkId: undefined,
};

export const appContextSlice = createSlice({
  name: 'appContext',
  initialState,
  reducers: {
    updateWallets(state, action: PayloadAction<Wallet[]>) {
      state.wallets = action.payload;
    },
    updateSelectedWallet(state, action: PayloadAction<string>) {
      state.selectedWallet = action.payload;
    },
    updateNetworkId(state, action: PayloadAction<string>) {
      state.networkId = action.payload;
    },
  },
});

export const { updateWallets, updateSelectedWallet, updateNetworkId } = appContextSlice.actions;

export default appContextSlice.reducer;
