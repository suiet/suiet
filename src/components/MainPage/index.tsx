import Header from "./Header";
import Menu from "./Menu";
import TransacationFlow from "../TransactionFlow";
import "./index.scss";
import SettingPage from "../SettingsPage";

function MainPage() {
  return (
    <div className="main-page">
      <Header />
      {/* <div className="main-content">
        <div className="sui-amount">1.002 SUI</div>
        <div className="account">0x2152f....01f6</div>
        <div className="operations">
          <div className="airdrop">
            <span className="icon" />
            Airdrop
          </div>
          <div className="receive">
            <span className="icon" />
            Receive
          </div>
          <div className="send">
            <span className="icon" />
            Send
          </div>
        </div>
      </div> */}
      <TransacationFlow />
      <SettingPage />
      <Menu />
    </div>
  );
}

export default MainPage;
