import React, {createContext, lazy, useEffect, useState} from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import {ToastContainer} from "react-toastify";
import './styles/react-toastify.scss';

import AppLayout from './components/AppLayout';
import {withSus} from './components/TheSuspense';
import {fetchPassword} from "./utils/auth";

const MainPage = lazy(() => import('./pages/MainPage'));
const WelcomePage = lazy(() => import('./pages/OnBoarding/Welcome'));
const SettingPage = lazy(() => import('./pages/SettingsPage'));
const SendPage = lazy(() => import('./pages/SendPage'));
const TransacationFlowPage = lazy(() => import('./pages/TransactionFlow'));
const TransacationDetail = lazy(
  () => import('./pages/TransactionFlow/transactionDetail')
);
const CreateNewWallet = lazy(() => import("./pages/OnBoarding/CreateNewWallet"));
const ImportWallet = lazy(() => import("./pages/OnBoarding/ImportWallet"));

export interface AppContextParams {
  password: string;
  setPassword: (val: string) => void;
}

export const AppContext = createContext<AppContextParams>({
  password: '',
  setPassword: () => {},
});

function App() {
  const navigate = useNavigate();
  const [appContext, setAppContext] = useState({
    password: '',
    setPassword,
  })

  function setPassword(value: string) {
    setAppContext((state) => ({
      ...state,
      password: value,
    }))
  }

  async function loadPassword() {
    const password = await fetchPassword();
    if (password) {
      setPassword(password);
    }
  }

  useEffect(() => {
    (async function () {
      await loadPassword();
    })();
  }, [])

  return (
    <AppContext.Provider value={appContext}>
      <div className="app">
        <Routes>
          <Route path="/" element={<AppLayout/>}>
            <Route index element={<Navigate to="/home"/>}/>
            <Route path="home" element={withSus(<MainPage/>)}/>
            <Route path={'send'} element={withSus(<SendPage/>)}/>
            <Route
              path="transaction/flow"
              element={withSus(<TransacationFlowPage/>)}
            />
            <Route
              path="transaction/detail/:id"
              element={withSus(<TransacationDetail/>)}
            />
            <Route path="settings/*" element={withSus(<SettingPage/>)}/>
          </Route>
          <Route path={'onboard'}>
            <Route index element={<Navigate to="/onboard/welcome"/>}/>
            <Route path="welcome" element={withSus(<WelcomePage />)}/>
            <Route path="create-new-wallet" element={withSus(<CreateNewWallet />)}/>
            <Route path="import-wallet" element={withSus(<ImportWallet />)}/>
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </AppContext.Provider>
  );
}

export default App;
