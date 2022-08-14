import "./wallet.scss";
import "./common.scss";
import classnames from "classnames";

function Wallet() {
  return (
    <div className="wallet-setting-container">
      <div className="setting-title">wallet</div>
      <div className="setting-desc">Manage your wallet informations here.</div>
      <div
        className="wallet-item-title"
        style={{
          marginTop: 27,
        }}
      >
        icon
      </div>
      <div className="wallet-item-title">Name</div>
      <input className="wallet-name-input" value="Sui wllet #1" />
      <div className={classnames("setting-btn", "wallet-save")}>Save</div>
      <div className={classnames("setting-btn", "wallet-cancel")}>Cancel</div>
    </div>
  );
}

export default Wallet;
