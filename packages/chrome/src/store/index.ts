import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appContextReducer from './app-context';
import biometricContextReducer from './biometric-context';
import { Storage } from './storage';
import { persistReducer, persistStore } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist/es/constants';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['appContext', 'wallet'],
};

const allReducers = combineReducers({
  appContext: appContextReducer,
  biometricContext: biometricContextReducer,
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
