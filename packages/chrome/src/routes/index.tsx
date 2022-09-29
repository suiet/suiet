import { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import RequireInit from '../components/RequireInit';
import AppLayout from '../layouts/AppLayout';
import { withSus } from '../components/TheSuspense';
import Session from '../components/Session';

const MainPage = lazy(async () => await import('../pages/MainPage'));
const NFTPage = lazy(async () => await import('../pages/NFTPage'));
const NFTDetailPage = lazy(
  async () => await import('../pages/NFTPage/NftDetail')
);
const WelcomePage = lazy(
  async () => await import('../pages/onboarding/WelcomePage')
);
const SettingPage = lazy(async () => await import('../pages/SettingsPage'));
const SettingWalletPage = lazy(
  async () => await import('../pages/SettingsPage/wallet')
);
const SettingNetworkPage = lazy(
  async () => await import('../pages/SettingsPage/network')
);
const SettingSecurityPage = lazy(
  async () => await import('../pages/SettingsPage/security')
);
const SendPage = lazy(async () => await import('../pages/SendPage'));
const TransactionFlowPage = lazy(
  async () => await import('../pages/TransactionFlow')
);
const TransactionDetail = lazy(
  async () => await import('../pages/TransactionFlow/transactionDetail')
);
const CreateNewWalletPage = lazy(
  async () => await import('../pages/onboarding/CreateNewWalletPage')
);
const ImportWalletPage = lazy(
  async () => await import('../pages/onboarding/ImportWalletPage')
);
const DappConnectPage = lazy(
  async () => await import('../pages/dapp/ConnectPage')
);
const DappTxApprovePage = lazy(
  async () => await import('../pages/dapp/TxApprovePage')
);

const routesConfig: RouteObject[] = [
  {
    path: '/',
    element: (
      <RequireInit>
        <Session>
          <Outlet />
        </Session>
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
        path: 'settings',
        children: [
          {
            index: true,
            element: withSus(<SettingPage />),
          },
          {
            path: 'wallet',
            element: withSus(<SettingWalletPage />),
          },
          {
            path: 'network',
            element: withSus(<SettingNetworkPage />),
          },
          {
            path: 'security/*',
            element: withSus(<SettingSecurityPage />),
          },
        ],
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
        element: withSus(<CreateNewWalletPage />),
      },
      {
        path: 'import-wallet',
        element: withSus(<ImportWalletPage />),
      },
    ],
  },
  {
    path: 'wallet/*',
    element: (
      <Session>
        <Outlet />
      </Session>
    ),
    children: [
      // reuse page component but with session project
      {
        path: 'create',
        element: withSus(<CreateNewWalletPage />),
      },
      {
        path: 'import',
        element: withSus(<ImportWalletPage />),
      },
    ],
  },
  {
    path: 'dapp',
    element: (
      <RequireInit>
        <Session>
          <Outlet />
        </Session>
      </RequireInit>
    ),
    children: [
      {
        path: 'connect',
        element: withSus(<DappConnectPage />),
      },
      {
        path: 'tx-approval',
        element: withSus(<DappTxApprovePage />),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" />,
  },
];

export default routesConfig;
