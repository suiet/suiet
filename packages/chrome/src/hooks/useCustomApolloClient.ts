import { useEffect, useState, useRef } from 'react';
import { CachePersistor, AsyncStorageWrapper } from 'apollo3-cache-persist';
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { fieldPolicyForTransactions } from '../pages/txn/TxHistoryPage/hooks/useTxnHistoryList';
import { RetryLink } from '@apollo/client/link/retry';
import { WebStorage } from '../store/storage';
export enum CacheSyncStatus {
  NOT_SYNCED,
  SYNCING,
  SYNCED,
}

export function useCustomApolloClient(
  networkId: string,
  clientType: string,
  clientVersion: string,
  storage: WebStorage
) {
  const cacheSyncStatus = useRef<number>(CacheSyncStatus.NOT_SYNCED);
  const cacheInChromeStorage = useRef(new AsyncStorageWrapper(storage));
  const cachePersistor = useRef<CachePersistor<NormalizedCacheObject>>();
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 5,
      retryIf: (error, _operation) => !!error,
    },
  });
  const headerLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    operation.setContext({
      headers: {
        'x-suiet-client-type': clientType,
        'x-suiet-client-version': clientVersion,
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
          retryLink,
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
        retryLink,
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
