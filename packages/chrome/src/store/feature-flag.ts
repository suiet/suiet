import { createSlice } from '@reduxjs/toolkit';
import { FeatureFlagRes } from '../api';

export interface FeatureFlagState {
  flags: FeatureFlagRes | null;
}

const initialState: FeatureFlagState = {
  flags: null,
};

export const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,
  reducers: {
    updateFeatureFlag(state, action) {
      state.flags = action.payload;
    },
  },
});

export const { updateFeatureFlag } = featureFlagSlice.actions;
export default featureFlagSlice.reducer;
