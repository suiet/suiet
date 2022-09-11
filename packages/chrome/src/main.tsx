import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { persistorStore, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { SWRConfig } from 'swr';
import { swrConfig } from './configs/swr';
import { ApiClientContext } from './hooks/useApiClient';
import { BackgroundApiClient } from './scripts/shared/ui-api-client';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MemoryRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistorStore}>
          <SWRConfig value={swrConfig}>
            <ApiClientContext.Provider value={new BackgroundApiClient()}>
              <App />
            </ApiClientContext.Provider>
          </SWRConfig>
        </PersistGate>
      </Provider>
    </MemoryRouter>
  </React.StrictMode>
);
