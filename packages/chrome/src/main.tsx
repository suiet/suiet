// shim should comes before any other import
import './utils/setup-buffer-shim';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.scss';
import { Provider } from 'react-redux';
import { persistorStore, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { ApiClientContext } from './hooks/useApiClient';
import { BackgroundApiClient } from './scripts/shared/ui-api-client';
import { QueryClient, QueryClientProvider } from 'react-query';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistorStore}>
          <QueryClientProvider client={new QueryClient()}>
            <ApiClientContext.Provider value={new BackgroundApiClient()}>
              <App />
            </ApiClientContext.Provider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
