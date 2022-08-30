import { useState } from 'react';
import './index.scss';
import Wallet from './wallet';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Network from './network';
import Security from './security';
import {useDispatch, useSelector} from "react-redux";
import {resetAppContext} from "../../store/app-context";
import {AppDispatch} from "../../store";
import { useAccount } from "../../hooks/useAccount";
import { RootState } from "../../store";
import CopyIcon from "../../components/CopyIcon";
import toast from "../../components/toast";
import { addressEllipsis } from "../../utils/format";
import { coreApi } from "@suiet/core";

function SettingPage() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.appContext.token);
  const dispatch = useDispatch<AppDispatch>();
  const context = useSelector((state: RootState) => state.appContext)
  const {account} = useAccount(context.accountId);


  async function handleResetApp() {
    await coreApi.resetAppData(token)
    await dispatch(resetAppContext()).unwrap();
  }

  return (
    <div className="settings-container">
      <div className='address'>
        <span>{addressEllipsis(account.address)}</span>
        <CopyIcon className={'ml-[5px]'}
          copyStr={account.address}
          onCopied={() => toast.success('Copied Address')}
        />
      </div>
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
              <div
                onClick={() => handleResetApp()}
                className="settings-item"
              >
                <span className="icon-security"></span>Reset App
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
