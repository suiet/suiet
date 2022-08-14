import { useState } from "react";
import "./index.scss";
import Wallet from "./wallet";

function SettingPage() {
  const [curSetting, setSetting] = useState("");

  switch (curSetting) {
    case "wallet":
      return <Wallet />;
    default:
      break;
  }

  return (
    <div className="settings-container">
      <div
        onClick={() => {
          setSetting("wallet");
        }}
        className="settings-item"
      >
        <span className="icon-wallet"></span>Wallet
      </div>
      <div
        onClick={() => {
          setSetting("network");
        }}
        className="settings-item"
      >
        <span className="icon-network"></span>Network
      </div>
      <div
        onClick={() => {
          setSetting("security");
        }}
        className="settings-item"
      >
        <span className="icon-security"></span>Security
      </div>
      <div className="app-version">version v0.0.1</div>
    </div>
  );
}

export default SettingPage;
