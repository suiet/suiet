import { useRoutes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import routesConfig from './routes';
import './styles/react-toastify.scss';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  const routes = useRoutes(routesConfig);

  return (
    <div className="app">
      {routes}
      <ToastContainer />
    </div>
  );
}

export default App;
