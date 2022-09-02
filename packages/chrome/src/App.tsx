import React from 'react';
import { useRoutes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import './styles/react-toastify.scss';
import routesConfig from './routes';

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
