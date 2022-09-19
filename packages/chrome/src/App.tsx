import { useRoutes } from 'react-router-dom';
import './App.css';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tabs/style/react-tabs.css';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import message from './components/message';
import { ToastContainer } from 'react-toastify';

function App() {
  const routes = useRoutes(routesConfig);

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

  return (
    <div className="app">
      <ErrorBoundary>
        {routes}
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
