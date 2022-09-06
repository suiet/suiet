import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
// import { Wallet, WalletProvider } from '@mysten/wallet-adapter-react';
// import { SuiWalletAdapter } from "@mysten/wallet-adapter-all-wallets";
// import { WalletWrapper } from '@mysten/wallet-adapter-react-ui';

// const supportedWallets: Wallet[] = [
//   {
//     adapter: new SuiWalletAdapter(),
//   },
// ];

// function ConnectToWallet() {
//   return <WalletWrapper />;
// }
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <a href="https://vitejs.dev" target="_blank">
        <img
          src="/wallet-adapter-demo/public/vite.svg"
          className="logo"
          alt="Vite logo"
        />
      </a>
      <button>Connect</button>
    </div>
  );
}

export default function TheApp() {
  return <App />;
}
