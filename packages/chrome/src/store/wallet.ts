import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WalletState {
  avatar: string;
  name: string;
}

const initialState: WalletState = {
  avatar: '',
  name: '',
};
export const walletStateSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateWallet(state, action: PayloadAction<WalletState>) {
      state.avatar = action.payload.avatar;
      state.name = action.payload.name;
    },
  },
});

export const { updateWallet } = walletStateSlice.actions;

export default walletStateSlice.reducer;
