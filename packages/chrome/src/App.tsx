import { useRoutes } from 'react-router-dom';
import './App.scss';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tabs/style/react-tabs.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect, useState, useRef } from 'react';
import message from './components/message';
import { ToastContainer } from 'react-toastify';
import {
  ContextFeatureFlags,
  useAutoLoadFeatureFlags,
} from './hooks/useFeatureFlags';
import { CachePersistor, AsyncStorageWrapper } from 'apollo3-cache-persist';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { setContext } from 'apollo-link-context';
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { fieldPolicyForTransactions } from './pages/txn/TxHistoryPage/hooks/useTxnHistoryList';
import { ChromeStorage } from './store/storage';
import { version } from '../package.json';
import VersionGuard from './components/VersionGuard';
import { RetryLink } from '@apollo/client/link/retry';
import { ErrorCode } from './scripts/background/errors';
import { useCustomApolloClient } from './hooks/useCustomApolloClient';

function useRegisterHandleRejectionEvent() {
  useEffect(() => {
    const handleError = (event: PromiseRejectionEvent) => {
      console.error('catch unhandledrejection:', event);
      event.promise.catch((e) => {
        if (e.message.includes(ErrorCode.NO_AUTH)) {
          message.info('Session expired, please login again');
          return;
        }
        message.error(e.message);
      });
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
}

function App() {
  const routes = useRoutes(routesConfig);
  const featureFlags = useAutoLoadFeatureFlags();
  const appContext = useSelector((state: RootState) => state.appContext);
  const client = useCustomApolloClient(
    appContext.networkId,
    'suiet-desktop-extension',
    version,
    new ChromeStorage()
  );

  useRegisterHandleRejectionEvent();

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <div className="app">
      <ErrorBoundary>
        <ContextFeatureFlags.Provider value={featureFlags}>
          <VersionGuard>
            <ApolloProvider client={client}>{routes}</ApolloProvider>
          </VersionGuard>
        </ContextFeatureFlags.Provider>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
