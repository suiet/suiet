import styles from "./index.module.scss";
import {Link} from "react-router-dom";

export default function MainPage() {
  return (
    <div className={styles['main-page']}>
      <div className={styles['suiet-title']}>Suiet</div>
      <div className={styles['create-new-btn']}><Link to={'/settings'}>Create New</Link></div>
      <div className={styles['import-wallet-btn']}>Import Wallet</div>
    </div>
  );
}
