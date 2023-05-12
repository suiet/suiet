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
enum CacheSyncStatus {
  NOT_SYNCED,
  SYNCING,
  SYNCED,
}

function useCustomApolloClient(networkId: string) {
  const cacheSyncStatus = useRef<number>(CacheSyncStatus.NOT_SYNCED);
  const cacheInChromeStorage = useRef(
    new AsyncStorageWrapper(new ChromeStorage())
  );
  const cachePersistor = useRef<CachePersistor<NormalizedCacheObject>>();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const headerLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        'x-suiet-client-type': 'suiet-desktop-extension',
        'x-suiet-client-version': version,
      },
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });
  useEffect(() => {
    if (cacheSyncStatus.current !== CacheSyncStatus.NOT_SYNCED) return;

    async function initApolloClient() {
      cacheSyncStatus.current = CacheSyncStatus.SYNCING;

      const cache = new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              ...fieldPolicyForTransactions(),
            },
          },
        },
      });
      cachePersistor.current = new CachePersistor<NormalizedCacheObject>({
        cache,
        storage: cacheInChromeStorage.current,
        trigger: false, // manually trigger persisting
      });
      // sync cache from chrome storage
      await cachePersistor.current.restore();
      // cachePersistor.current.getSize().then((size) => {
      //   console.log('cache restore size: ', size);
      // });

      const newClient = new ApolloClient({
        cache,
        link: from([
          headerLink,
          new HttpLink({
            uri: `https://${networkId}.suiet.app/query`,
          }),
        ]),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-first',
            pollInterval: 3 * 1000,
          },
        },
      });
      setClient(newClient);
      cacheSyncStatus.current = CacheSyncStatus.SYNCED;
    }

    initApolloClient();
  }, []);

  useEffect(() => {
    if (!client || !networkId) return; // sequentially set client after cache is ready

    client.setLink(
      from([
        headerLink,
        new HttpLink({
          uri: `https://${networkId}.suiet.app/query`,
        }),
      ])
    );
    client.resetStore(); // only reset memory cache
  }, [networkId, client]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!cachePersistor.current) return;
      // manually trigger persisting, avoid memory cache reset to clear storage cache
      // then the next cold starting phase would be faster
      cachePersistor.current.persist();
    }, 5 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return client;
}

function useRegisterHandleRejectionEvent() {
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
}

function App() {
  const routes = useRoutes(routesConfig);
  const featureFlags = useAutoLoadFeatureFlags();
  const appContext = useSelector((state: RootState) => state.appContext);
  const client = useCustomApolloClient(appContext.networkId);
  useRegisterHandleRejectionEvent();

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
