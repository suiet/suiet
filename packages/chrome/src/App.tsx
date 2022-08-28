import React, {lazy} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import './App.css';
import {ToastContainer} from "react-toastify";
import './styles/react-toastify.scss';
import AppLayout from './pages/AppLayout';
import {withSus} from './components/TheSuspense';
import RequireInit from "./components/RequireInit";
import RequireAuth from "./components/RequireAuth";

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
