import React, {lazy} from 'react';
import {Navigate, RouteObject} from "react-router-dom";
import RequireInit from "../components/RequireInit";
import RequireAuth from "../components/RequireAuth";
import AppLayout from "../pages/AppLayout";
import {withSus} from "../components/TheSuspense";

const MainPage = lazy(() => import('../pages/MainPage'));
const WelcomePage = lazy(() => import('../pages/OnBoarding/Welcome'));
const SettingPage = lazy(() => import('../pages/SettingsPage'));
const SendPage = lazy(() => import('../pages/SendPage'));
const TransacationFlowPage = lazy(() => import('../pages/TransactionFlow'));
const TransacationDetail = lazy(
  () => import('../pages/TransactionFlow/transactionDetail')
);
const CreateNewWallet = lazy(() => import("../pages/OnBoarding/CreateNewWallet"));
const ImportWallet = lazy(() => import("../pages/OnBoarding/ImportWallet"));
const LoginPage = lazy(() => import("../pages/LoginPage"));

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <RequireInit>
        <RequireAuth>
          <AppLayout/>
        </RequireAuth>
      </RequireInit>
    ),
    children: [
      {
        index: true,
        element: (<Navigate to="/home"/>)
      },
      {
        path: 'home',
        element: withSus(<MainPage />)
      },
      {
        path: 'send',
        element: withSus(<SendPage/>)
      },
      {
        path: 'transaction/flow',
        element: withSus(<TransacationFlowPage/>)
      },
      {
        path: 'transaction/detail/:id',
        element: withSus(<TransacationDetail/>)
      },
      {
        path: 'settings/*',
        element: withSus(<SettingPage/>)
      },
    ]
  },
  {
    path: 'onboard',
    children: [
      {
        index: true,
        element: (<Navigate to="/onboard/welcome"/>)
      },
      {
        path: 'welcome',
        element: withSus(<WelcomePage/>)
      },
      {
        path: 'create-new-wallet',
        element: withSus(<CreateNewWallet/>)
      },
      {
        path: 'import-wallet',
        element: withSus(<ImportWallet/>)
      },
    ]
  },
  {
    path: 'login',
    element: withSus(<LoginPage />)
  },
  {
    path: '*',
    element: (<Navigate to="/home"/>)
  }
]

export default routesConfig;