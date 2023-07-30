import { useRoutes } from 'react-router-dom';
import './App.scss';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tabs/style/react-tabs.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import message from './components/message';
import { ToastContainer } from 'react-toastify';
import { useAutoLoadFeatureFlags } from './hooks/useFeatureFlags';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { ApolloProvider } from '@apollo/client';
import { ChromeStorage } from './store/storage';
import { version } from '../package.json';
import VersionGuard from './components/VersionGuard';
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
  const appContext = useSelector((state: RootState) => state.appContext);
  useRegisterHandleRejectionEvent();
  useAutoLoadFeatureFlags();
  const client = useCustomApolloClient(
    appContext.networkId,
    'suiet-desktop-extension',
    version,
    new ChromeStorage()
  );

  if (!client) {
    return <h2>Initializing app...</h2>;
  }
  return (
    <div className="app">
      <ErrorBoundary>
        <VersionGuard>
          <ApolloProvider client={client}>{routes}</ApolloProvider>
        </VersionGuard>
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
