import { useRoutes } from 'react-router-dom';
import './App.scss';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tabs/style/react-tabs.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect, useMemo } from 'react';
import message from './components/message';
import { ToastContainer } from 'react-toastify';
import {
  ContextFeatureFlags,
  useAutoLoadFeatureFlags,
} from './hooks/useFeatureFlags';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { fieldPolicyForTransactions } from './pages/TransactionFlow/hooks/useTransactionListForHistory';
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

  const client = useMemo(() => {
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
    persistCache({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    });
    return new ApolloClient({
      uri: `https://${appContext.networkId}.suiet.app/query`,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-first',
          pollInterval: 1000 * 10,
        },
      },
      cache,
    });
  }, [appContext.networkId]);
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
