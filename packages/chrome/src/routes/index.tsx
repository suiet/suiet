import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import RequireInit from '../components/RequireInit';
import RequireAuth from '../components/RequireAuth';
import AppLayout from '../pages/AppLayout';
import { withSus } from '../components/TheSuspense';

const MainPage = lazy(async () => await import('../pages/MainPage'));
const NFTPage = lazy(async () => await import('../pages/NFTPage'));
const NFTDetailPage = lazy(
  async () => await import('../pages/NFTPage/NftDetail')
);
const WelcomePage = lazy(
  async () => await import('../pages/OnBoarding/Welcome')
);
const SettingPage = lazy(async () => await import('../pages/SettingsPage'));
const SendPage = lazy(async () => await import('../pages/SendPage'));
const TransactionFlowPage = lazy(
  async () => await import('../pages/TransactionFlow')
);
const TransactionDetail = lazy(
  async () => await import('../pages/TransactionFlow/transactionDetail')
);
const CreateNewWallet = lazy(
  async () => await import('../pages/OnBoarding/CreateNewWallet')
);
const ImportWallet = lazy(
  async () => await import('../pages/OnBoarding/ImportWallet')
);
const LoginPage = lazy(
  async () => await import('../pages/OnBoarding/LoginPage')
);
const DappConnectPage = lazy(
  async () => await import('../pages/dapp/ConnectPage')
);

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <RequireInit>
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      </RequireInit>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: 'home',
        element: withSus(<MainPage />),
      },
      {
        path: 'nft',
        children: [
          {
            index: true,
            element: withSus(<NFTPage />),
          },
          {
            path: 'details',
            element: withSus(<NFTDetailPage />),
          },
        ],
      },
      {
        path: 'send',
        element: withSus(<SendPage />),
      },
      {
        path: 'transaction/flow',
        element: withSus(<TransactionFlowPage />),
      },
      {
        path: 'transaction/detail/:id',
        element: withSus(<TransactionDetail />),
      },
      {
        path: 'settings/*',
        element: withSus(<SettingPage />),
      },
    ],
  },
  {
    path: 'onboard',
    children: [
      {
        index: true,
        element: <Navigate to="/onboard/welcome" />,
      },
      {
        path: 'welcome',
        element: withSus(<WelcomePage />),
      },
      {
        path: 'create-new-wallet',
        element: withSus(<CreateNewWallet />),
      },
      {
        path: 'import-wallet',
        element: withSus(<ImportWallet />),
      },
    ],
  },
  {
    path: 'login',
    element: withSus(
      <RequireInit>
        <LoginPage />
      </RequireInit>
    ),
  },
  {
    path: 'dapp',
    element: (
      <RequireInit>
        <RequireAuth>
          <AppLayout hideAppLayout={true} />
        </RequireAuth>
      </RequireInit>
    ),
    children: [
      {
        path: 'connect',
        element: withSus(<DappConnectPage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" />,
  },
];

export default routesConfig;
