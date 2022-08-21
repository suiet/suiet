import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { withSus } from './components/TheSuspense';

import './App.css';
import TransacationFlow from './pages/TransactionFlow';

const MainPage = lazy(() => import('./pages/MainPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SettingPage = lazy(() => import('./pages/SettingsPage'));
const SendPage = lazy(() => import('./pages/SendPage'));
const TransacationFlowPage = lazy(() => import('./pages/TransactionFlow'));
const TransacationDetail = lazy(
  () => import('./pages/TransactionFlow/transactionDetail')
);

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={withSus(<MainPage />)} />
          <Route path={'send'} element={withSus(<SendPage />)} />
          <Route
            path="transaction/flow"
            element={withSus(<TransacationFlowPage />)}
          />
          <Route
            path="transaction/detail/:id"
            element={withSus(<TransacationDetail />)}
          />
          <Route path="settings/*" element={withSus(<SettingPage />)} />
        </Route>
        <Route path="login" element={withSus(<LoginPage />)} />
      </Routes>
    </div>
  );
}

export default App;
