import { useState } from 'react';
import './index.scss';
import Wallet from './wallet';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Network from './network';
import Security from './security';

function SettingPage() {
  const navigate = useNavigate();
  return (
    <div className="settings-container">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div
                onClick={() => {
                  navigate('wallet');
                }}
                className="settings-item"
              >
                <span className="icon-wallet"></span>Wallet
              </div>
              <div
                onClick={() => {
                  navigate('network');
                }}
                className="settings-item"
              >
                <span className="icon-network"></span>Network
              </div>
              <div
                onClick={() => {
                  navigate('security');
                }}
                className="settings-item"
              >
                <span className="icon-security"></span>Security
              </div>
              <div className="app-version">version v0.0.1</div>
            </>
          }
        />
        <Route path="wallet" element={<Wallet />} />
        <Route path="network" element={<Network />} />
        <Route path="security" element={<Security />} />
      </Routes>
    </div>
  );
}

export default SettingPage;
