import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import appContextReducer from './app-context';
import walletReducer from './wallet';
import { ChromeStorage } from './persist-storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';

const persistConfig = {
  key: 'root',
  storage: new ChromeStorage(),
  whitelist: ['appContext, wallet'],
};

const allReducers = combineReducers({
  appContext: appContextReducer,
  wallet: walletReducer,
});

function createStore() {
  const store = configureStore({
    reducer: persistReducer(persistConfig, allReducers),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistorStore = persistStore(store);
  return { store, persistorStore };
}

export const { store, persistorStore } = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
