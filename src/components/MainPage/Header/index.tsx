import "./index.scss";

function Header() {
  return (
    <div className="header-container">
      <div className="avatar" />
      <div className="num">Account1</div>
      <div className="account">
        0x2152f....01f6 <span></span>
      </div>
      <div className="net">devnet</div>
    </div>
  );
}
export default Header;
