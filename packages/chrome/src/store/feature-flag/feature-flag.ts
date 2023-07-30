import { createSlice } from '@reduxjs/toolkit';
import { FeatureFlagRes } from '../../api';
import defaultFeatureFlags from './default-feature-flags.json';

export interface FeatureFlagState {
  flags: FeatureFlagRes | null;
}

const initialState: FeatureFlagState = {
  flags: defaultFeatureFlags,
};

export const featureFlagSlice = createSlice({
  name: 'featureFlag',
  initialState,
  reducers: {
    updateFeatureFlag(state, action) {
      // overwrite logics
      state.flags = Object.assign(
        {},
        defaultFeatureFlags,
        state.flags,
        action.payload
      );
    },
  },
});

export const { updateFeatureFlag } = featureFlagSlice.actions;
export default featureFlagSlice.reducer;
