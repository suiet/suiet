import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface AppContextState {
  initialized: boolean;
  token: string;
  walletId: string;
  accountId: string;
  networkId: string;
}

const initialState: AppContextState = {
  initialized: false,
  token: '',
  walletId: "",
  accountId: "",
  networkId: "",
}

// thunks
export const resetAppContext = createAsyncThunk('appContext/reset',
  async (_, thunkApi) => {
    console.log('thunk api called')
    await thunkApi.dispatch(updateInitialized(false));
    await thunkApi.dispatch(updateToken(''));
    // db clear
  }
)

export const appContextSlice = createSlice({
  name: 'appContext',
  initialState,
  reducers: {
    updateInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    updateWalletId(state, action: PayloadAction<string>) {
      state.walletId = action.payload;
    },
    updateAccountId(state, action: PayloadAction<string>) {
      state.accountId = action.payload;
    },
    updateNetworkId(state, action: PayloadAction<string>) {
      state.networkId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppContext.fulfilled, () => {});
  }
})

export const {
  updateInitialized,
  updateToken,
  updateWalletId,
  updateAccountId,
  updateNetworkId,
} = appContextSlice.actions;

export default appContextSlice.reducer;