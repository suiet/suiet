import { useRoutes } from 'react-router-dom';
import './App.scss';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tabs/style/react-tabs.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect, useMemo, useState, useCallback } from 'react';
import message from './components/message';
import { ToastContainer } from 'react-toastify';
import {
  ContextFeatureFlags,
  useAutoLoadFeatureFlags,
} from './hooks/useFeatureFlags';
import {
  persistCache,
  LocalStorageWrapper,
  CachePersistor,
} from 'apollo3-cache-persist';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { fieldPolicyForTransactions } from './pages/TransactionFlow/hooks/useTransactionListForHistory';
import { sha256 } from 'crypto-hash';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
function App() {
  const routes = useRoutes(routesConfig);
  const featureFlags = useAutoLoadFeatureFlags();
  const appContext = useSelector((state: RootState) => state.appContext);
  useEffect(() => {
    const handleError = (event: PromiseRejectionEvent) => {
      console.error('catch unhandledrejection:', event);
      event.promise.catch((e) => {
        message.error(e.message);
      });
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', handleError);
    return () => {
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const [persistor, setPersistor] =
    useState<CachePersistor<NormalizedCacheObject>>();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  useEffect(() => {
    clearCache();
    async function init() {
      const cache = new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              ...fieldPolicyForTransactions(),
            },
          },
        },
      });

      // fixme: should await?
      // await before instantiating ApolloClient, else queries might run before the cache is persisted
      // await persistCache({
      //   cache,
      //   storage: new LocalStorageWrapper(window.localStorage),
      // });

      const newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        debug: true,
        trigger: 'write',
      });
      await newPersistor.restore();
      setPersistor(newPersistor);

      setClient(
        new ApolloClient({
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'cache-first',
              pollInterval: 1000 * 5,
            },
          },
          cache,
          link: createPersistedQueryLink({ sha256 }).concat(
            new HttpLink({
              uri: `https://${appContext.networkId}.suiet.app/query`,
            })
          ),
        })
      );
    }
    init();
  }, [appContext.networkId]);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <div className="app">
      <ErrorBoundary>
        <ContextFeatureFlags.Provider value={featureFlags}>
          <ApolloProvider client={client}>{routes}</ApolloProvider>
        </ContextFeatureFlags.Provider>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
