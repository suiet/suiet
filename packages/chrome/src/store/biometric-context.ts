import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BiometricContextState {
  biometricSetuped: boolean | undefined; // undefined for undetermined
  biometricDismissed: boolean;
}

const initialState: BiometricContextState = {
  biometricSetuped: undefined,
  biometricDismissed: false,
};

export const biometricContextSlice = createSlice({
  name: 'biometricContext',
  initialState,
  reducers: {
    updateBiometricSetuped(state, action: PayloadAction<boolean>) {
      state.biometricSetuped = action.payload;
    },
    updateBiometricDismissed(state, action: PayloadAction<boolean>) {
      state.biometricDismissed = action.payload;
    },
  },
});

export const { updateBiometricSetuped, updateBiometricDismissed } =
  biometricContextSlice.actions;

export default biometricContextSlice.reducer;
