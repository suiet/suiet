import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BiometricContextState {
  biometricSetuped: boolean | undefined; // undefined for undetermined
}

const initialState: BiometricContextState = {
  biometricSetuped: undefined,
};

export const biometricContextSlice = createSlice({
  name: 'biometricContext',
  initialState,
  reducers: {
    updateBiometricSetuped(state, action: PayloadAction<boolean>) {
      state.biometricSetuped = action.payload;
    },
  },
});

export const { updateBiometricSetuped } = biometricContextSlice.actions;

export default biometricContextSlice.reducer;
