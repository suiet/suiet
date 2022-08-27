import "./wallet.scss";
import "./common.scss";
import classnames from "classnames";
import Button from "../../components/Button";
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
      <div className="flex flex-col gap-2 mt-2">
        <Button state="primary">Save</Button>
        <Button>Cancel</Button>
      </div>
    </div>
  );
}

export default Wallet;
