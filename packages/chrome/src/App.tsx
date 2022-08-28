import React, {lazy, useEffect} from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import './App.css';
import {ToastContainer} from "react-toastify";
import './styles/react-toastify.scss';

import AppLayout from './pages/AppLayout';
import {withSus} from './components/TheSuspense';
import RequireAuth from "./components/RequireInit";
import {getWallets} from "./utils/mock";
import {isNonEmptyArray} from "./utils/check";
import {useDispatch, useSelector} from "react-redux";
import appContext, {updateInitialized} from "./store/app-context";
import RequireInit from "./components/RequireInit";
import {RootState} from "./store";

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
const LoginPage = lazy(() => import("./pages/LoginPage"));

function App() {
  const appContext = useSelector((state: RootState) => state.appContext)
  const dispatch = useDispatch();

  async function initStates() {
    const wallets = await getWallets();
    if (isNonEmptyArray(wallets)) {
      await dispatch(updateInitialized(true));
    }
  }

  useEffect(() => {
    initStates();
  }, [])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={
          <RequireInit>
            <RequireAuth>
              <AppLayout/>
            </RequireAuth>
          </RequireInit>
        }>
          <Route index element={<Navigate to="/home"/>}/>
          <Route path="home" element={withSus(<MainPage/>)}/>
          <Route path={'send'} element={withSus(<SendPage/>)} />
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
        <Route path={'login'} element={withSus(<LoginPage />)} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
