import Header from "./Header";
import Menu from "./Menu";
import styles from "./index.module.scss";

function MainPage() {
  return (
    <div className={styles['main-page']}>
      <Header />
      <div className={styles['main-content']}>
        <div className={styles['sui-amount']}>1.002 SUI</div>
        <div className={styles['account']}>0x2152f....01f6</div>
        <div className={styles['operations']}>
          <div className={styles['airdrop']}>
            <span className={styles['icon']} />
            Airdrop
          </div>
          <div className={styles['receive']}>
            <span className={styles['icon']} />
            Receive
          </div>
          <div className={styles['send']}>
            <span className={styles['icon']} />
            Send
          </div>
        </div>
      </div>

      <Menu className="mt-auto" />
    </div>
  );
}

export default MainPage;
